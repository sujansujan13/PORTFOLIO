import React from "react";
import type { UseFormRegister } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import type { CompleteDashboardFormData } from "./profile-form";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

interface SocialLinksProps {
  register: UseFormRegister<CompleteDashboardFormData>;
}

export default function SocialLinks({ register }: SocialLinksProps) {
  return (
    <>
      <div className="space-y-1.5">
        <label className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
          GitHub URL
        </label>
        <div className="relative flex items-center">
          <div className="absolute left-3 flex items-center text-muted-foreground gap-1 border-r border-border/60 pr-2">
            <FaGithub className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono">git</span>
          </div>
          <input
            type="url"
            {...register("githubUrl")}
            className="w-full bg-input/30 border border-border/80 pl-16 pr-3 py-2 text-foreground focus:outline-none focus:border-primary rounded-md transition-colors"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
          X URL
        </label>
        <div className="relative flex items-center">
          <div className="absolute left-3 flex items-center text-muted-foreground gap-1 border-r border-border/60 pr-2">
            <FaXTwitter className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono">x.com</span>
          </div>
          <input
            type="url"
            {...register("twitterUrl")}
            className="w-full bg-input/30 border border-border/80 pl-19 pr-3 py-2 text-foreground focus:outline-none focus:border-primary rounded-md transition-colors"
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider">
          LinkedIn Url
        </label>
        <div className="relative flex items-center ">
          <div className="absolute left-3  flex items-center text-muted-foreground gap-1 border-r border-border/60 pr-2">
            <FaLinkedin className="w-3.5 h-3.5" />
            <span className="text-[10px] font-mono">linkedIn</span>
          </div>
          <input
            type="url"
            {...register("linkedinUrl")}
            className="w-full bg-input/30 border border-border/80 pl-23.5 pr-3 py-2 text-foreground focus:outline-none focus:border-primary rounded-md transition-colors"
          />
        </div>
      </div>
    </>
  );
}
