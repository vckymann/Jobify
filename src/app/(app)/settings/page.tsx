"use client"
import React from 'react'
import { IconMoon, IconSun } from '@tabler/icons-react';
import { RootState } from '@/store/store';
import { useDispatch, useSelector } from 'react-redux';
import { setIsDarkMode } from '@/store/slices/jobsSlice';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { signOut } from 'next-auth/react';
function Page() {
  const isDarkMode = useSelector((state: RootState ) => state.jobs.isDarkMode);
  const dispatch = useDispatch();
  const router = useRouter();
  return (
    <>
    <h2 className='text-3xl dark:text-white font-semibold mb-4 pl-2 pt-3 text-center md:text-start'>Account Settings</h2>
    <div className='p-1 flex flex-col md:flex-row gap-4  dark:text-white items-center md:items-start'>      
      <div className='border border-gray-400 px-20 py-6 rounded-lg max-w-60 md:max-w-full'>
        <p className='mb-2 text-lg font-semibold'>Theme</p>
        <button className='px-2 py-1 rounded-md border-gray-300 border bg-gray-200 text-blue-500 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-600 font-semibold' onClick={() => {
          dispatch(setIsDarkMode(!isDarkMode));          
        }}>{isDarkMode ? <IconMoon /> : <IconSun />}</button>
      </div>
      <div className='border border-gray-400 px-20 md:px-10 py-6 rounded-lg max-w-60 md:max-w-full'>
        <p className='mb-2 text-lg font-semibold md:text-nowrap'>Account Password</p>
        <button className='px-2 py-1 rounded-md border-gray-300 border bg-gray-200 text-black dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-600 font-semibold' onClick={() => {  
          router.replace('/changePassword');        
        }}>Change</button>
      </div>      
    </div>
    <div className='flex justify-center md:justify-start'>
      <button onClick={async () => {
        try {
          const response = await axios.delete(`/api/delete`);
          if(response.status === 200){
            localStorage.clear();
            router.replace('/sign-in');        
            toast({
              title: "Success",
              description: response?.data?.message,
            });
            signOut({
              callbackUrl: "/sign-in",
            });
          }
          
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          toast({
            title: "Failed to delete account",            
            description: axiosError.response?.data.message,
          });
        }
      }} className='px-2 py-1 mt-4 ml-2 bg-red-500 rounded-md text-lg font-semibold text-white'>Close Account</button>
      </div>
    </>
  )
}

export default Page
