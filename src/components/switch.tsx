import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast";
import { RootState } from "@/store/store";
import { ApiResponse } from "@/types/ApiResponse";
import { IconAi } from "@tabler/icons-react"
import axios, { AxiosError } from "axios";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export function SwitchDemo({open}:{open:boolean}) {

    const [isChecked, setIsChecked] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const resumeExists = useSelector((state: RootState) => state.jobs.resumeExists);

    useEffect(() => {
        const getAiStatus = async () => {
            try {
                const response = await axios.get("/api/useAi");
                if (response.status === 200) {
                    setIsChecked(response.data.useAi);
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                if (axiosError.response?.data.message === "user not found") {
                    signOut()
                }
                toast({
                    title: "Failed to use AI",
                    description: axiosError.response?.data.message,
                });
            }
        }
        getAiStatus();
    }, []);

    useEffect(() => {
        if(!resumeExists && isChecked) {
            setIsChecked(false);            
        }
    }, [resumeExists]);


  return (
    <div className="flex items-center space-x-2 mt-12">
        {
            open ? (
                <Label htmlFor="useai" className="text-neutral-700 dark:text-neutral-200">Use Ai</Label>
            )   : (
                <IconAi className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
            )
        }
      <Switch onCheckedChange={async () => {
        setDisabled(true);
        if (!resumeExists) {

            toast({
                title: "Resume not found",
                description: "Please upload your resume in the profile first",
            });
            return
        }
        try {            
            const response = await axios.post("/api/useAi", { useAi: !isChecked });
            if (response.status === 200) {
                toast({
                    title: "Success",
                    description: response?.data?.message,                    
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: "Failed to use ai",
                description: axiosError.response?.data.message,
            });
        }
        setIsChecked(!isChecked);
        setDisabled(false);
    }} checked={isChecked} id="useai" className={`${disabled ? "opacity-80" : ""}`} />
    </div>
  )
}
