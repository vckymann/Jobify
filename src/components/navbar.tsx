"use client";
import React, { useEffect, useRef, } from "react";
import { Menu,} from "./ui/navbar-menu";
import { cn } from "@/lib/utils";
import { IconLocation, IconSearch } from "@tabler/icons-react";
import { Form, FormField, FormItem, FormControl,  } from "./ui/form";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setIsSubmitting, setJobs, setSelectedJob, setShowAdditionalFilters } from "@/store/slices/jobsSlice";
import PaginationComponent from "./pagination";
import { useDebounceCallback } from "usehooks-ts";
import { RootState } from "@/store/store";
import { jobSearchSchema } from "@/schemas/jobSearchSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";



export function NavbarDemo() {  

  const dispatch = useDispatch();
  
  const jobs = useSelector((state: RootState) => state.jobs.jobs);
  const isSubmitting = useSelector((state: RootState) => state.jobs.isSubmitting);
  const showAdditionalFilters = useSelector((state: RootState) => state.jobs.showAdditionalFilters);
  
  const defaultFormValues = {
    keyword: "",
    location: "",
    jobType: "",
    remote: "",
    datePosted: "",
    radius: "",
    page: 1
  }
  
  const storedValues  = localStorage.getItem("formValues");
  const parsedValues = storedValues ? JSON.parse(storedValues) : {};
  const formValues = {
    ...defaultFormValues,
    ...parsedValues
  }
  
  const form = useForm<z.infer<typeof jobSearchSchema>>({
    resolver: zodResolver(jobSearchSchema),
    defaultValues: formValues
  })
  
  const isSubmitDisabled = !form.getValues("keyword") && !form.getValues("location")
  const watchFields = form.watch([ "jobType", "remote", "datePosted", "radius", "page"]);
  
  const fetchJobs = async (data: z.infer<typeof jobSearchSchema>) => {
    dispatch(setIsSubmitting(true))
    try {
      const response = await axios.get(`/api/jobs?keyword=${data.keyword}&location=${data.location}&jobType=${data.jobType}&datePosted=${data.datePosted}&remote=${data.remote}&radius=${data.radius}&page=${data.page}`)
      
      if(response && response.data) {        
        dispatch(setJobs(response.data.data))
      }
    } catch (error) {
      console.log(error)
    } finally {
      dispatch(setIsSubmitting(false))
    }
  }
  
  const debouncedFetch = useDebounceCallback(() => {fetchJobs(form.getValues())    
  }, 1500);
  
  const onSubmit = (data: z.infer<typeof jobSearchSchema>) => {       
    dispatch(setShowAdditionalFilters(true))
    fetchJobs(data)
    dispatch(setSelectedJob([]))
  }
  
  useEffect(() => {
    const subscription = form.watch((values) => {
      localStorage.setItem("formValues", JSON.stringify({
        ...formValues,
        ...values
      }));
    });
  
    return () => subscription.unsubscribe();
  }, [form.watch, formValues]);


  const prevFormValues = useRef(form.getValues())
  
  useEffect(() => {  

    const currentvalues = form.getValues()
    console.log(currentvalues, prevFormValues.current);
    

  if (Object.values(watchFields).every(value => value === "")) {
      return;
  }
    if (!showAdditionalFilters) {
      return
    }    
    
    if (isSubmitting) {
      return
    }

    if (JSON.stringify(prevFormValues.current) === JSON.stringify(currentvalues)) {
      prevFormValues.current = currentvalues
      return
    }
    
    dispatch(setIsSubmitting(true))
    debouncedFetch()

  },[...watchFields, showAdditionalFilters])
  

  return (   
  <> 
  {
    !isSubmitting && (
      
    
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
    <div className="relative  w-full flex flex-col items-center dark:text-white">
      {showAdditionalFilters && 
          <button onClick={(e) => 
            {e.preventDefault();
            dispatch(setShowAdditionalFilters(false))}} className="text-lg text-black bg-gray-100 p-1 px-14 mb-3 rounded-md border font-semibold border-gray-500 hover:bg-gray-300 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-600" tabIndex={0} title="clear Search">Hide Filters</button>
      }

      <div className={cn("relative max-w-5xl mx-auto z-50")}>
      <Menu>
        <div className="flex gap-2 items-center ">
          <div className="flex items-center gap-2 dark:bg-neutral-800">
            <IconSearch className="mt-1" />
            <FormField name="keyword" control={form.control} render={({ field }) => (<FormItem>
              <FormControl>
                <input {...field} className="flex-1 py-2 rounded-sm outline-none dark:bg-neutral-800" type="text" placeholder="Job title or keywords"/>
              </FormControl>
            </FormItem>)} /> 
          </div>
          <p className="bg-gray-400 w-[1.5px] h-full dark:bg-neutral-800"></p>
          <div className="flex items-center gap-2 dark:bg-neutral-800">
            <IconLocation className="mt-1" />
            <FormField name="location" control={form.control} render={({ field }) => (<FormItem>
              <FormControl>
                <input {...field} className="flex-1 py-2 rounded-sm outline-none dark:bg-neutral-800" type="text" placeholder="city, province or 'remote'"/>
              </FormControl> 
            </FormItem>)} /> 
          </div>
          <button disabled={isSubmitting || isSubmitDisabled} tabIndex={-1} type="submit" className={`bg-blue-500 ml-6 px-2 text-white font-bold rounded-lg h-full text-nowrap hover:bg-blue-600`}>Find Jobs</button>
        </div>        
      </Menu>
      </div>

      {showAdditionalFilters && jobs.length > 0 && 
      <>
      <div className="flex gap-2 items-center mt-6">
        <FormField name="jobType" control={form.control} render={({ field }) => (
          <FormItem className="mr-2 bg-gray-200 hover:bg-gray-300 dark:bg-neutral-800 dark:hover:bg-neutral-600 rounded-md">
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="">
                  <SelectValue placeholder="Job Type"/>
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
