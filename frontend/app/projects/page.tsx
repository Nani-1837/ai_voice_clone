"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PlusCircle, Search, Film, Download, Trash2, ArrowRight } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [projects] = useState([
    {
      id: "dub-948201",
      name: "AI & Quantum Computing Intro.mp4",
      thumbnail: "/cropped_circle_image.png",
      originalLanguage: "English",
      targetLanguage: "Telugu",
      duration: "04:12",
      status: "Completed",
      createdDate: "Sep 12, 2026",
    },
    {
      id: "dub-948202",
      name: "Global Education Keynote.mp4",
      thumbnail: "/cropped_circle_image.png",
      originalLanguage: "English",
      targetLanguage: "Hindi",
      duration: "08:45",
      status: "Processing",
      createdDate: "Sep 12, 2026",
    },
    {
      id: "dub-948203",
      name: "Product Walkthrough Reel.mp4",
      thumbnail: "/cropped_circle_image.png",
      originalLanguage: "English",
      targetLanguage: "Tamil",
      duration: "02:30",
      status: "Draft",
      createdDate: "Sep 11, 2026",
    },
  ]);

  const filtered = projects.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">All Dubbing Projects</h1>
            <p className="text-xs text-slate-500">Manage and view your video dubbing projects.</p>
          </div>
          <Link
            href="/create-dubbing"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Dubbing</span>
          </Link>
        </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <div key={project.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden">
                <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-900">
                  {project.status}
                </span>
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/70 text-white">
                  {project.duration}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 truncate">{project.name}</h3>
                <p className="text-xs text-slate-500">{project.originalLanguage} → <strong className="text-purple-700">{project.targetLanguage}</strong></p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link href={`/projects/${project.id}`} className="font-bold text-purple-600 hover:underline flex items-center gap-1">
                  <span>View Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
