"use client"
import { useRouter} from "next/navigation"
import { NavbarDemo } from '@/components/navbar'
import { Divider, useMediaQuery } from '@mui/material';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { NormalizedJob } from "@/types/job";
import { useDispatch } from "react-redux";
import { addSavedJob, setSelectedJob } from "@/store/slices/jobsSlice";
import { IconBadge, IconBriefcase, IconCash, IconCheck, IconClock, IconCopy } from "@tabler/icons-react";
import { Loader } from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import CircularProgressCountUp from "@/components/progress";


function Page() {

  const router = useRouter();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const dispatch = useDispatch();    

  const jobs: NormalizedJob[] = useSelector((state: RootState ) => state.jobs.jobs);
  const isSubmitting = useSelector((state: RootState ) => state.jobs.isSubmitting);
  const selectedJob: NormalizedJob[] = useSelector((state: RootState ) => state.jobs.selectedJob);


  const savedJobs : NormalizedJob[] = useSelector((state: RootState ) => state.jobs.savedJobs);
  const savedJobsIds = savedJobs.map((job) => job.jobId);  
  

  return (
  <div className="relative flex flex-col mt-10 px-4 py-6 dark:text-neutral-100">
    <NavbarDemo />

    <Divider className="my-6 dark:bg-neutral-400" />

    {jobs.length > 0 && !isSubmitting ? (
      <div className="flex lg:min-w-[70rem] justify-center h-screen lg:mx-auto">
        {/* Job List */}
        <div className="lg:w-1/2 w-full mt-4 max-w-xl overflow-y-auto pr-2">
          <h2 className="text-lg pl-2 mb-2 font-semibold text-neutral-900 dark:text-neutral-100">
            Job Listings
          </h2>

          {jobs.map((job, i) => (
            <div
              key={job.jobId}
              onClick={() => {
                if (!desktop) router.push(`/jobs/${i + 1}`);
                dispatch(setSelectedJob([job]));
              }}
              className="group cursor-pointer rounded-xl border border-neutral-400 mb-2 dark:border-neutral-400 bg-white dark:bg-neutral-900 p-4 transition hover:shadow-md hover:border-indigo-500 hover:dark:border-indigo-500"
            >
              <div className="flex justify-between gap-4">
                <h3 className="text-xl font-semibold group-hover:text-indigo-500 transition">
                  {job.title}
                </h3>

                {job.matchScore !== undefined && (
                  <CircularProgressCountUp
                    key={job.jobId}
                    matchScore={job.matchScore}
                  />
                )}
              </div>

              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {job.company}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-500">
                {job.location}
              </p>

              <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
                {job.contractType !== "not specified" && (
                  <span className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-1">
                    {job.contractType}
                  </span>
                )}

                <span className="rounded-md bg-orange-100 text-orange-700 px-2 py-1">
                  {job.source}
                </span>

                <span className="rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-1">
                  ${job.minSalary} – ${job.maxSalary}
                </span>
              </div>

              <p className="mt-4 line-clamp-3 text-sm text-neutral-600 dark:text-neutral-400">
                {job.description}
              </p>
            </div>
          ))}
        </div>

        {/* Job Details */}
        {desktop && (
          <div className="w-1/2 rounded-xl mt-7 border border-neutral-400 dark:border-neutral-400 bg-white dark:bg-neutral-900 flex flex-col overflow-hidden">
            {selectedJob[0] ? (
              <>
                {/* Sticky Header */}
                <div className="sticky top-0 z-10 rounded-t-xl border-b border-neutral-400 dark:border-neutral-400 bg-white dark:bg-neutral-900 p-6">
                  <h2 className="text-2xl font-semibold">
                    {selectedJob[0].title}
                  </h2>
                  <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                    {selectedJob[0].company} · {selectedJob[0].location}
                  </p>

                  <div className="mt-4 flex gap-3">
                    <a
                      href={selectedJob[0].jobUrl}
                      target="_blank"
                      className="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                    >
                      Apply now
                    </a>

                    <button
                      disabled={
                        selectedJob[0].saved ||
                        savedJobsIds.includes(selectedJob[0].jobId)
                      }
                      onClick={async () => {
                        try {
                          const response = await axios.post(
                            `/api/savedJobs`,
                            { job: selectedJob[0] }
                          );
                          if (response.status === 200) {
                            toast({
                              title: "Job saved",
                              description: "Added to saved jobs",                                                            
                            });
                            dispatch(addSavedJob(selectedJob[0]));
                          }
                        } catch (error) {
                          const axiosError =
                            error as AxiosError<ApiResponse>;
                          toast({
                            title: "Failed to save job",
                            description:
                              axiosError.response?.data.message,
                          });
                        }
                      }}
                      className="rounded-lg border border-neutral-400 dark:border-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-4 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                    >
                      {selectedJob[0].saved ||
                      savedJobsIds.includes(selectedJob[0].jobId) ? (
                        <IconCheck />
                      ) : (
                        <IconBadge className="rotate-180" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast({
                          title: "Copied",
                          description: "Link copied to clipboard",
                        });
                      }}
                      className="rounded-lg border border-neutral-400 dark:border-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-4 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                    >
                      <IconCopy />
                    </button>
                  </div>
                </div>

                {/* Details */}
               <div className="p-6 space-y-6 text-sm overflow-y-auto">
                  {selectedJob[0].matchScore !== undefined && (
                    <div>
                      <p className="mb-2 font-semibold">AI Match Score</p>
                      <CircularProgressCountUp
                        detailSection
                        matchScore={selectedJob[0].matchScore}
                      />
                    </div>
                  )}

                  <div>
                    <p className="font-semibold flex items-center gap-2">
                      <IconCash /> Pay
                    </p>
                    <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                      ${selectedJob[0].minSalary} – $
                      {selectedJob[0].maxSalary} / year
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold flex items-center gap-2">
                      <IconBriefcase /> Job Type
                    </p>
                    <p className="mt-1 capitalize text-neutral-600 dark:text-neutral-400">
                      {selectedJob[0].contractType}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold flex items-center gap-2">
                      <IconClock /> Posted
                    </p>
                    <p className="mt-1 text-neutral-600 dark:text-neutral-400">
                      {new Date(
                        selectedJob[0].jobPosted
                      ).toDateString()}
                    </p>
                  </div>

                  <div className="pt-6">
                    <p className="font-semibold mb-2">Description</p>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {selectedJob[0].description}
                    </p>
                  </div>

                  <a
                    href={selectedJob[0].jobUrl}
                    target="_blank"
                    className="inline-block text-indigo-500 underline"
                  >
                    View full listing
                  </a>
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <h2 className="text-4xl font-bold text-indigo-500">
                  Jobify
                </h2>
                <p className="text-sm text-neutral-500">
                  Select a job to view details
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    ) : (
      <div className="flex h-[50vh] items-center justify-center">
        {isSubmitting ? (
          <Loader className="animate-spin" />
        ) : (
          <div className="text-center">
            <h2 className="text-4xl font-bold text-indigo-500">
              Jobify
            </h2>
            <p className="mt-2 text-sm text-neutral-500">
              Find your dream job today
            </p>
          </div>
        )}
      </div>
    )}
  </div>
);

}

export default Page

