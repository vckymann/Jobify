import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";


import { sendEmail } from "@/lib/resend";

export async function POST(req: Request): Promise<Response> {
    await dbConnect();

    try {

       const { name, email, password } =  await req.json();              

       const existingUserByEmail = await UserModel.findOne({email})
       const verifyCode = Math.floor(100000 + Math.random() * 9000000).toString();
       

       if (existingUserByEmail) {

                if (existingUserByEmail.isVerified) {
                    return Response.json({
                        success: false,
                        message: "user already exists",                    
                    },{status:400})
                } else {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    existingUserByEmail.password = hashedPassword;
                    existingUserByEmail.verifyCode = verifyCode;
                    existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                    await existingUserByEmail.save();

                    return Response.json({
                        success:true,
                        message:"user updated with new password, please verify your account"
                    }, {status:200})
                }

        } else {

           const hashedPassword = await bcrypt.hash(password, 12);
           const expiryDate = new Date();
           expiryDate.setHours(expiryDate.getHours() + 1);

           const newUser = await new UserModel({
            name,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerified: false,
            isAcceptingMessages: true,
            messages: []
           })

           await newUser.save();

        }

        const emailResponse = await sendEmail(email, name, verifyCode);        

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {status: 500})
        }

        return Response.json({
            success: true,
            message: "user registered successfully, please check your email to verify your account"
        }, {status: 200})

     } catch (error) {

        console.error('Error registering user', error);
        return Response.json({
            success: false,
            message: "failure in registering user"
        })
    }    
}