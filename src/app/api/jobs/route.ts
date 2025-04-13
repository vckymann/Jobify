import axios from "axios";
import { normalizeJobs } from "@/utils/normalizeJobs";
import { processJobsWithAI } from "@/app/api/helper/aiService";
import { buildUrl } from "@/utils/helpers/buildUrl";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";

export async function GET(request: Request): Promise<Response> {

    await dbConnect();

    const session = await getServerSession(authOptions);
    
    const user = await UserModel.findOne({email: session?.user.email});    

    if (!user || !session) return Response.json({
        success: false,
        message: "User not found" 
    }, { status: 404 });

    let adzunaJobsUrl = process.env.NEXT_PUBLIC_ADZUNA_BASE_URL || "";    
    let usaJobsUrl = process.env.NEXT_PUBLIC_USAJOBS_BASE_URL || "";

    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());

    if(params) {                                

        adzunaJobsUrl = buildUrl(adzunaJobsUrl, params, "adzuna");
        usaJobsUrl = buildUrl(usaJobsUrl, params, "usaJobs");        
    }
    

    const useAi = user?.useAi

    console.log("adzunaJobsUrl",adzunaJobsUrl);
    console.log("usaJobsUrl",usaJobsUrl);
    

    try {
        const adzunaResponse = await axios.get(adzunaJobsUrl);

        const usaJobsResponse = await axios.get(usaJobsUrl, {
            headers: {
                'Host': process.env.NEXT_PUBLIC_USAJOBS_HOST,
                'User-Agent': process.env.NEXT_PUBLIC_USAJOBS_USER_AGENT,
                'Authorization-key': process.env.NEXT_PUBLIC_USAJOBS_API_KEY,
            }
        });
         

        const [adzunaJobs, usaJobs] = await Promise.all([adzunaResponse, usaJobsResponse]);
        
        console.log(adzunaJobs.data.results, usaJobs.data.SearchResult.SearchResultItems);
        

        const normalizeAdzunaResponse = normalizeJobs(adzunaJobs.data.results, "adzuna");
        const normalizeUsaJobsResponse = normalizeJobs(usaJobs.data.SearchResult.SearchResultItems, "usaJobs");

        const normalizedJobs = [...normalizeAdzunaResponse, 
            ...normalizeUsaJobsResponse    
        ];
        
        console.log(normalizedJobs.length);

        const jobsWithSavedStatus = normalizedJobs.map((job) => {
            const existingJob = user.savedJobs && user.savedJobs.find((savedJob) => savedJob.jobId === job.jobId);
            if (existingJob) {
                return {
                    ...job,
                    saved: true
                }
            }
            return job
        })
        
        
        

        if (jobsWithSavedStatus.length > 0) {
            if(useAi) {
                 const processedJobs = await processJobsWithAI(jobsWithSavedStatus, user.email);                 

                 if(!processedJobs.success) {
                     return Response.json({
                         success: false,
                         message: processedJobs.message,
                         data: jobsWithSavedStatus
                     })
                 }

                 return Response.json(processedJobs);
            }
            return Response.json({
                success: true,
                message: "Success",
                data: jobsWithSavedStatus
            })
        }

        return Response.json({
            success: false,
            message: "Error in fetching jobs",        
        }, {status: 500}) 

    } catch (error) {

        console.log("Error in fetching jobs", error);
        
        return Response.json({
            success: false,
            message: "Error in fetching jobs",
        }, {status: 500})
    } 
}


