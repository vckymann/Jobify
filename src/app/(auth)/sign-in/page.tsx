'use client';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {  useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
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

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const submitForm = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);

        const result = await signIn('credentials', {
            identifier: data.email,
            password: data.password,
            redirect: false,
        });

        if (result?.error) {
            toast({
                title: 'Sign-in Error',
                description: result.error,
                variant: 'destructive',
            });
        }

        setIsSubmitting(false);

        if (result?.url) {
            router.replace('/jobs');
        }
    };

    return (
        <div className="flex h-screen w-full bg-zinc-950">            
            <div className="w-full flex items-center justify-center">
                <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900/60 backdrop-blur p-8 shadow-xl">
                    <h1 className="text-3xl font-semibold text-zinc-100 text-center">
                        Welcome back
                    </h1>
                    <p className="text-sm text-zinc-400 text-center mt-2">
                        Sign in to your account
                    </p>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(submitForm)}
                            className="space-y-5 mt-8"
                        >
                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Email"
                                                className="
                                                    bg-zinc-950
                                                    border-zinc-800
                                                    text-zinc-100
                                                    placeholder:text-zinc-500
                                                    focus-visible:ring-0
                                                    focus-visible:border-zinc-600
                                                "
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="password"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                placeholder="Password"
                                                className="
                                                    bg-zinc-950
                                                    border-zinc-800
                                                    text-zinc-100
                                                    placeholder:text-zinc-500
                                                    focus-visible:ring-0
                                                    focus-visible:border-zinc-600
                                                "
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs" />
                                    </FormItem>
                                )}
                            />

                            <Button
                                disabled={isSubmitting}
                                type="submit"
                                className="
                                    w-full
                                    bg-zinc-100
                                    text-zinc-900
                                    hover:bg-zinc-200
                                    transition
                                "
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    'Sign in'
                                )}
                            </Button>
                        </form>
                    </Form>

                    <p className="text-sm text-zinc-400 text-center mt-6">
                        Don’t have an account?{' '}
                        <Link
                            href="/sign-up"
                            className="text-zinc-200 hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
