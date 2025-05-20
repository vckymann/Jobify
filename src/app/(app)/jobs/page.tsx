"use client"
import { useRouter} from "next/navigation"
import { NavbarDemo } from '@/components/navbar'
import { Divider, useMediaQuery } from '@mui/material';
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { NormalizedJob } from "@/types/job";
import { useDispatch } from "react-redux";
import { setSelectedJob } from "@/store/slices/jobsSlice";
import { IconBadge, IconBriefcase, IconCash, IconCheck, IconClock, IconCopy, IconSourceCode } from "@tabler/icons-react";
import { Loader } from "lucide-react";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import CircularProgressCountUp from "@/components/progress";
import { useState } from "react";


function Page() {

  const router = useRouter();
  const desktop = useMediaQuery("(min-width: 1024px)");
  const dispatch = useDispatch();    

  const jobs: NormalizedJob[] = useSelector((state: RootState ) => state.jobs.jobs);
  const isSubmitting = useSelector((state: RootState ) => state.jobs.isSubmitting);
  const selectedJob: NormalizedJob[] = useSelector((state: RootState ) => state.jobs.selectedJob);

  const [jobSaved, setJobSaved] = useState(false);  
  

  return (
    <>
      <div className='flex mt-10 mx-3 gap-6 flex-col dark:text-white relative'>        
      <NavbarDemo />      
      <Divider className="dark:bg-neutral-300"  />
      {jobs.length > 0 && !isSubmitting ? (
        <div className="flex lg:min-w-[70rem] justify-center h-screen lg:mx-auto">
        {/* Job Listings */}
        <div className="lg:w-1/2 w-full max-w-xl border-gray-400 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Job Listings</h2>
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <div
                onClick={() => {
                  if(!desktop){
                    router.push(`/jobs/${i + 1}`)
                  }
                  
                  dispatch(setSelectedJob([job]));
                }}
                key={i + 1}
                className="p-4 border border-gray-400 rounded cursor-pointer hover:bg-gray-100 pb-4 dark:hover:bg-neutral-700 overflow-y-hidden"
              >
                <div className="flex justify-between">
                  <h3 className="font-semibold text-2xl">
                  {job.title}
                  </h3>
                <div className="">
                  {job.matchScore !== undefined && (
                  <>
                  <CircularProgressCountUp key={job.jobId} matchScore={job.matchScore} />
                  </>                  
                )}
                  </div>
                </div>
                <p className="text-gray-600 text-md mt-3 dark:text-neutral-300">{job.company}</p>
                <p className="text-sm text-gray-500 dark:text-neutral-400">{job.location}</p>
                <div className="flex gap-4 mt-3">
                  
                  <div className="bg-gray-300 border text-gray-800 rounded-sm border-gray-400 px-2 py-0.5 dark:bg-neutral-800 dark:text-white dark:border-white font-semibold text-nowrap">
                  {job.contractType === "not specified" ? "" : job.contractType}
                  </div>
                  <div className={` ${job.source === 'adzuna' ? 'bg-orange-300 text-orange-600' : 'bg-blue-300 text-blue-600'} px-2 py-0.5 font-semibold rounded-sm`}>
                    {job.source}
                  </div>
                  <div className="bg-gray-300 text-gray-800  border-gray-400 dark:bg-neutral-800 dark:text-white border dark:border-white px-2 py-0.5 font-semibold rounded-sm text-nowrap">
                    ${job.minSalary} - ${job.maxSalary} a year
                  </div>                  
                </div>                
                <div className="mt-8 text-gray-500 text-sm">{job.description}</div>
              </div>
            ))}
          </div>        
        </div>
  
        {/* Job Details */
        desktop && (
          
          <div className={`w-1/2 hidden lg:flex flex-col rounded-lg border-b border-l border-t border-r border-gray-400  ${desktop ? 'flex justify-center items-center' : ''}`}>
            {selectedJob[0] && (            
              <div className='sticky rounded-lg px-4 py-10 top-0 w-full bg-white dark:bg-neutral-800 shadow-md z-10 border-gray-400 border'>
                <h2 className="text-3xl font-bold mb-4">{selectedJob[0].title}</h2>
                <div>{selectedJob[0].company} | {selectedJob[0].location}</div>
                <div className="flex gap-4 mt-4">
                <a target="_blank" href={selectedJob[0].jobUrl}>                  
                <button className="bg-blue-500 hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg border border-gray-400">Apply Now</button>
                </a>

                <button disabled={selectedJob[0].saved || jobSaved} onClick={async () => {
                  try {
                    const response = await axios.post(`/api/savedJobs`, { job: selectedJob[0] });
                    if (response.status === 200) {
                      toast({
                        title: "Job saved",
                        description: "Job saved to your saved jobs",                       
                      })
                      setJobSaved(true);
                    }
                  } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    
                    toast({
                      title: "Failed to save job",
                      description: axiosError.response?.data.message,
                    });                    
                  }
                }} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 text-white font-bold py-2 px-4 rounded-lg dark:bg-neutral-800 dark:hover:bg-neutral-600 relative group">{selectedJob[0].saved || jobSaved ? <IconCheck className="text-black dark:text-white" /> : <IconBadge className="rotate-180 text-black dark:text-white" />}
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
                }} className="bg-gray-200 hover:bg-gray-300 border border-gray-400 text-white dark:bg-neutral-800 dark:hover:bg-neutral-600 font-bold py-2 px-4 rounded-lg relative group"><IconCopy className="text-black dark:text-white" />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 text-nowrap group-hover:opacity-100 transition">
                    Copy link
                  </span>
                </button></div>
              </div>
            )}
            {
              selectedJob[0] ? (
                <div className="flex-1 p-4 pt-0 mt-2 overflow-y-scroll">
                  <h3 className="font-bold text-xl">Job details</h3>

                {selectedJob[0].matchScore !== undefined && (
                  <>
                  <p className="text-md font-semibold inline-flex gap-4 mt-10 mb-4"> Ai MatchScore</p>
                  <CircularProgressCountUp detailSection={true} key={selectedJob[0].jobId} matchScore={selectedJob[0].matchScore} />
                  </>                  
                )}

                  <p className="text-md font-semibold inline-flex gap-4 mt-10"><IconCash /> Pay</p>
                  <p className="ml-10 bg-gray-300 text-gray-800 border border-gray-400 dark:bg-neutral-800 dark:text-white max-w-56 py-1 text-sm px-2 font-semibold rounded-sm">${selectedJob[0].minSalary} - ${selectedJob[0].maxSalary} a year</p>
  
                  <p className="text-md font-semibold inline-flex gap-4 mt-10"><IconBriefcase /> Job type</p>
                  <p className="ml-10 bg-gray-300 text-gray-800 border border-gray-400 dark:bg-neutral-800 dark:text-white max-w-28 py-1 text-sm px-2 font-semibold rounded-sm capitalize">{selectedJob[0].contractType}</p>
  
                  <p className="text-md font-semibold inline-flex gap-4 mt-10"><IconClock /> Job posted</p>
                  <p className="ml-10 bg-gray-300 text-gray-800 border border-gray-400 dark:bg-neutral-800 dark:text-white max-w-[8.3rem] py-1 text-sm px-2 font-semibold rounded-sm capitalize">{new Date(selectedJob[0].jobPosted).toDateString()}</p>
  
                  <p className="text-md font-semibold inline-flex gap-4 mt-10"><IconSourceCode /> Source</p>
                  <p className={`ml-10 ${selectedJob[0].source === "adzuna" ? "bg-orange-300 text-orange-600" : "bg-blue-300 text-blue-600"} max-w-[4.5rem] text-sm px-2 font-semibold rounded-sm capitalize`}>{selectedJob[0].source}</p>
  
                  <h3 className="font-bold text-xl mt-10">Job description</h3>
                    <p className="mt-4 text-gray-600 font-semibold dark:text-neutral-400">{selectedJob[0].description}</p>
  
                    <p className="mt-4 text-gray-600 font-semibold dark:text-neutral-400">To view the full job listing click <a target="_blank" className="cursor-pointer text-blue-500 underline" href={selectedJob[0].jobUrl}>here</a></p>                
              </div>
              ):(
                <div className="flex flex-col items-center gap-3">
                  <h2 className="text-5xl font-bold text-blue-500">Jobify</h2>
                  <p className="font-semibold">Select a job to view details</p>
                </div>
              )
            }            
        </div>
        )
        }
      </div>
      ) : (
      <>
      <div className="w-full h-[50vh] flex justify-center items-center">{jobs.length >= 0 && isSubmitting  ? <Loader className="animate-spin" /> : <div>
        <h2 className="text-5xl font-bold text-blue-500 text-center">Jobify</h2>
        <p className="font-semibold text-center pt-2">Find your dream job today</p>
      </div>}</div>
      </>
      )}      
    </div>        
    </>
  )
}

export default Page

