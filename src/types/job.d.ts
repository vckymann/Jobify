type DateString = string & {format: 'YYYY-MM-DD' | 'ISO-8601'}

export interface AdzunaApiJob {
    id: string,
    title: string,
    description: string,
    location: {
        display_name: string
    },
    company: {
        display_name: string
    },
    salary_min: number,
    salary_max: number,
    created: DateString,
    contract_time: string,
    redirect_url: string
}

export interface NormalizedJob {
    jobId: string
    title: string
    company: string
    description: string
    location: string
    minSalary: number | string
    maxSalary: number | string
    jobPosted: DateString
    jobUrl: string
    contractType: string
    source: string
    matchScore?: number
    saved?: boolean
}
