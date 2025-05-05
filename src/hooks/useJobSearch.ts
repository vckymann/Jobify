/* eslint-disable react-hooks/exhaustive-deps */
import { jobSearchSchema } from "@/schemas/jobSearchSchema";
import { setIsSubmitting, setJobs, setShowAdditionalFilters, setSelectedJob } from "@/store/slices/jobsSlice";
import { RootState } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useDebounceCallback } from "usehooks-ts";
import { z } from "zod";

export const useJobSearch = () => {
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
    page: "1"
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

  return { isSubmitting, form, onSubmit, showAdditionalFilters, dispatch, jobs, isSubmitDisabled }
}