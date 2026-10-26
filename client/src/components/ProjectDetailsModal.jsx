import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BASE_URL } from '../api';
import { 
    X, 
    Folder, 
    Calendar, 
    FileCode, 
    Globe, 
    Code, 
    ExternalLink,
    User,
    ShieldCheck,
    HardDrive,
    Sparkles,
    CheckCircle2,
    Layers,
    ArrowUpRight
} from 'lucide-react';

const ProjectDetailsModal = ({ project, isOpen, onClose }) => {
    const [imgError, setImgError] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Reset image error state whenever project changes
    useEffect(() => {
        setImgError(false);
    }, [project?._id, project?.thumbnail]);

    // Handle ESC key to close
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose?.();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!mounted || !isOpen || !project) return null;

    const departmentName = project.department?.name || project.category || 'Development';
    const employeeName = project.employee?.username || 'Error Infotech Team';
    const filesCount = project.files?.length || 0;
    const formattedDate = project.createdAt
        ? new Date(project.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
          })
        : 'Active Project';

    // Helper to format file size
    const formatFileSize = (bytes) => {
        if (!bytes || bytes === 0) return '0 KB';
        const k = 1024;
        if (bytes < k) return `${bytes} B`;
        if (bytes < k * k) return `${(bytes / k).toFixed(1)} KB`;
        return `${(bytes / (k * k)).toFixed(1)} MB`;
    };

    // Clean URL for display
    const getCleanDomain = (url) => {
        try {
            return new URL(url).hostname;
        } catch {
            return url;
        }
    };

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-[#030712]/80 backdrop-blur-md transition-opacity"
                />

                {/* Modal Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 16 }}
                    transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
                    className="relative w-full max-w-4xl bg-white dark:bg-[#070e26] rounded-3xl border border-[#CBDCF8] dark:border-[#14235a] shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col"
                >
                    {/* 🌟 Header Section with Brand Gradient & Safe Media Fallback */}
                    <div className="relative min-h-[140px] sm:min-h-[160px] bg-gradient-to-r from-[#0a1538] via-[#102052] to-[#081230] p-6 sm:p-8 flex flex-col justify-between overflow-hidden shrink-0 border-b border-[#14235a]">
                        {/* Background Thumbnail if available and not errored */}
                        {project.thumbnail && !imgError && (
                            <img
                                src={
                                    project.thumbnail.startsWith('http')
                                        ? project.thumbnail
                                        : `${BASE_URL}/uploads/${encodeURIComponent(project.thumbnail)}`
                                }
                                alt=""
                                onError={() => setImgError(true)}
                                className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay"
                            />
                        )}

                        {/* Subtle Tech Pattern Background */}
                        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
                        <div className="absolute -right-12 -top-12 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

                        {/* Top Bar inside Header */}
                        <div className="relative z-10 flex items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/10 text-white backdrop-blur-md border border-white/20">
                                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                                    <span>{departmentName}</span>
                                </span>

                                {project._id && (
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/30 text-sky-200 backdrop-blur-md border border-white/10">
                                        ID: {project._id.slice(-6)}
                                    </span>
                                )}

                                {project.liveUrl && (
                                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                        <span>Production Live</span>
                                    </span>
                                )}
                            </div>

                            {/* Close Button */}
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0 border border-white/15"
                                title="Close Modal (Esc)"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Project Title & Quick Info */}
                        <div className="relative z-10 mt-4 sm:mt-6">
                            <h2 
                                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight"
                                style={{ fontFamily: "'Outfit', sans-serif" }}
                            >
                                {project.title}
                            </h2>
                            <p 
                                className="text-sky-200/80 text-xs sm:text-sm font-medium mt-1 flex flex-wrap items-center gap-x-4 gap-y-1"
                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            >
                                <span className="inline-flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                                    <span>Created {formattedDate}</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-sky-400" />
                                    <span>Lead: {employeeName}</span>
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <FileCode className="w-3.5 h-3.5 text-sky-400" />
                                    <span>{filesCount.toLocaleString()} Assets</span>
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* 📋 Content Body - Structured Two-Column Layout */}
                    <div className="p-5 sm:p-8 space-y-6 overflow-y-auto flex-1">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Left Column (Main Information) */}
                            <div className="lg:col-span-7 space-y-6">
                                {/* Project Overview */}
                                <div>
                                    <div className="flex items-center justify-between mb-2.5">
                                        <h4 
                                            className="text-xs font-bold uppercase tracking-wider text-[#0f1d40] dark:text-sky-300 flex items-center gap-1.5"
                                            style={{ fontFamily: "'Outfit', sans-serif" }}
                                        >
                                            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                                            <span>Project Overview</span>
                                        </h4>
                                    </div>
                                    <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#0c1638] border border-[#CBDCF8]/70 dark:border-[#17275c] text-slate-700 dark:text-slate-200 text-xs sm:text-sm leading-relaxed">
                                        <p className="whitespace-pre-line">
                                            {project.description ||
                                                'Enterprise business solution and digital asset deployment engineered for high performance, reliability, and smooth user experience.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Files & Artifacts Explorer (Capped for smooth performance) */}
                                <div>
                                    <div className="flex items-center justify-between mb-2.5">
                                        <h4 
                                            className="text-xs font-bold uppercase tracking-wider text-[#0f1d40] dark:text-sky-300 flex items-center gap-1.5"
                                            style={{ fontFamily: "'Outfit', sans-serif" }}
                                        >
                                            <HardDrive className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                                            <span>Repository Package & Files</span>
                                        </h4>
                                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                            {filesCount.toLocaleString()} Total Files
                                        </span>
                                    </div>

                                    {filesCount > 0 ? (
                                        <div className="rounded-2xl border border-[#CBDCF8]/70 dark:border-[#17275c] bg-[#F8FAFC] dark:bg-[#0c1638] p-3 space-y-2">
                                            <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1">
                                                {project.files.slice(0, 10).map((file, i) => (
                                                    <div
                                                        key={file._id || i}
                                                        className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-[#08102a] border border-slate-200/60 dark:border-slate-800/80 text-xs shadow-2xs hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                                                    >
                                                        <div className="flex items-center space-x-2.5 truncate min-w-0 mr-2">
                                                            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-sky-400 shrink-0">
                                                                <FileCode className="h-3.5 w-3.5" />
                                                            </div>
                                                            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                                                {file.name || file.relativePath || `Project File ${i + 1}`}
                                                            </span>
                                                        </div>
                                                        <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0">
                                                            {formatFileSize(file.size)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Overflow Indicator for thousands of files */}
                                            {filesCount > 10 && (
                                                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 text-center">
                                                    <span className="inline-block text-[11px] font-bold text-blue-600 dark:text-sky-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900/60">
                                                        + {(filesCount - 10).toLocaleString()} more files in repository archive
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
                                            No local source files attached to this build.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column (Deployments, Links & Quick Meta) */}
                            <div className="lg:col-span-5 space-y-4">
                                {/* Deployments Card */}
                                <div className="p-5 rounded-2xl bg-[#EDF6FF] dark:bg-[#0c1638] border border-[#CBDCF8] dark:border-[#17275c] space-y-4">
                                    <h4 
                                        className="text-xs font-bold uppercase tracking-wider text-[#0f1d40] dark:text-sky-300 flex items-center gap-1.5"
                                        style={{ fontFamily: "'Outfit', sans-serif" }}
                                    >
                                        <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                                        <span>Deployments & Links</span>
                                    </h4>

                                    <div className="space-y-2.5">
                                        {project.liveUrl ? (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#193278] hover:to-[#1d4ed8] text-white shadow-md shadow-blue-900/15 transition-all cursor-pointer"
                                            >
                                                <div className="flex items-center space-x-2.5 min-w-0 mr-2">
                                                    <Globe className="h-4 w-4 shrink-0 text-sky-200" />
                                                    <div className="truncate">
                                                        <span className="text-xs font-bold block leading-tight">
                                                            Live Production Build
                                                        </span>
                                                        <span className="text-[10px] text-sky-200/90 truncate block">
                                                            {getCleanDomain(project.liveUrl)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <ExternalLink className="h-4 w-4 shrink-0 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </a>
                                        ) : (
                                            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#08102a]/70 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 text-center">
                                                No live web URL configured
                                            </div>
                                        )}

                                        {project.githubUrl ? (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex items-center justify-between p-3.5 rounded-xl bg-white dark:bg-[#08102a] hover:bg-slate-50 dark:hover:bg-[#0e1c48] border border-[#CBDCF8]/80 dark:border-[#17275c] text-slate-800 dark:text-slate-100 transition-all cursor-pointer shadow-2xs"
                                            >
                                                <div className="flex items-center space-x-2.5 min-w-0 mr-2">
                                                    <Code className="h-4 w-4 shrink-0 text-slate-600 dark:text-slate-300" />
                                                    <div className="truncate">
                                                        <span className="text-xs font-bold block leading-tight">
                                                            Source Code Repository
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 truncate block">
                                                            GitHub / Version Control
                                                        </span>
                                                    </div>
                                                </div>
                                                <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </a>
                                        ) : (
                                            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#08102a]/70 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 text-center">
                                                Private internal repository
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Project Attributes & Metadata Card */}
                                <div className="p-5 rounded-2xl bg-white dark:bg-[#08102a] border border-[#CBDCF8]/70 dark:border-[#17275c] space-y-3.5 shadow-2xs">
                                    <h4 
                                        className="text-xs font-bold uppercase tracking-wider text-[#0f1d40] dark:text-sky-300 flex items-center gap-1.5"
                                        style={{ fontFamily: "'Outfit', sans-serif" }}
                                    >
                                        <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                                        <span>Project Attributes</span>
                                    </h4>

                                    <div className="space-y-2.5 text-xs">
                                        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                                            <span className="text-slate-500 font-medium">Department</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                                                {departmentName}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                                            <span className="text-slate-500 font-medium">Engineer</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200">
                                                @{employeeName}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/80">
                                            <span className="text-slate-500 font-medium">Created On</span>
                                            <span className="font-bold text-slate-800 dark:text-slate-200">
                                                {formattedDate}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-1">
                                            <span className="text-slate-500 font-medium">Status</span>
                                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                <span>Verified Build</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ⚓ Bottom Action Bar */}
                    <div className="p-4 sm:p-5 bg-[#F8FAFC] dark:bg-[#060c22] border-t border-[#CBDCF8]/70 dark:border-[#14235a] flex items-center justify-between gap-3">
                        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-bold text-slate-700 dark:text-slate-300">{project.title}</span>
                            <span>&bull;</span>
                            <span>Error Infotech Architecture</span>
                        </div>

                        <div className="flex items-center gap-2.5 ml-auto">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0c1638] hover:bg-slate-100 dark:hover:bg-[#122258] text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer shadow-2xs"
                            >
                                Close
                            </button>

                            {project.liveUrl && (
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#193278] hover:to-[#1d4ed8] text-white font-bold text-xs shadow-md shadow-blue-900/15 transition-all cursor-pointer"
                                >
                                    <span>Launch Live</span>
                                    <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
};

export default ProjectDetailsModal;
