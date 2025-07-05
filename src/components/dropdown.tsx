import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { setResumeExists } from "@/store/slices/jobsSlice";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import fileDownload from "js-file-download";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";

export function DropdownMenuDemo({  
  resumePath,
  setResumePath,
  setProcessingMessage
}: {  
  resumePath: string;
  setResumePath: (resumePath: string) => void;
  setProcessingMessage: (processingMessage: string) => void;
}) {
  
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);

  const handleDownloadButton = async () => {
    if (resumePath) {
      try {
        const response = await axios.get(resumePath, {responseType: "blob"});
        const blob = new Blob([response.data], { type: "application/pdf" });        
        fileDownload(blob, "resume.pdf");
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Failed to download resume",
          description: axiosError.response?.data.message,
        })
      }      
    }
  };

  const handleReplaceButton = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      setOpen(false);
      setProcessingMessage("Uploading resume...");
      const response = await axios.post("/api/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {  
        dispatch(setResumeExists(true));
        setResumePath(response.data.data);
        setProcessingMessage("");   
        toast({
          title: "Success",
          description: response?.data?.message,
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Failed to replace resume",
        description: axiosError.response?.data.message,
      });
    }
  };

  const handleFiledelete  = async () => {    
    try {
      setProcessingMessage("Deleting resume...");
      const response = await axios.delete(`/api/resume`);
      if (response.status === 200) {
        dispatch(setResumeExists(false));
        setResumePath('')
        setProcessingMessage("");
        dispatch(setResumeExists(false));
        toast({
          title: "Success",
          description: response?.data?.message,
        });
      }
      
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Failed to delete resume",
        description: axiosError.response?.data.message,
      });
    }
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="text-3xl outline-none">...</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-gray-100 dark:bg-neutral-800 dark:border-neutral-500 dark:text-white border border-gray-400">
        <a href={resumePath} target="_blank">
          <DropdownMenuItem className=" hover:bg-gray-200 dark:hover:bg-neutral-600 cursor-pointer">View</DropdownMenuItem>
        </a>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-green-600 hover:bg-gray-200 dark:hover:bg-neutral-600 cursor-pointer"
          onClick={handleDownloadButton}
        >
          Download
        </DropdownMenuItem>
        <DropdownMenuSeparator />        
          <button
            className="w-full text-left text-sm px-2 py-1 hover:bg-gray-200 dark:hover:bg-neutral-600"
            onClick={handleReplaceButton}
          >
            Replace
          </button>
        <input
          type="file"
          accept=".pdf"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileUpload}
        />

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleFiledelete}
          className="text-red-600  hover:bg-gray-200 dark:hover:bg-neutral-600 cursor-pointer"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
