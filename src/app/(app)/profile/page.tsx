'use client'
import { IconCheck, IconMail} from '@tabler/icons-react'
import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { setResumeExists } from '@/store/slices/jobsSlice';
import { DropdownMenuDemo } from '@/components/dropdown';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from '@/hooks/use-toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';

function Page() {  
  
  const session = useSession();
  const [resumePath, setResumePath] = useState('');
  const resumeExists = useSelector((state: RootState) => state.jobs.resumeExists);
  const dispatch = useDispatch();

  useEffect(() => {
    const getResume = async () => {
      try {
        const response = await axios.get('/api/resume');
        if(response.status !== 200) return
        setResumePath(response.data.data);
        dispatch(setResumeExists(true));        
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        if (axiosError.response?.status === 404) {
          dispatch(setResumeExists(false));
          return          
        }
      }
    }

    getResume();
  }, [dispatch])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        dispatch(setResumeExists(true));
        toast({
          title: "Success",
          description: response?.data?.message,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Failed to replace resume",
        description: axiosError.response?.data.message,
      });
    }
  };
  

  return (
    <div className='flex flex-col mx-auto max-w-lg dark:text-white'>
      <div className='mt-12 p-6'>
        <h2 className='text-3xl font-bold capitalize text-gray-800 dark:text-white'>{session.data?.user?.name}</h2>
        <div className='mt-10'>
          <h3 className='flex gap-4 text-gray-600 dark:text-white'><IconMail /> {session.data?.user?.email}</h3>
          <h3 className='flex gap-4 text-gray-600 dark:text-white'><IconCheck /> {session.data?.user?.isVerified ? "Verified" : "Not Verified"}</h3>          
        </div>        
      </div>
      
      <div className='p-4'>
      <h3 className='text-2xl font-semibold text-gray-800 dark:text-white'>Resume</h3>
      <div className='mt-2 w-full h-32 border border-gray-400 rounded-lg flex items-center justify-between px-4'>
      {resumeExists ? (
        <>
        <div className='flex items-center w-full h-full gap-4'>
          <svg width="44" height="64" viewBox="0 0 44 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="">
          <path d="M26 1.09384C26 0.489727 26.4897 0 27.0938 0C27.674 0 28.2305 0.230486 28.6408 0.640755L43.3592 15.3592C43.7695 15.7695 44 16.326 44 16.9062C44 17.5103 43.5103 18 42.9062 18H28C26.8954 18 26 17.1046 26 16L26 1.09384Z" fill="#D4D2D0"></path>
          <path d="M0 2C0 0.895431 0.895431 0 2 0H27C28.1046 0 29 0.895431 29 2V13C29 14.1046 29.8954 15 31 15H42C43.1046 15 44 15.8954 44 17V62C44 63.1046 43.1046 64 42 64H2C0.895431 64 0 63.1046 0 62V2Z" fill="#E4E2E0"></path><path d="M6 7C6 6.44772 6.44772 6 7 6H21C21.5523 6 22 6.44772 22 7C22 7.55228 21.5523 8 21 8H7C6.44772 8 6 7.55228 6 7Z" fill="#D4D2D0"></path><path d="M6 11C6 10.4477 6.44772 10 7 10H21C21.5523 10 22 10.4477 22 11C22 11.5523 21.5523 12 21 12H7C6.44772 12 6 11.5523 6 11Z" fill="#D4D2D0"></path><path d="M6 15C6 14.4477 6.44772 14 7 14H21C21.5523 14 22 14.4477 22 15C22 15.5523 21.5523 16 21 16H7C6.44772 16 6 15.5523 6 15Z" fill="#D4D2D0"></path><path d="M6 21C6 20.4477 6.44772 20 7 20H37C37.5523 20 38 20.4477 38 21C38 21.5523 37.5523 22 37 22H7C6.44772 22 6 21.5523 6 21Z" fill="#D4D2D0"></path><path d="M6 25C6 24.4477 6.44772 24 7 24H37C37.5523 24 38 24.4477 38 25C38 25.5523 37.5523 26 37 26H7C6.44772 26 6 25.5523 6 25Z" fill="#D4D2D0"></path><path d="M6 29C6 28.4477 6.44772 28 7 28H37C37.5523 28 38 28.4477 38 29C38 29.5523 37.5523 30 37 30H7C6.44772 30 6 29.5523 6 29Z" fill="#D4D2D0"></path><path d="M6 33C6 32.4477 6.44772 32 7 32H37C37.5523 32 38 32.4477 38 33C38 33.5523 37.5523 34 37 34H7C6.44772 34 6 33.5523 6 33Z" fill="#D4D2D0"></path><path d="M0 44H44V62C44 63.1046 43.1046 64 42 64H2C0.895431 64 0 63.1046 0 62V44Z" fill="#2557a7"></path><text aria-hidden="true" className="css-1pz4pqc e1wnkr790"><tspan className='' x="10" y="58">PDF</tspan></text></svg>
          <p className='mb-2 text-lg font-semibold'> Resume.pdf</p>
        </div>
        <DropdownMenuDemo resumePath={resumePath} />
        </>
      ): (
        <div className='flex flex-col items-center w-full'>
          <p className='mb-2 text-lg font-semibold text-center w-full'>No resume uploaded</p>
          <input type="file" onChange={handleFileUpload} className='w-1/2' accept='.pdf' />
        </div>                 
      )}      
      </div>      
      </div>
    </div>
  )
}

export default Page
