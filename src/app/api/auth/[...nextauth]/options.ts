import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = { 
    providers: [
        CredentialsProvider({
            id:"credentials",
            name: "Credentials",
            credentials: {
                identifier: {label: "Email", type: "text", placeholder: "email"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials : any): Promise<any> {
                await dbConnect();
                try {
                    console.log(credentials.identifier);
                    
                   const user = await UserModel.findOne({
                        email: credentials.identifier,
                    })

                    console.log(user);
                    

                    if (!user) {
                    throw new Error("Invalid Email");
                    }

                    if (!user.isVerified) {
                        throw new Error("please verify your account first");
                    }

                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }

                    return user

                } catch (error: any) {
                    throw new Error(error)                                          
                }
            }
        })
    ],
    callbacks: {
        async jwt({user, token}) {            
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified
                token.useAi = user.useAi
                token.name = user.name
            }
            return token
        },
        async session({session, token}) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.useAi = token.useAi
                session.user.name = token.name
            }
            return session
        }
    },
    pages: {
        signIn: "/sign-in",        
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET
}
