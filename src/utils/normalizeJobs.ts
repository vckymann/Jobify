import { UsaJobsApiJob, AdzunaApiJob, NormalizedJob } from "@/types/job";

export const normalizeJobs = (jobs: UsaJobsApiJob[] | AdzunaApiJob[] , source: string): NormalizedJob[] => {
    return jobs.map((job: AdzunaApiJob | UsaJobsApiJob) => {   
        if (source === "adzuna") {
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
        } else {
            job = job as UsaJobsApiJob;
            return {
                jobId: job.MatchedObjectId,
                title: job.MatchedObjectDescriptor.PositionTitle,
                company: job.MatchedObjectDescriptor.OrganizationName,
                description: job.MatchedObjectDescriptor.UserArea.Details.JobSummary,                
                location: job.MatchedObjectDescriptor.PositionLocation[0].LocationName,
                minSalary: job.MatchedObjectDescriptor.PositionRemuneration[0].MinimumRange,
                maxSalary: job.MatchedObjectDescriptor.PositionRemuneration[0].MaximumRange,
                jobPosted: job.MatchedObjectDescriptor.PublicationStartDate,
                jobUrl: job.MatchedObjectDescriptor.ApplyURI[0],
                contractType: job.MatchedObjectDescriptor.PositionSchedule[0].Name || "Full-Time",
                source
            }             
        }            
    })
}