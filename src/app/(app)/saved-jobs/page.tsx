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
    <div>
      {savedJobs.length > 0 ? (
        savedJobs.map((job, i) => (
          <div key={i}>{job.title},{job.jobId}
          <button onClick={() => handleDelete(job)}>delete</button></div>
        ))
      ) : (
        <div>No saved jobs</div>
      )}
    </div>
  )
}

export default Page
