export const buildUrl = (baseUrl:string, params: Record<string, string>, source:string) => {

    const { keyword, location, radius, jobType, maxDaysOld, page, remote } = params;

    if(source === "adzuna") {
        if (keyword) baseUrl += `&what=${keyword}`;
        if (location) baseUrl += `&where=${location}`;
        if (radius) baseUrl += `&distance=${radius}`;
        if (jobType === "full-time") baseUrl += `&full_time=1`;
        if (jobType === "part-time") baseUrl += `&part_time=1`;
        if(maxDaysOld) baseUrl += `&max_days_old=${maxDaysOld}`;
        if (page) baseUrl = baseUrl.replace(/\b\/1\b/g, `/${page}`);        
        if (remote === "true") baseUrl += `&remote=1`;

    } else {

        if (keyword) baseUrl += `&Keyword=${encodeURIComponent(keyword)}`;
        if (location) baseUrl += `&LocationName=${encodeURIComponent(location)}`;
        if (radius) baseUrl += `&Radius=${radius}`;
        if (jobType === "full-time") baseUrl += `&PositionScheduleTypeCode=1`;
        if (jobType === "part-time") baseUrl += `&PositionScheduleTypeCode=2`;
        if (maxDaysOld) baseUrl += `&DatePosted=${encodeURIComponent(maxDaysOld)}`;
        if (page) baseUrl += `&Page=${page}`;
        if (remote === "true") baseUrl += `&RemoteIndicator=true`;

    }
        
    return baseUrl;
}