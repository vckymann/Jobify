"use client";

import {
  IconCheck,
  IconMail,
  IconFileText,
  IconUpload,
} from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios, { AxiosError } from "axios";
import { DropdownMenuDemo } from "@/components/dropdown";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { setResumeExists } from "@/store/slices/jobsSlice";
import { RootState } from "@/store/store";

function Page() {
  const session = useSession();
  const dispatch = useDispatch();
  const resumeExists = useSelector(
    (state: RootState) => state.jobs.resumeExists
  );

  const [resumePath, setResumePath] = useState("");
  const [processingMessage, setProcessingMessage] = useState("");

  useEffect(() => {
    const getResume = async () => {
      try {
        const response = await axios.get("/api/resume");
        if (response.status !== 200) return;
        setResumePath(response.data.data.resume);
        dispatch(setResumeExists(true));
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        if (axiosError.response?.status === 404) {
          setResumePath("");
          dispatch(setResumeExists(false));
        }
      }
    };

    getResume();
  }, [dispatch]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      setProcessingMessage("Uploading resume...");
      const response = await axios.post("/api/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setResumePath(response.data.data);
        dispatch(setResumeExists(true));
        toast({
          title: "Success",
          description: response.data.message,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      dispatch(setResumeExists(false));
      toast({
        title: "Upload failed",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setProcessingMessage("");
    }
  };

  return (
    <>
      {/* Processing Overlay */}
      {processingMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <p className="text-lg font-medium text-white animate-pulse">
            {processingMessage}
          </p>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Profile Card */}
        <div className="rounded-xl border border-neutral-400 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 mb-8">
          <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 capitalize">
            {session.data?.user?.name}
          </h2>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-300">
              <IconMail size={18} />
              {session.data?.user?.email}
            </div>

            <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-300">
              <IconCheck size={18} />
              {session.data?.user?.isVerified ? "Verified" : "Not verified"}
            </div>
          </div>
        </div>

        {/* Resume Card */}
        <div className="rounded-xl border border-neutral-400 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Resume
          </h3>

          <div className="flex items-center justify-between rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 p-5 transition hover:border-neutral-400 dark:hover:border-neutral-600">
            {resumeExists ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    <IconFileText className="text-indigo-500" />
                  </div>

                  <div>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      Resume.pdf
                    </p>
                    <p className="text-xs text-neutral-500">
                      Uploaded successfully
                    </p>
                  </div>
                </div>

                <DropdownMenuDemo
                  setProcessingMessage={setProcessingMessage}
                  setResumePath={setResumePath}
                  resumePath={resumePath}
                />
              </>
            ) : (
              <div className="w-full flex flex-col items-center gap-3">
                <IconUpload className="text-neutral-400" />
                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                  No resume uploaded
                </p>
                <label className="cursor-pointer text-sm font-medium text-indigo-500 hover:underline">
                  Upload PDF
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
