import { z } from "zod";

export const emailValidation = z.string().email().refine((email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email), {
    message:"invalid email format"
})

export const signUpSchema = z.object({
    name: z.string().max(10, {message:"name must be less than 10 characters"}).min(4, {message:"name must be atleast 4 characters"}),
    email: emailValidation,
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    verifyCode: z.string(),
    verifyCodeExpiry: z.date(),
});