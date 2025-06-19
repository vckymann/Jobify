"use client"
import { toast } from '@/hooks/use-toast';
import { setSavedJobs } from '@/store/slices/jobsSlice';
import { RootState } from '@/store/store';
import { ApiResponse } from '@/types/ApiResponse';
import { NormalizedJob } from '@/types/job';
import axios, { AxiosError } from 'axios';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

function Page() {

    const savedJobs:NormalizedJob[] = useSelector((state:RootState) => state.jobs.savedJobs) 
    const [deletedJob, setDeletedJob] = React.useState({});
    const dispatch = useDispatch();
    

    useEffect(() => {
        
        const fetchSavedJobs = async () => {        
            try {
                const response = await axios.get('/api/savedJobs')
                
                if (response.status !== 200) {
                    return
                }
                dispatch(setSavedJobs(response.data.data))            
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast({
                    title:"failed to fetch saved jobs",
                    description:axiosError.response?.data.message,
                    variant:"destructive"                    
                })
            }
        }

        fetchSavedJobs();
    }, [dispatch, savedJobs.length, deletedJob]);

    const handleDelete = async (job:NormalizedJob) => {
        try {            
            const response = await axios.delete(`/api/savedJobs`, {data: job})
            if (response.status !== 200) {
                return
            }
            toast({
                title:"job deleted successfully",
                description:response?.data?.message
            })
            setDeletedJob(job);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title:"failed to delete job",
                description:axiosError.response?.data.message,
                variant:"destructive"                    
            })
        }
    }
    

  return (
    <div className='dark:text-white mt-2'>
      <h2 className='text-3xl font-semibold mb-4 pl-2 pt-3 text-center md:text-start'>Saved Jobs</h2>
      {savedJobs.length > 0 ? (
        savedJobs.map((job, i) => (
          <div className='border border-gray-400 p-2 mt-2 flex justify-between items-center mx-3' key={i}>            
            <p className='font-semibold mr-6'>
            {job.title} <br /> {job.company} - {job.location}
            </p>
            <div className='flex gap-2'>
                <button className='bg-red-500 text-white px-2 py-1 rounded font-semibold' onClick={() => handleDelete(job)}>Delete</button>
                <a href={job.jobUrl} target='_blank'>
                <button className='bg-blue-500 text-white px-2 py-1 rounded font-semibold'>View</button>
                </a>
            </div>
          </div>
        ))
      ) : (
        <div>No saved jobs</div>
      )}
    </div>
  )
}

export default Page
