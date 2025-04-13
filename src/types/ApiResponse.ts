import { NormalizedJob } from "./job";

export interface ApiResponse {
    success: boolean;
    message: string; 
    useAi?: boolean;
    data?: Array<NormalizedJob>;
}