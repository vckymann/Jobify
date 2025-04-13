import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User";
import { emailValidation} from "@/schemas/signUpSchema";
import { z } from "zod";

export const emailSchema = z.object({
    email:emailValidation
})

export async function GET (req:Request) {
    await dbConnect();

    try { 
        const { searchParams } = new URL(req.url)
        const queryParam = {
            email:searchParams.get("email")
        }
        const result = emailSchema.safeParse(queryParam)
        if (!result.success) {
            const usernameErrors = result.error.format().email?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(", ") : "Invalid username"
            }, {status: 400}) 
        }

        const { email } = result.data        

        const existingUser = await UserModel.find({email:email})
        
        if(existingUser.length > 0 && existingUser[0].isVerified) {
            return Response.json({
                success:false,
                message:"This email is already in use"
            }, {status:400})            
        }

        return Response.json({
            success:true,
            message:"username is available"
        }, {status:200})

    } catch (error) {
        console.log("error checking username",error);
        
        return Response.json
        ({
            success:false,
            message:"error checking username"
        }, {status:500})
    };
}