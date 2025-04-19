import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    jobs: [],
    selectedJob: [],
    savedJobs: [],
    isSubmitting: false,
    showAdditionalFilters: false,
    isDarkMode: true,
    resumeExists: false,    
}

const jobsSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        setJobs: (state, action) => {
            state.jobs = action.payload;
        },
        setSelectedJob: (state, action) => {
            state.selectedJob = action.payload;
        },
        setSavedJobs: (state, action) => {
            state.savedJobs = action.payload;
        },
        setIsSubmitting: (state, action) => {
            state.isSubmitting = action.payload;
        },
        setShowAdditionalFilters: (state, action) => {
            state.showAdditionalFilters = action.payload;
        },
        setIsDarkMode: (state, action) => {
            state.isDarkMode = action.payload;
        },
        setResumeExists: (state,action) => {
            state.resumeExists = action.payload
        },        
    }
})

export const { setJobs, setSelectedJob, setSavedJobs, setIsSubmitting, setShowAdditionalFilters, setIsDarkMode, setResumeExists} = jobsSlice.actions;
export default jobsSlice.reducer