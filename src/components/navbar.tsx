"use client";
import React from "react";
import { Menu,} from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import { IconLocation, IconSearch } from "@tabler/icons-react";
import { Form, FormField, FormItem, FormControl,  } from "./ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import PaginationComponent from "./pagination";
import { useJobSearch } from "@/hooks/useJobSearch";
import { setShowAdditionalFilters } from "@/store/slices/jobsSlice";



export function NavbarDemo() {  

  const {isSubmitting, showAdditionalFilters, form, onSubmit, dispatch, jobs, isSubmitDisabled} = useJobSearch()
  
  return (   
  <> 
  {
    !isSubmitting && (
      
    
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
    <div className="relative w-full flex flex-col items-center  dark:text-white">
      {showAdditionalFilters && 
          <button onClick={(e) => 
          {
            e.preventDefault(); 
            form.resetField("datePosted");
            form.resetField("jobType");
            form.resetField("remote");
            form.resetField("radius");            
            localStorage.removeItem("formValues");           
            dispatch(setShowAdditionalFilters(false))
          }} className="text-lg text-black bg-gray-100 p-1 px-14 mb-3 rounded-md border font-semibold border-gray-500 hover:bg-gray-300 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-600" tabIndex={0} title="clear Search">Clear Filters</button>
      }

      <div className={cn("relative max-w-5xl w-full md:w-fit mx-auto z-50")}>
      <Menu>
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-2 lg:items-center w-full lg:w-fit">
          <div className="flex items-center gap-2 dark:bg-neutral-800">
            <IconSearch className="mt-1" />
            <FormField name="keyword" control={form.control} render={({ field }) => (<FormItem>
              <FormControl>
                <input {...field} className="flex-1 py-2 rounded-sm outline-none dark:bg-neutral-800 max-w-[30rem] min-w-[22rem]" type="text" placeholder="Job title or keywords"/>
              </FormControl>
            </FormItem>)} /> 
          </div>
          <p className="dark:bg-gray-400 h-1 w-full lg:h-full lg:w-[1.5px] bg-neutral-800"></p>          
          <div className="flex items-center gap-2 dark:bg-neutral-800">
            <IconLocation className="mt-1" />
            <FormField name="location" control={form.control} render={({ field }) => (<FormItem>
              <FormControl>
                <input {...field} className="flex-1 py-2 rounded-sm outline-none dark:bg-neutral-800 max-w-[30rem] min-w-[22rem]" type="text" placeholder="city or province"/>
              </FormControl> 
            </FormItem>)} /> 
          </div>
          <button disabled={isSubmitting || isSubmitDisabled} tabIndex={-1} type="submit" className={`bg-blue-500 lg:ml-6 px-2 text-white font-bold rounded-lg py-3 md:py-2 h-full text-nowrap hover:bg-blue-600`}>Find Jobs</button>
        </div>        
      </Menu>
      </div>

      {showAdditionalFilters && jobs.length > 0 && 
      <>
      <div className="grid-cols-2 grid gap-3 md:flex md:items-center mt-6">
        <FormField name="jobType" control={form.control} render={({ field }) => (
          <FormItem className="mr-2 bg-gray-200 hover:bg-gray-300 dark:bg-neutral-800 dark:hover:bg-neutral-600 rounded-md">
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="">
                  <SelectValue placeholder='Job Type'/>
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white border-gray-500 dark:bg-neutral-800 dark:text-white">
                <SelectItem className="hover:bg-gray-300 dark:hover:bg-neutral-600" value="full-time">Full Time</SelectItem>
                <SelectItem className="hover:bg-gray-300 dark:hover:bg-neutral-600" value="part-time">Part Time</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
          )} />

          <FormField name="remote" control={form.control} render={({ field }) => (
            <FormItem className="mr-2 bg-gray-200 hover:bg-gray-300 rounded-md dark:bg-neutral-800 dark:hover:bg-neutral-600">
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="">
                  <SelectValue placeholder="Remote" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white border border-gray-500 dark:bg-neutral-800 dark:text-white">
                <SelectItem className="hover:bg-gray-300 dark:hover:bg-neutral-600" value="true">True</SelectItem>
                <SelectItem className="hover:bg-gray-300 dark:hover:bg-neutral-600" value="false">False</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
          )} />

          <FormField name="datePosted" control={form.control} render={({ field }) => (
            <FormItem className="mr-2 bg-gray-200 hover:bg-gray-300 rounded-md dark:bg-neutral-800 dark:hover:bg-neutral-600">
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="">
                  <SelectValue placeholder="Date Posted" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white border border-gray-500 dark:bg-neutral-800 dark:text-white">
                <SelectItem className="hover:bg-gray-300 dark:hover:bg-neutral-600" value="24">Last 24 hours</SelectItem>
                <SelectItem className="hover:bg-gray-300 dark:hover:bg-neutral-600" value="3">Last 3 days</SelectItem>
                <SelectItem className="hover:bg-gray-300 dark:hover:bg-neutral-600" value="7">Last 7 days</SelectItem>                
              </SelectContent>
            </Select>
          </FormItem>
          )} />

          <FormField name="radius" control={form.control} render={({ field }) => (
            <FormItem className="mr-2 bg-gray-200 hover:bg-gray-300 rounded-md dark:bg-neutral-800 dark:hover:bg-neutral-600">
            <Select disabled={form.getValues("location") != "" ? false : true} onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="">
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
          )} />        
      </div>
          <PaginationComponent pageNumber={form.getValues("page") || "1"} setPageNumber={form.setValue} />
      </>
      }
    </div>
      </form>
    </Form>
    
  )}
  </> 
  );
}
