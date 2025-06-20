'use client';

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { IconBadge, IconCheck, IconClock, IconBriefcase, IconCopy, IconSourceCode, IconCash, IconArrowLeft } from "@tabler/icons-react";
import CircularProgressCountUp from "@/components/progress";
import { toast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";
import { addSavedJob } from "@/store/slices/jobsSlice";
import { useDispatch } from "react-redux";
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
    <div className="p-4 w-full max-w-2xl mx-auto dark:text-white text-black">
      <button className="mb-4 px-2 py-2 hover:dark:bg-neutral-700 hover:bg-gray-200 rounded-lg border border-gray-400" onClick={() => router.back()}><IconArrowLeft stroke={2.5} className="w-6 h-6" /></button>
      <h2 className="text-3xl font-bold mb-4">{selectedJob.company}</h2>
      <div className="text-gray-600 dark:text-white">{selectedJob.company} | {selectedJob.location}</div>

      <div className="flex gap-4 mt-4">
        <a target="_blank" href={selectedJob.jobUrl}>
          <button className="bg-blue-500 hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg border border-gray-400">Apply Now</button>
        </a>

        <button disabled={selectedJob.saved || savedJobsIds.includes(selectedJob.jobId)} onClick={async () => {
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
        }} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 text-white font-bold py-2 px-4 rounded-lg dark:bg-neutral-800 dark:hover:bg-neutral-600 relative group">
          {selectedJob.saved || savedJobsIds.includes(selectedJob.jobId) ? <IconCheck className="text-black dark:text-white" /> : <IconBadge className="rotate-180 text-black dark:text-white" />}
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 text-nowrap group-hover:opacity-100 transition">
            Save job
          </span>
        </button>

        <button onClick={() => {
          navigator.clipboard.writeText(window.location.href)
          toast({
            title: "Copied to clipboard",
            description: "Link copied to clipboard",
          })
        }} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 text-white dark:bg-neutral-800 dark:hover:bg-neutral-600 font-bold py-2 px-4 rounded-lg relative group">
          <IconCopy className="text-black dark:text-white" />
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 text-nowrap group-hover:opacity-100 transition">
            Copy link
          </span>
        </button>
      </div>

      <div className="mt-8">
        <h3 className="font-bold text-xl">Job details</h3>

        {selectedJob.matchScore !== undefined && (
          <>
            <p className="text-md font-semibold mt-6 mb-2">Ai MatchScore</p>
            <CircularProgressCountUp detailSection key={selectedJob.jobId} matchScore={selectedJob.matchScore} />
          </>
        )}

        <p className="text-md font-semibold mt-8 flex items-center gap-2"><IconCash /> Pay</p>
        <p className="mt-2 text-sm bg-gray-300 dark:bg-neutral-800 text-black dark:text-white border px-2 py-1 rounded-sm inline-block">
          ${selectedJob.minSalary} - ${selectedJob.maxSalary} / year
        </p>

        <p className="text-md font-semibold mt-6 flex items-center gap-2"><IconBriefcase /> Job type</p>
        <p className="mt-2 text-sm bg-gray-300 dark:bg-neutral-800 text-black dark:text-white border px-2 py-1 rounded-sm inline-block capitalize">
          {selectedJob.contractType}
        </p>

        <p className="text-md font-semibold mt-6 flex items-center gap-2"><IconClock /> Posted on</p>
        <p className="mt-2 text-sm bg-gray-300 dark:bg-neutral-800 text-black dark:text-white border px-2 py-1 rounded-sm inline-block">
          {new Date(selectedJob.jobPosted).toDateString()}
        </p>

        <p className="text-md font-semibold mt-6 flex items-center gap-2"><IconSourceCode /> Source</p>
        <p className={`mt-2 text-sm px-2 py-1 rounded-sm inline-block font-semibold "bg-orange-300 text-orange-600"`}>
          {selectedJob.source}
        </p>

        <h3 className="font-bold text-xl mt-10">Job description</h3>
        <p className="mt-4 text-gray-700 dark:text-neutral-300 font-semibold">{selectedJob.description}</p>

        <p className="mt-4 text-gray-600 dark:text-neutral-400">To view the full job listing click <a target="_blank" className="cursor-pointer text-blue-500 underline" href={selectedJob.jobUrl}>here</a></p>
      </div>
    </div>
  );
}