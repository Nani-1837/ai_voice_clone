"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export type FormatFileProps =
  | "Telugu -> English"
  | "English -> Telugu"
  | "Tamil -> Telugu"
  | "Telugu -> Tamil"
  | "English -> Hindi"
  | "Hindi -> English"
  | "Malayalam -> Telugu"
  | "Telugu -> Malayalam"
  | "Kannada -> Telugu"
  | "Telugu -> Kannada"
  | "Korean -> Telugu"
  | "Telugu -> Korean"
  | "Japanese -> Telugu"
  | "Japanese -> English"
  | "doc"
  | "pdf"
  | "md"
  | "mdx"
  | "txt"
  | "csv"
  | "xls"
  | "xlsx"
  | "ppt"
  | "pptx"
  | "zip"
  | "rar"
  | "tar"
  | "gz"
  | "html"
  | "js"
  | "jsx"
  | "css"
  | "json"
  | "tsx"
  | "code"
  | "img"
  | "png"
  | "jpg"
  | "jpeg"
  | "video"
  | string;

export type FileCardProps = {
  formatFile: FormatFileProps;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  label?: string;
};

const DefaultPlaceholder = () => {
  return (
    <div className="space-y-1.5 w-full">
      <div className="flex gap-2">
        <div className="bg-purple-500/30 h-1 w-1/2 rounded-full" />
      </div>
      <div className="flex gap-1">
        <div className="bg-purple-500/20 h-1 w-1/3 rounded-full" />
        <div className="bg-purple-500/20 h-1 w-1/3 rounded-full" />
      </div>
      <div className="flex gap-1">
        <div className="bg-purple-500/20 h-1 w-1/2 rounded-full" />
        <div className="bg-purple-500/20 h-1 w-1/3 rounded-full" />
      </div>
      <div className="flex gap-1">
        <div className="bg-purple-500/20 h-1 w-1/3 rounded-full" />
        <div className="bg-purple-500/20 h-1 w-1/3 rounded-full" />
      </div>
    </div>
  );
};

const colorBannerMap: Record<string, string> = {
  // Language presets
  "Telugu -> English": "bg-gradient-to-r from-purple-600 to-indigo-600 text-white",
  "English -> Telugu": "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white",
  "Tamil -> Telugu": "bg-gradient-to-r from-amber-500 to-orange-600 text-white",
  "Telugu -> Tamil": "bg-gradient-to-r from-orange-500 to-red-600 text-white",
  "English -> Hindi": "bg-gradient-to-r from-emerald-600 to-teal-600 text-white",
  "Hindi -> English": "bg-gradient-to-r from-teal-600 to-cyan-600 text-white",
  "Malayalam -> Telugu": "bg-gradient-to-r from-pink-600 to-rose-600 text-white",
  "Telugu -> Malayalam": "bg-gradient-to-r from-rose-600 to-purple-600 text-white",
  "Kannada -> Telugu": "bg-gradient-to-r from-blue-600 to-indigo-600 text-white",
  "Telugu -> Kannada": "bg-gradient-to-r from-violet-600 to-purple-600 text-white",
  "Korean -> Telugu": "bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white",
  "Telugu -> Korean": "bg-gradient-to-r from-purple-600 to-pink-600 text-white",
  "Japanese -> Telugu": "bg-gradient-to-r from-red-600 to-pink-600 text-white",
  "Japanese -> English": "bg-gradient-to-r from-cyan-600 to-blue-600 text-white",
  
  // Document / file extension formats
  doc: "bg-blue-500 text-white",
  pdf: "bg-red-500 text-white",
  md: "bg-neutral-600 text-white",
  mdx: "bg-neutral-600 text-white",
  txt: "bg-gray-500 text-white",
  csv: "bg-teal-700 text-white",
  xls: "bg-emerald-600 text-white",
  xlsx: "bg-emerald-600 text-white",
  ppt: "bg-orange-500 text-white",
  pptx: "bg-orange-500 text-white",
  zip: "bg-purple-500 text-white",
  rar: "bg-purple-600 text-white",
  tar: "bg-yellow-600 text-white",
  gz: "bg-yellow-700 text-white",
  html: "bg-orange-600 text-white",
  js: "bg-yellow-600 text-white",
  jsx: "bg-blue-600 text-white",
  css: "bg-blue-600 text-white",
  json: "bg-yellow-500 text-white",
  tsx: "bg-blue-600 text-white",
  code: "bg-orange-600 text-white",
  img: "bg-pink-500 text-white",
  png: "bg-neutral-600 text-white",
  jpg: "bg-green-700 text-white",
  jpeg: "bg-green-700 text-white",
  video: "bg-green-700 text-white",
};

