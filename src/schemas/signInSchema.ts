import { z } from "zod";
import { emailValidation } from "./signUpSchema";

export const signInSchema = z.object({
    email: emailValidation,
    password: z.string().min(8, {message:"password must be atleast 8 characters."})
});