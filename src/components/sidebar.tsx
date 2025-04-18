"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconBriefcase,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { SwitchDemo } from "./switch";



export const Logo = () => {
    return (
      <Link
        href="#"
        className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
      >
        <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-medium text-black dark:text-white whitespace-pre"
        >
          Jobify
        </motion.span>
      </Link>
    );
  };
  export const LogoIcon = () => {
    return (
      <Link
        href="#"
        className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
      >
        <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      </Link>
    );
  };

  export function SidebarDemo({ children }: { children: React.ReactNode }) {
  const session = useSession();
  console.log(session)
  
    const links = [
        {
          id:"1",
          label: "Jobs",
          href: "/jobs",
          icon: (
            <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
          ),
        },
        {
            id:"2",
            label: "Saved Jobs",
            href: "/saved-jobs",
            icon: (
              <IconBriefcase className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            )
        },
        {
            id:"3",
          label: "Profile",
          href: "/profile",
          icon: (
            <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
          ),
        },
        {
            id:"4",
          label: "Settings",
          href: "/settings",
          icon: (
            <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
          ),
        },                              
        {
            id:"5",
          label: "Logout",
          href: "/sign-in",
          icon: (
            <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
          ),          
        },
      ];

      const [open, setOpen] = useState(false);

      return (
        <div
          className={cn(
            "w-full flex flex-col md:flex-row bg-[#fcf9f3f1]+3 dark:bg-neutral-800 flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
            "h-screen"
          )}
        >
          <Sidebar open={open} setOpen={setOpen} animate={true}>
            <SidebarBody className="justify-between gap-10">
              <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <>
                  <Logo />
                </>
                <div className="mt-8 flex flex-col gap-2">
                  {links.map((link, idx) => (
                    <SidebarLink key={idx} link={link} />
                  ))}
                  
                  <SwitchDemo open={open} />
                </div>
              </div>
              <div>
                <div className="font-bold flex gap-2">   
                  {open && 
                  <span className="dark:text-white">{session.data?.user?.name}</span>
                  }               
                  <Image
                    src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                    width={30}
                    height={30}
                    className="rounded-full border border-black"
                    alt="profile"
                  />
                </div>
              </div>
            </SidebarBody>
          </Sidebar>
          <div className="flex-1 overflow-y-auto">           
            {children}
          </div>
        </div>
      );
}