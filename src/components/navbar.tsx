"use client";

import React from "react";
import { Menu } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import { IconLocation, IconSearch } from "@tabler/icons-react";
import { Form, FormField, FormItem, FormControl } from "./ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import PaginationComponent from "./pagination";
import { useJobSearch } from "@/hooks/useJobSearch";
import { setShowAdditionalFilters } from "@/store/slices/jobsSlice";

export function NavbarDemo() {
  const {
    isSubmitting,
    showAdditionalFilters,
    form,
    onSubmit,
    dispatch,
    jobs,
    isSubmitDisabled,
  } = useJobSearch();

  return (
    <>
      {!isSubmitting && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="relative w-full flex flex-col mb-7 items-center gap-4 text-neutral-900 dark:text-neutral-100">
              {/* Clear filters */}
              {showAdditionalFilters && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    form.resetField("datePosted");
                    form.resetField("jobType");
                    form.resetField("radius");
                    localStorage.removeItem("formValues");
                    dispatch(setShowAdditionalFilters(false));
                  }}
                  className="text-lg text-black bg-gray-100 p-1 px-14 mb-3 rounded-md border font-semibold border-gray-500 hover:bg-gray-300 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-600" tabIndex={0} title="clear Search"
                >
                  Clear filters
                </button>
              )}

              {/* Main Search Bar */}
              <div
                className={cn(
                  "relative z-50 max-w-5xl w-full mx-auto border-neutral-400 md:w-fit rounded-lg border dark:border-neutral-400 dark:bg-neutral-800"
                )}
              >
                <Menu>
                  <div className="flex flex-col lg:flex-row lg:gap-2 lg:items-center w-full lg:w-fit">
                    {/* Keyword */}
                    <div className="flex items-center gap-2 rounded-lg border border-neutral-400 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 flex-1">
                      <IconSearch size={18} className="text-neutral-500" />
                      <FormField
                        name="keyword"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <input
                                {...field}
                                type="text"
                                placeholder="Job title or keywords"
                                className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 rounded-lg border border-neutral-400 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 flex-1">
                      <IconLocation
                        size={18}
                        className="text-neutral-500"
                      />
                      <FormField
                        name="location"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormControl>
                              <input
                                {...field}
                                type="text"
                                placeholder="City or province"
                                className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isSubmitting || isSubmitDisabled}
                      className="rounded-lg bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 transition disabled:opacity-50"
                    >
                      Find jobs
                    </button>
                  </div>
                </Menu>
              </div>

              {/* Advanced Filters */}
              {showAdditionalFilters && jobs.length > 0 && (
                <>
                  <div className="flex flex-wrap justify-center gap-3 mt-2">
                    {/* Job Type */}
                    <FormField
                      name="jobType"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-40 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                <SelectValue placeholder="Job type" />
                              </SelectTrigger>
                            </FormControl>
                           <SelectContent className="bg-white border-gray-500 dark:bg-neutral-800 dark:text-white">
                            <SelectItem className="hover:bg-gray-300 dark:hover:bg-neutral-600" value="full-time">Full Time</SelectItem>
                            <SelectItem className="hover:bg-gray-300 dark:hover:bg-neutral-600" value="part-time">Part Time</SelectItem>
                          </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    {/* Date Posted */}
                    <FormField
                      name="datePosted"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-40 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                <SelectValue placeholder="Date posted" />
                              </SelectTrigger>
                            </FormControl>
                           <SelectContent className="bg-white border border-gray-500 dark:bg-neutral-800 dark:text-white">
                            <SelectItem className="hover:bg-gray-300 dark:hover:bg-neutral-600" value="24">Last 24 hours</SelectItem>
                            <SelectItem className="hover:bg-gray-300 dark:hover:bg-neutral-600" value="3">Last 3 days</SelectItem>
                            <SelectItem className="hover:bg-gray-300 dark:hover:bg-neutral-600" value="7">Last 7 days</SelectItem>                
                          </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    {/* Radius */}
                    <FormField
                      name="radius"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            disabled={
                              form.getValues("location") === ""
                            }
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-40 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                <SelectValue placeholder="Radius" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white border border-gray-500 dark:bg-neutral-800 dark:text-white">
                <SelectItem className="hover:bg-gray-300 dark:hover:bg-neutral-600" value="10">Within 10Km</SelectItem>
                <SelectItem className="hover:bg-gray-300 dark:hover:bg-neutral-600" value="15">Within 15Km</SelectItem>
                <SelectItem className="hover:bg-gray-300 dark:hover:bg-neutral-600" value="25">Within 25Km</SelectItem>                
              </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <PaginationComponent
                    pageNumber={form.getValues("page") || "1"}
                    setPageNumber={form.setValue}
                  />
                </>
              )}
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
