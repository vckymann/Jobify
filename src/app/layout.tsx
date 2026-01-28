import type { Metadata } from "next";
import "./styles/globals.css";
import AuthProvider from "../context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";



export const metadata: Metadata = {
  title: "Jobify",
  description: "Find your dream job",
  icons: "/logo.png",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-[100dvh]">  
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    </head>    
      <AuthProvider>    
        <body>
          {children}
          <Toaster />
        </body>    
      </AuthProvider>    
    </html>
  );
}