export const FileCard = ({ formatFile, onClick, active = false, className, label }: FileCardProps) => {
  const colorBannerClass = colorBannerMap[formatFile] || "bg-purple-600 text-white";
  let filePlaceholder: ReactNode = <DefaultPlaceholder />;

  const isLanguagePair = formatFile.includes("->");

  if (isLanguagePair) {
    const parts = formatFile.split("->").map(s => s.trim());
    filePlaceholder = (
      <div className="flex flex-col items-center justify-center h-full space-y-1 text-center">
        <div className="text-[10px] font-extrabold text-slate-800 tracking-tight leading-none uppercase truncate max-w-full">
          {parts[0]}
        </div>
        <div className="text-[8px] font-bold text-purple-600">
          ↓ dub
        </div>
        <div className="text-[10px] font-extrabold text-purple-700 tracking-tight leading-none uppercase truncate max-w-full">
          {parts[1]}
        </div>
      </div>
    );
  } else if (formatFile === "md" || formatFile === "mdx") {
    filePlaceholder = (
      <div className="space-y-1.5">
        <div className="flex items-center gap-1">
          <div className="text-foreground/30 text-[10px] font-bold">#</div>
          <div className="bg-foreground/20 h-0.5 w-6 rounded-full" />
        </div>
        <div className="space-y-1">
          <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
          <div className="bg-foreground/10 h-0.5 w-7 rounded-full" />
        </div>
        <div className="space-y-1">
          <div className="bg-foreground/10 h-0.5 w-8 rounded-full" />
          <div className="bg-foreground/10 h-0.5 w-4 rounded-full" />
        </div>
      </div>
    );
  } else if (formatFile === "video") {
    filePlaceholder = (
      <div className="bg-foreground/5 space-y-1 rounded border p-1">
        <div className="flex justify-center gap-1">
          <div className="size-0 border-y-[5px] border-l-8 border-y-transparent border-l-green-500/80" />
        </div>
        <div className="bg-foreground/15 mx-auto mt-1 h-0.75 w-4 rounded-full" />
      </div>
    );
  }

  const badgeText = label || formatFile;

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn(
        "relative group cursor-pointer transition-all transform hover:-translate-y-1 select-none",
        className
      )}
    >
      {/* Outer Card Container */}
      <div
        className={cn(
          "relative z-10 w-24 h-28 rounded-2xl p-2.5 flex flex-col justify-between transition-all border shadow-xs overflow-hidden",
          active
            ? "bg-purple-50/90 border-purple-500 ring-2 ring-purple-500/40 shadow-purple-500/20 shadow-md"
            : "bg-white border-slate-200 hover:border-purple-300 hover:shadow-md"
        )}
      >
        {/* Placeholder Content Graphic */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          {filePlaceholder}
        </div>

        {/* Format Badge Banner */}
        <div
          className={cn(
            "w-full rounded-lg px-1.5 py-1 text-[9px] font-extrabold text-center uppercase truncate tracking-wider shadow-2xs transition-all",
            colorBannerClass
          )}
        >
          {badgeText}
        </div>
      </div>
    </div>
  );
};

export default FileCard;
