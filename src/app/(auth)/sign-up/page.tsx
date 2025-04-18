'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError} from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useDebounceCallback } from "usehooks-ts";


export default function Page() {

    const [email, setEmail] = useState("");
    const [emailMessage, setEmailMessage] = useState("")
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { toast } = useToast();
    const router = useRouter();
    const debounced = useDebounceCallback(setEmail, 1000) 

    const localSignUpSchema = signUpSchema.omit({verifyCode: true, verifyCodeExpiry: true});

    const form = useForm<z.infer<typeof localSignUpSchema>>({
        resolver: zodResolver(localSignUpSchema),
        defaultValues: {
            name:'',
            email: '',
            password: '',
        }
    })


    useEffect(() => {
        const checkEmail = async () => {
            if(email) {
                setIsCheckingEmail(true)
                setEmailMessage('')
                
                try {
                    const response = await axios.get(`/api/check-email?email=${email}`)
                    setEmailMessage(response.data.message)
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setEmailMessage(axiosError.response?.data.message ?? "an error occured while checking email")
                } finally {
                    setIsCheckingEmail(false)
                }
            }
        }

        checkEmail()
    },[email])
    

    const submitForm = async (data: z.infer<typeof localSignUpSchema>) => {        
        setIsSubmitting(true)
        try {
           const response = await axios.post<ApiResponse>('/api/sign-up', data)
           console.log(response);
           if (response.status === 200) {

               toast({
                title: 'success',
                description: response.data.message,
                variant:"default"
               })
               router.replace(`/verify/${data.email}`)
           }
           

        } catch (error) {

            console.error("Error in signUp", error);

            const axiosError = error as AxiosError<ApiResponse>;
            if (axiosError) {
                const errorMessage = axiosError.response?.data.message;
                toast({
                    title: 'SignUp failed',
                    description: errorMessage,
                    variant: 'destructive',                                
                }) 
            }
        } finally {
            setIsSubmitting(false)
        }

    }

    return (

        <div className="flex justify-center items-center min-h-screen bg-gray-200">
            <div className="w-full max-w-md p-8 bg-white text-black rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Jobify</h1>
                    <p className="mb-4">Sign up to access your account</p>
                </div>
                <Form {...form}>
                    <form className="space-y-4" onSubmit={form.handleSubmit(submitForm)}>
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" {...field}
                                        onChange={(e) => {
                                            field.onChange(e);  
                                            debounced(e.target.value)                                       
                                        }} 
                                     />
                                    </FormControl>
                                    {isCheckingEmail && <Loader2 className="animate-spin "/>} 
                                    <FormMessage className={emailMessage.includes("available") ? "text-green-500" : "text-red-500"}>
                                        {emailMessage}
                                    </FormMessage>                              
                                </FormItem>
                            )}/>
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your name" 
                                        {...field}                                   
                                     />
                                    </FormControl>  
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}/>
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter your password" {...field}  
                                     />
                                    </FormControl>  
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}/>
                        <Button disabled={isSubmitting} type="submit" className="w-full mt-2 bg-blue-400" >
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                            : "Sign Up"}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>Already have an account? <Link href="/sign-in" className="text-blue-500 hover:underline">Sign In</Link></p>
                </div>
            </div>
        </div>
    )

}
