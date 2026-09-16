"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Trash2,
  Edit2
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params?.id as string) || "dub-948201";

  // Video Ref & Player State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");

  // Modals & Metadata State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [projectName, setProjectName] = useState("Quantum_Physics_Lecture.mp4");

  // Fetch real video metadata & stream from backend DB
  useEffect(() => {
    if (!projectId) return;

    fetch(`http://localhost:8000/api/video/${projectId}`)
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data && data.original_filename) {
          setProjectName(data.original_filename);
          const filename = data.storage_path.split(/[/\\]/).pop();
          if (filename) {
            setVideoUrl(`http://localhost:8000/uploads/original/${filename}`);
          }
        }
      })
      .catch(() => {
        setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
      });
  }, [projectId]);

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans">
        
        {/* Professional Clean Header Bar */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <Link
              href="/projects"
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">{projectName}</h1>
                <button
                  onClick={() => setShowRenameModal(true)}
                  className="p-1 text-slate-400 hover:text-purple-600"
                  title="Rename Project"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-500">Project ID: #{projectId} • Standard 16:9 HD Video Format</p>
            </div>
          </div>

          {/* Download & Share Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => alert("Downloading dubbed video (.MP4)...")}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-5 py-2.5 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Video (.MP4)</span>
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Professional Video Viewport Container — Sharp Rectangular Edges (No Curves / No Poster Image) */}
        <div className="w-full max-w-5xl mx-auto aspect-video bg-black relative flex flex-col justify-between border border-slate-900 shadow-2xl">
          
          {/* Pure HTML5 Video Tag with Native Controls & Edge-to-Edge Rectangular Frame */}
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            autoPlay={false}
            preload="metadata"
            className="w-full h-full object-contain bg-black"
            onError={() => {
              setVideoUrl("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4");
            }}
          />

        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-white border border-slate-200 p-6 max-w-sm w-full space-y-4 shadow-2xl text-center"
              >
                <div className="w-12 h-12 bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Delete Project?</h3>
                  <p className="text-xs text-slate-500">
                    Are you sure you want to delete "{projectName}"? This action cannot be undone.
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      router.push("/projects");
                    }}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Yes, Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
