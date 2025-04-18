import { NormalizedJob } from "@/types/job";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {

    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) {
        return Response.json({
            success:false,
            message:'user is not logged in'
        },{status:404})
    }

    const email = session?.user.email

    console.log(email);        

    try {

        const user = await UserModel.findOne({email});

        if (!user) {
            return Response.json({ success : false, message: 'User not found' }, { status: 404 });
        }

        return Response.json({ success: true, message: 'Saved jobs fetched successfully', data: user.savedJobs }, { status: 200 });
    } catch (error) {
        
        console.log("error in fetching saved jobs",error);
        return Response.json({ success: false, message: 'Error fetching saved jobs' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {

    await dbConnect();
    const job = await req.json();
    console.log("job",job);
    

    const session = await getServerSession(authOptions);
    const email = session?.user.email

    if (!session) {
        return Response.json({
            success:false,
            message:'user is not logged in'
        },{status:404})        
    }

    try {
        const user = await UserModel.findOne({email});

        if (!user) {
            return Response.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        user.savedJobs = user.savedJobs.filter((savedJob:NormalizedJob) => savedJob.jobId !== job.jobId);
        console.log(user.savedJobs);
        
        await user.save();

        return Response.json({ success: true, message: 'Job deleted successfully' }, { status: 200 });
        
    } catch (error) {
        console.log("error in deleting job",error);
        return Response.json({ success: false, message: 'Error deleting job' }, { status: 500 });
    }
}

export async function POST(req: Request) {

    await dbConnect();
   const { job } = await req.json();

   const session = await getServerSession(authOptions);
   const email = session?.user.email

   console.log("email",email, "job",job);      

   try {

    const user = await UserModel.findOne({email});

    if (!user ) {
        return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    if(user.savedJobs.map((savedJob) => savedJob.jobId === job.jobId).includes(true)) {
        return Response.json({ success: false, message: 'Job already saved' }, { status: 404 });
    }

    user.savedJobs.push(job);
    await user.save();

    return Response.json({ success: true, message: 'Job saved successfully' }, { status: 200 });

   } catch (error) {
    console.log("error in saving job",error);
    return Response.json({ success: false, message: 'Error saving job' }, { status: 500 });
   }
}
