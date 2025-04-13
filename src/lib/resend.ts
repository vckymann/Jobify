import { Resend } from "resend";
import { EmailTemplate } from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
    email: string,
    name: string,
    otp: string
): Promise<ApiResponse> {
    
    try {

        await resend.emails.send({
            from: 'onresend@resend.dev',
            to: email,
            subject: 'Welcome to Jobify',
            react: EmailTemplate({ name, otp })
        })

        return { success: true, message: "verification email sent successfully" };
        
     } catch (error) { 
        console.error(error, "error sending verificationEmail email");
        return {success: false, message: "failure in sending verification email"}
    }
    
}