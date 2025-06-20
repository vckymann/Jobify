import { AdzunaApiJob, NormalizedJob } from "@/types/job";

export const normalizeJobs = (jobs: AdzunaApiJob[] , source: string): NormalizedJob[] => {
    return jobs.map((job: AdzunaApiJob) => {   
        job = job as AdzunaApiJob;
        return {
            jobId: job.id,
            title: job.title,
            company: job.company.display_name,
            description: job.description,
            location: job.location.display_name,
            minSalary: job.salary_min,
            maxSalary: job.salary_max,
            jobPosted: job.created,
            jobUrl: job.redirect_url,
            contractType: job.contract_time || "Not Specified",
            source
        }                      
    })
}