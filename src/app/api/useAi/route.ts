import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(req: Request) {
    await dbConnect();
     const session = await getServerSession(authOptions);
     const userId = session?.user._id

     if (!session || !userId) {
        return Response.json({
            success: false,
            message: "user is not logged in"
        }, {status: 401})
     }

     const { useAi } = await req.json();
     console.log("useAi",useAi);
     
     try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { useAi: useAi }, { new: true });
        console.log("updatedUser",updatedUser);
        

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "user not found please login again"
            }, {status: 401})
        }

        

        return Response.json({
            success: true,
            message: `now ${useAi ? "using" : "not using"} ai`,
            updatedUser
        })


     } catch (error) {
        console.log("failed to use ai",error);
        return Response.json({
            success: false,
            message: "failed to use ai"
        }, {status: 500})
        
     }


}

export async function GET() {
    await dbConnect();
     const session = await getServerSession(authOptions);
     const userId =session?.user._id

     if (!session || !userId) {
        return Response.json({
            success: false,
            message: "user is not logged in"
        }, {status: 401})
     }

     try {
        const foundUser = await UserModel.findById(userId);

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "user not found"
            }, {status: 404})
        }

        return Response.json({
            success: true,
            message:"user is using ai",
            useAi: foundUser.useAi
        })

     } catch (error) {
        console.log("failed to get useAi status",error);
        return Response.json({
            success: false,
            message: "failed to get useAi status"
        }, {status: 500})
     }
     }