'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {  useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";


export default function Page() {

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { toast } = useToast();
    const router = useRouter();


    //zod implementation
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const submitForm = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
          const result = await signIn('credentials', {
            identifier: data.email,
            password: data.password,
            redirect: false
          })

          
          
          if (result?.error) {
              toast({
                  title: "Sign-in Error",
                  description: result.error,
                  variant: "destructive"
                })
          }

          setIsSubmitting(false); 

          if (result?.url) {
            router.replace('/jobs');
          }
    }

    return (

        <div className="flex justify-center items-center min-h-screen bg-gray-200">
            <div className="w-full max-w-md p-8 text-black bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join Us</h1>
                    <p className="mb-4">Sign in to access your account</p>
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
                                        <Input placeholder="Enter your email or username" 
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
                        <Button disabled={isSubmitting} type="submit" className="w-full" >
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                            : "Sign In"}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>create an account? <Link href="/sign-up" className="text-blue-500 hover:underline">Sign Up</Link></p>
                </div>
            </div>
        </div>
    )

}
