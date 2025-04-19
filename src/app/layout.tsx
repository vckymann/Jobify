import type { Metadata } from "next";
import "./styles/globals.css";
import AuthProvider from "../context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";



export const metadata: Metadata = {
  title: "Job Finder",
  description: "Find your dream job",
  icons: "/logo.png",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">      
      <AuthProvider>    
        <body>
          {children}
          <Toaster />
        </body>    
      </AuthProvider>    
    </html>
  );
}
