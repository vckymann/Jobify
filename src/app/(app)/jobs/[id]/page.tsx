'use client';

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { 
  IconBadge, IconCheck, IconClock, IconBriefcase, IconCopy, IconSourceCode, IconCash, IconArrowLeft 
} from "@tabler/icons-react";
import CircularProgressCountUp from "@/components/progress";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";
import { addSavedJob } from "@/store/slices/jobsSlice";
import { NormalizedJob } from "@/types/job";

export default function Page() {
  const selectedJob: NormalizedJob = useSelector((state: RootState) => state.jobs.selectedJob[0]);
  const savedJobs = useSelector((state: RootState) => state.jobs.savedJobs);
  const savedJobsIds = savedJobs.map((job) => job.jobId);
  const router = useRouter();
  const dispatch = useDispatch();

  if (!selectedJob) {
    router.push('/'); // fallback if someone visits URL directly
    return null;
  }

  return (
    <div className="p-6 w-full max-w-2xl mx-auto dark:text-white text-black">
      {/* Back Button */}
      <button 
        className="mb-6 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-700 transition flex items-center"
        onClick={() => router.back()}
      >
        <IconArrowLeft stroke={2.5} className="w-6 h-6 mr-2" /> Back
      </button>

      {/* Company Header */}
      <h2 className="text-3xl font-semibold mb-2">{selectedJob.company}</h2>
      <div className="text-sm text-neutral-500 dark:text-neutral-400">{selectedJob.company} | {selectedJob.location}</div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mt-6">
        <a target="_blank" href={selectedJob.jobUrl} className="w-max">
          <button className="bg-indigo-600 hover:opacity-90 text-white font-semibold py-2 px-4 rounded-lg border border-neutral-300 dark:border-neutral-700 transition">
            Apply Now
          </button>
        </a>

        <button 
          disabled={selectedJob.saved || savedJobsIds.includes(selectedJob.jobId)}
          onClick={async () => {
            try {
              const response = await axios.post(`/api/savedJobs`, { job: selectedJob });
              if (response.status === 200) {
                toast({ title: "Job saved", description: "Job saved to your saved jobs" });
                dispatch(addSavedJob(selectedJob));
              }
            } catch (error) {
              const axiosError = error as AxiosError<ApiResponse>;
              toast({
                title: "Failed to save job",
                description: axiosError.response?.data.message,
              });
            }
          }}
          className="relative group w-max bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition disabled:opacity-50"
        >
          {selectedJob.saved || savedJobsIds.includes(selectedJob.jobId) ? <IconCheck /> : <IconBadge className="rotate-180" />}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
            Save job
          </span>
        </button>

        <button 
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast({
              title: "Copied to clipboard",
              description: "Link copied to clipboard",
            })
          }}
          className="relative group w-max bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-black dark:text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition"
        >
          <IconCopy />
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
            Copy link
          </span>
        </button>
      </div>

      {/* Job Details */}
      <div className="mt-10 space-y-6">
        {selectedJob.matchScore !== undefined && (
          <div>
            <p className="text-md font-semibold mb-2">AI MatchScore</p>
            <CircularProgressCountUp detailSection key={selectedJob.jobId} matchScore={selectedJob.matchScore} />
          </div>
        )}

        <div>
          <p className="text-md font-semibold flex items-center gap-2"><IconCash /> Pay</p>
          <p className="mt-2 text-sm bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white border px-2 py-1 rounded-sm inline-block">
            ${selectedJob.minSalary} - ${selectedJob.maxSalary} / year
          </p>
        </div>

        <div>
          <p className="text-md font-semibold flex items-center gap-2"><IconBriefcase /> Job type</p>
          <p className="mt-2 text-sm bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white border px-2 py-1 rounded-sm inline-block capitalize">
            {selectedJob.contractType}
          </p>
        </div>

        <div>
          <p className="text-md font-semibold flex items-center gap-2"><IconClock /> Posted on</p>
          <p className="mt-2 text-sm bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white border px-2 py-1 rounded-sm inline-block">
            {new Date(selectedJob.jobPosted).toDateString()}
          </p>
        </div>

        <div>
          <p className="text-md font-semibold flex items-center gap-2"><IconSourceCode /> Source</p>
          <p className="mt-2 text-sm px-2 py-1 rounded-sm inline-block font-semibold bg-orange-300 text-orange-600">
            {selectedJob.source}
          </p>
        </div>

        {/* Job Description */}
        <h3 className="font-semibold text-xl mt-8">Job description</h3>
        <p className="mt-4 text-neutral-700 dark:text-neutral-300">{selectedJob.description}</p>
        <p className="mt-4 text-neutral-500 dark:text-neutral-400">
          To view the full job listing click 
          <a target="_blank" className="ml-1 text-indigo-600 dark:text-indigo-400 underline" href={selectedJob.jobUrl}>here</a>
        </p>
      </div>
    </div>
  );
}
