"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PlusCircle, Search, Film, Download, Trash2, ArrowRight } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

interface ProjectItem {
  id: string;
  name: string;
  thumbnail: string;
  originalLanguage: string;
  targetLanguage: string;
  duration: string;
  status: string;
  createdDate: string;
}

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    fetch(`${apiBaseUrl}/api/video/list`)
      .then((res) => {
        if (res.ok) return res.json();
        return [];
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const formatted: ProjectItem[] = data.map((item: any) => ({
            id: item.id,
            name: item.original_filename || "Untitled Video.mp4",
            thumbnail: "/cropped_circle_image.png",
            originalLanguage: item.source_language || "English",
            targetLanguage: item.target_language || "Telugu",
            duration: item.file_size ? `${(item.file_size / (1024 * 1024)).toFixed(1)} MB` : "HD Video",
            status: item.status || "Completed",
            createdDate: item.created_at ? new Date(item.created_at).toLocaleDateString() : "Sep 2026",
          }));
          setProjects(formatted);
        } else {
          setProjects([]);
        }
      })
      .catch(() => {
        setProjects([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6 font-sans">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">All Dubbing Projects</h1>
            <p className="text-xs text-slate-500">Manage and view your video dubbing projects.</p>
          </div>
          <Link
            href="/create-dubbing"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-transform active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Dubbing</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 text-slate-900"
          />
        </div>

        {/* Projects Cards Grid — No Duplicate Sample Data */}
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
            <Film className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">No Projects Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You have no active dubbing projects matching your search. Create a new dubbing project to get started!
            </p>
            <Link
              href="/create-dubbing"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Dubbing</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project) => (
              <div key={project.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3 hover:shadow-md transition-shadow">
                <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden">
                  <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-900 shadow-xs">
                    {project.status}
                  </span>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-white font-bold">
                    {project.duration}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 truncate" title={project.name}>{project.name}</h3>
                  <p className="text-xs text-slate-500">
                    {project.originalLanguage} → <strong className="text-purple-700 font-extrabold">{project.targetLanguage}</strong>
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <Link href={`/projects/${project.id}`} className="font-extrabold text-purple-600 hover:underline flex items-center gap-1">
                    <span>View Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </AppLayout>
  );
}
