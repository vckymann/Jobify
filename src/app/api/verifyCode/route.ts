import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas/verifySchema";
import { z } from "zod";

export const EmailSchema = z.object({
    email: z.string().email(),
}); 

export async function GET(req:Request) {
    await dbConnect();
    const {searchParams} = new URL(req.url)
    const email = searchParams.get("email")
    
    const user = await UserModel.findOne({email:email});

    if (!user) {
        return Response.json({
            success:false,
            message:"user not found"
        }, {status:400})
    }

    return Response.json({
        success:true,
        message:"because I'm using unpaid services, verification code is not sent to every email. So i am providing the verification code by myself.",
        data:user.verifyCode
    }, {status:200})
}

export async function POST(req: Request) {
    await dbConnect();

    const {email, verifyCode} = await req.json();    
    const decodedEmail = decodeURIComponent(email)
    

    const validateEmail = async (email: string) => {
        const result = EmailSchema.safeParse({ email });

        if (!result.success) {
            return Response.json({
                success:false,
                message:`Invalid email: ${result.error.format().email?._errors.join(", ")}`
            })
        }

        return result.data.email;
    }

    const validateVerifyCode = async (verifyCode: string) => {
        const result = verifySchema.safeParse({verifyCode})

        if (!result.success) {
            return Response.json({
                success:false,
                message:`Invalid email: ${result.error.format().verifyCode?._errors.join(", ")}`
            })
        }
        return result.data.verifyCode
    }

    const validatedEmail = await validateEmail(decodedEmail);
    const validatedVerifyCode = await validateVerifyCode(verifyCode);

    try {
        const user = await UserModel.findOne({email:validatedEmail });

        if (!user) {
            return Response.json({ success: false, message: "user not found" }, { status: 400 });
        }

        const isCodeValid = user.verifyCode === validatedVerifyCode
        const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();

        if (isCodeValid && !isCodeExpired) {
            user.isVerified = true;
            await user.save();
            return Response.json({ success: true, message: "user verified successfully" }, { status: 200 });
        } else if (isCodeExpired) {
            return Response.json({ success: false, message: "verification code expired, try signing up again" }, { status: 400 });
        } else {
            return Response.json({ success: false, message: "invalid verification code" }, { status: 400 });
        }
    } catch (error) {
        console.error(error, "error verifying user");
        return Response.json({ success: false, message: "an error occurred" }, { status: 500 });
    }
}