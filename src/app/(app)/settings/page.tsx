"use client";

import React from "react";
import { IconMoon, IconSun, IconLock, IconTrash } from "@tabler/icons-react";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { setIsDarkMode } from "@/store/slices/jobsSlice";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { signOut } from "next-auth/react";

function Page() {
  const isDarkMode = useSelector((state: RootState) => state.jobs.isDarkMode);
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 bg-white dark:bg-neutral-800">
      {/* Header */}
      <h2 className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
        Account Settings
      </h2>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Theme */}
        <div className="rounded-xl border border-neutral-400 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 transition-shadow hover:shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <IconSun className="dark:hidden text-neutral-700" />
            <IconMoon className="hidden dark:block text-neutral-300" />
            <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Theme
            </p>
          </div>

          <button
            onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
            className="mt-2 inline-flex items-center gap-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-800 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
          >
            {isDarkMode ? <IconMoon size={18} /> : <IconSun size={18} />}
            {isDarkMode ? "Dark mode" : "Light mode"}
          </button>
        </div>

        {/* Password */}
        <div className="rounded-xl border border-neutral-400 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 transition-shadow hover:shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <IconLock className="text-neutral-700 dark:text-neutral-300" />
            <p className="text-lg font-medium text-neutral-900 dark:text-neutral-100">
              Password
            </p>
          </div>

          <button
            onClick={() => router.replace("/changePassword")}
            className="mt-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 px-4 py-2 text-sm font-medium text-neutral-800 dark:text-neutral-100 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
          >
            Change password
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-10 border-t border-neutral-400 dark:border-neutral-800 pt-6">
        <div className="rounded-xl border border-red-300/60 dark:border-red-900 bg-red-50 dark:bg-red-950/40 p-6">
          <div className="flex items-center gap-3 mb-3">
            <IconTrash className="text-red-600 dark:text-red-400" />
            <p className="text-lg font-semibold text-red-600 dark:text-red-400">
              Danger Zone
            </p>
          </div>

          <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-4">
            Closing your account is permanent and cannot be undone.
          </p>

          <button
            onClick={async () => {
              try {
                const response = await axios.delete(`/api/delete`);
                if (response.status === 200) {
                  localStorage.clear();
                  toast({
                    title: "Account deleted",
                    description: response.data.message,
                  });
                  signOut({ callbackUrl: "/sign-in" });
                  router.replace("/sign-in");
                }
              } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast({
                  title: "Failed to delete account",
                  description: axiosError.response?.data.message,
                  variant: "destructive",
                });
              }
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition"
          >
            <IconTrash size={16} />
            Close account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
