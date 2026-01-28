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
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useDebounceCallback } from "usehooks-ts";


export default function Page() {
    const [email, setEmail] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { toast } = useToast();
    const router = useRouter();
    const debounced = useDebounceCallback(setEmail, 1000);

    const localSignUpSchema = signUpSchema.omit({
        verifyCode: true,
        verifyCodeExpiry: true,
    });

    const form = useForm<z.infer<typeof localSignUpSchema>>({
        resolver: zodResolver(localSignUpSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    useEffect(() => {
        if (!email) return;

        const checkEmail = async () => {
            setIsCheckingEmail(true);
            setEmailMessage('');

            try {
                const response = await axios.get(`/api/check-email?email=${email}`);
                setEmailMessage(response.data.message);
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                setEmailMessage(
                    axiosError.response?.data.message ??
                        'Error checking email'
                );
            } finally {
                setIsCheckingEmail(false);
            }
        };

        checkEmail();
    }, [email]);

    const submitForm = async (data: z.infer<typeof localSignUpSchema>) => {
        setIsSubmitting(true);

        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data);

            if (response.status === 200) {
                toast({
                    title: 'Account created',
                    description: response.data.message,
                });

                router.replace(`/verify/${data.email}`);
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;

            toast({
                title: 'Sign up failed',
                description:
                    axiosError.response?.data.message ??
                    'Something went wrong',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-zinc-950">            
            <div className="w-full flex items-center justify-center">
                <div
                    className="
                        w-full max-w-md
                        rounded-xl
                        border border-zinc-800
                        bg-zinc-900/60
                        backdrop-blur
                        p-8
                        shadow-xl
                        animate-fade-in
                    "
                >
                    <h1 className="text-3xl font-semibold text-zinc-100 text-center tracking-tight">
                        Create your account
                    </h1>
                    <p className="text-sm text-zinc-400 text-center mt-2">
                        Start finding better opportunities
                    </p>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(submitForm)}
                            className="space-y-5 mt-8"
                        >
                            {/* Email */}
                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="relative">
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
                                                        transition-colors
                                                    "
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        debounced(e.target.value);
                                                    }}
                                                />
                                                {isCheckingEmail && (
                                                    <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-blue-400" />
                                                )}
                                            </div>
                                        </FormControl>
                                        {emailMessage && (
                                            <p
                                                className={`text-xs mt-1 transition-opacity ${
                                                    emailMessage.includes('available')
                                                        ? 'text-emerald-400'
                                                        : 'text-red-400'
                                                }`}
                                            >
                                                {emailMessage}
                                            </p>
                                        )}
                                    </FormItem>
                                )}
                            />

                            {/* Name */}
                            <FormField
                                name="name"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Full name"
                                                className="
                                                    bg-zinc-950
                                                    border-zinc-800
                                                    text-zinc-100
                                                    placeholder:text-zinc-500
                                                    focus-visible:ring-0
                                                    focus-visible:border-zinc-600
                                                    transition-colors
                                                "
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Password */}
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
                                                    transition-colors
                                                "
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-500 text-xs" />
                                    </FormItem>
                                )}
                            />

                            {/* Submit */}
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
                                    'Create account'
                                )}
                            </Button>
                        </form>
                    </Form>

                    <p className="text-sm text-zinc-400 text-center mt-6">
                        Already have an account?{' '}
                        <Link
                            href="/sign-in"
                            className="text-zinc-200 hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

