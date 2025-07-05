import mongoose, { Schema, Document } from "mongoose";  
import { NormalizedJob } from "@/types/job";

export interface NormalizedJobDocument extends Document, NormalizedJob {
    
}

const jobSchema: Schema<NormalizedJobDocument> = new Schema({
    jobId: { type: String, required: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    minSalary: { type: Number, required: true },
    maxSalary: { type: Number, required: true },
    jobPosted: { type: String, required: true },
    jobUrl: { type: String, required: true },
    contractType: { type: String, required: true },
    source: { type: String, required: true },
    matchScore: { type: Number, required: false, },
    saved: { type: Boolean, required: false, default: false },
},{ _id: false });

export interface User extends Document {
    name: string;
    email: string;
    password: string;
    verifyCode : string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    useAi: boolean;  
    savedJobs: NormalizedJobDocument[];
    resume: string;  
}

const userSchema: Schema<User> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: [true, "Email is required"], unique:true},
    password: { type: String, required: [true, "Password is required"] },
    verifyCode: { type: String, required: [true, "Verification code is required"] },
    verifyCodeExpiry: { type: Date, required: [true, "Verification code expiry is required"] },
    isVerified: { type: Boolean, required: true, default: false },
    useAi: { type: Boolean, required: true, default: false },
    savedJobs: { type: [jobSchema], _id:false },    
    resume: { type: String, required: false },
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema);

export default UserModel;