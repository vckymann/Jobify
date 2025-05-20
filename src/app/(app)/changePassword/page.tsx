"use client"
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import { ApiResponse } from '@/types/ApiResponse'
import axios, { AxiosError } from 'axios'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import {changePasswordSchema } from '@/schemas/changePasswordSchema'
import { z } from 'zod'
import { Loader } from 'lucide-react'

function Page() {    

    const form = useForm<z.infer<typeof changePasswordSchema>>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: ''
        },        
    })
    const router = useRouter();

    const [loading,setLoading] = useState(false)

    const onSubmit = async (data: z.infer<typeof changePasswordSchema>) => {
        setLoading(true)
        try {
            const response = await axios.post('/api/changePassword', {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword
            })

            if (response.status === 200) {
                toast({
                    title: "Success",
                    description: response?.data?.message
                })
            }
            router.replace('/settings')
            
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            
            toast({
                title: "Failed to change password",
                description: axiosError.response?.data.message, 
                variant: "destructive"
            })
        } finally {
            setLoading(false)
        }
    }    

  return (
    <div>
      <h2 className='text-3xl dark:text-white font-semibold mb-4 pl-2 pt-3'>Change Password</h2>
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className='p-1 pl-4 flex flex-col gap-3'>
                    <FormField
                        name="oldPassword"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <input className='border border-gray-400 rounded-md dark:bg-neutral-800 dark:text-white py-1 pl-1' placeholder="Old Password" {...field}  />
                                </FormControl>
                                <FormMessage className='text-red-500' >
                                    {form.formState.errors.oldPassword?.message}
                                </FormMessage>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="newPassword"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <input className='border border-gray-400 rounded-md dark:bg-neutral-800 dark:text-white py-1 pl-1' placeholder="New Password" {...field} />
                                </FormControl>
                                <FormMessage className='text-red-500' >{form.formState.errors.newPassword?.message}</FormMessage>
                            </FormItem>
                        )}
                    />

                    <button className='flex justify-center px-2 py-1 mt-4 ml-2 bg-red-500 rounded-md text-lg font-semibold text-white max-w-20' type='submit'>{loading ? <Loader /> : "Change"}</button>
                </div>
            </form>
        </Form>
    </div>
  )
}

export default Page
