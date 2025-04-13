import { z } from "zod";

export const verifySchema = z.object({
    verifyCode: z.string().length(7, "Verification code must be 7 digits"),
});