'use client'
import { useRouter, useParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

function Page() {
    const router = useRouter();
    const param = useParams<{ email: string }>();
    const { toast } = useToast()

    const [verifyCode, setVerifyCode] = useState("")
    const [message,setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema), 
        defaultValues: {
            verifyCode: ''
        }       
    })

    useEffect(() => {
        const getVerifyCode = async () => {
            try {
                const response = await axios.get(`/api/verifyCode?email=${param.email}`)
                if (response.status === 200) {                    
                    setVerifyCode(response.data.data)
                    setMessage(response.data.message)
                }

            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>
             
                const errorMessage = axiosError.response?.data.message;
                toast({
                title: 'Failed to get the code',
                description: errorMessage,
                variant: 'destructive'
                })   
            }
        }

        getVerifyCode();
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsLoading(true)
        try {
            const response = await axios.post<ApiResponse>(`/api/verifyCode`, {
                email: param.email,
                verifyCode: data.verifyCode
            })

            toast({
                title: 'success',
                description: response.data.message
            })
            router.replace(`/sign-in`)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;            
            const errorMessage = axiosError.response?.data.message;
            toast({
                title: 'Verification failed',
                description: errorMessage,
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
        <div className='w-full max-w-md p-6 bg-white rounded-lg shadow-md'>
            <h2 className='text-2xl font-semibold text-center text-gray-900 mb-6'>Verify your email</h2>
            <h3 className='pb-4 text-lg font-semibold text-center text-gray-900 '>{message} = {verifyCode}</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        name="verifyCode"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Verification code</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter verification code" {...field} />
                                </FormControl>
                                <FormMessage className='text-red-500' />
                            </FormItem>
                        )}
                    /> 
                    <Button className='mt-4 bg-blue-500' type="submit">{isLoading ? 'Verifying...' : 'Verify'}</Button>                                     
                </form>
            </Form>
        </div>
    </div>
  )
}

export default Page
