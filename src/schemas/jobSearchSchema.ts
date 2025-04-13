import { z } from "zod";

export const jobSearchSchema = z.object({
  keyword: z.string().optional(),
  location: z.string().optional(),
  jobType: z.enum(["full-time", "part-time", ""]).optional(),
  datePosted: z.enum(["24", "3", "7", ""]).optional(),
  remote: z.enum(["true", "false", ""]).optional(),
  radius: z.enum(["10", "15", "25", ""]).optional(),
  page: z.string().optional(),
});

