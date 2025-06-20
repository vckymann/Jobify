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

    const url = new URL(request.url);
    const params = Object.fromEntries(url.searchParams.entries());

    if(params) {                                        
        adzunaJobsUrl = buildUrl(adzunaJobsUrl, params, "adzuna");
    }
    

    const useAi = user?.useAi

    console.log("adzunaJobsUrl",adzunaJobsUrl);    

    try {
        const adzunaJobs = await axios.get(adzunaJobsUrl);                     
            
        const normalizeAdzunaResponse = normalizeJobs(adzunaJobs.data.results, "adzuna");

        const normalizedJobs = [...normalizeAdzunaResponse];                    
        

        if (normalizedJobs.length > 0) {
            if(useAi) {
                 const processedJobs = await processJobsWithAI(normalizedJobs, user.email);                 

                 if(!processedJobs.success) {
                     return Response.json({
                         success: false,
                         message: processedJobs.message,                         
                     })
                 }

                 return Response.json(processedJobs);
            }
            return Response.json({
                success: true,
                message: "Success",
                data: normalizedJobs
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


