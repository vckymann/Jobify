"use client";

import { toast } from '@/hooks/use-toast';
import { setSavedJobs } from '@/store/slices/jobsSlice';
import { RootState } from '@/store/store';
import { ApiResponse } from '@/types/ApiResponse';
import { NormalizedJob } from '@/types/job';
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BookmarkX, ExternalLink, Trash2 } from 'lucide-react';

function Page() {
    const savedJobs: NormalizedJob[] = useSelector(
        (state: RootState) => state.jobs.savedJobs
    );

    const [deletedJob, setDeletedJob] = useState<NormalizedJob | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const response = await axios.get('/api/savedJobs');
                if (response.status !== 200) return;
                dispatch(setSavedJobs(response.data.data));
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast({
                    title: 'Failed to fetch saved jobs',
                    description: axiosError.response?.data.message,
                    variant: 'destructive',
                });
            }
        };

        fetchSavedJobs();
    }, [dispatch, savedJobs.length, deletedJob]);

    const handleDelete = async (job: NormalizedJob) => {
        try {
            const response = await axios.delete('/api/savedJobs', {
                data: job,
            });
            if (response.status !== 200) return;

            toast({
                title: 'Job removed',
                description: response.data.message,
            });

            setDeletedJob(job);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Failed to delete job',
                description: axiosError.response?.data.message,
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="
            min-h-screen px-4 py-6 dark:bg-neutral-800
            bg-white text-zinc-900 dark:text-zinc-100
        ">
            {savedJobs.length > 0 && (
                <h2 className="text-3xl font-semibold mb-6 tracking-tight">
                Saved Jobs
            </h2>
            )}

            {/* Empty state */}
            {savedJobs.length === 0 && (
                <div className="flex flex-col items-center justify-center mt-24 text-center animate-fade-in">
                    <div className="
                        h-16 w-16 rounded-full flex items-center justify-center mb-4
                        bg-zinc-100 dark:bg-zinc-900
                    ">
                        <BookmarkX className="h-8 w-8 text-zinc-500" />
                    </div>
                    <h3 className="text-lg font-medium">
                        No saved jobs yet
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm">
                        You haven’t saved any jobs. Start exploring and bookmark
                        opportunities you want to come back to.
                    </p>
                </div>
            )}

            {/* Jobs list */}
            <div className="grid gap-4">
                {savedJobs.map((job, i) => (
                    <div
                        key={i}
                        className="
                            group rounded-lg p-4 transition
                            border border-zinc-200 bg-white
                            hover:border-zinc-300
                            dark:border-zinc-800 dark:bg-zinc-900/60
                            dark:hover:border-zinc-700
                        "
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold">
                                    {job.title}
                                </h3>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                    {job.company} · {job.location}
                                </p>
                            </div>

                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => handleDelete(job)}
                                    className="
                                        flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition
                                        border border-red-500/30 text-red-600 bg-red-50
                                        hover:bg-red-100
                                        dark:text-red-400 dark:bg-red-500/10 dark:hover:bg-red-500/20
                                    "
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </button>

                                <a href={job.jobUrl} target="_blank" rel="noreferrer">
                                    <button
                                        className="
                                            flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition
                                            border border-zinc-300 bg-zinc-100 text-zinc-800
                                            hover:bg-zinc-200
                                            dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200
                                            dark:hover:bg-zinc-700
                                        "
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        View
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Page;
