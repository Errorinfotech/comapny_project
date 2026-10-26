import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import api, { BASE_URL } from '../api';
import {
    Plus,
    Folder,
    Code,
    MoreVertical,
    ExternalLink,
    Calendar,
    Search,
    Upload,
    FileCode,
    Trash2,
    Edit,
    Globe,
    Sparkles,
    LayoutGrid,
    List,
    Layers,
    Database,
    HardDrive,
    ShieldCheck,
    X,
    ArrowUpRight,
    CheckCircle2,
    FolderOpen,
    Eye,
    Filter,
    ArrowUpDown,
    Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectEngine from '../components/ProjectEngine';
import { ConfirmDeleteModal } from '../components/ui';

// --- Sub-Component: Project Details Modal (View Only) ---
const ProjectDetailsModal = ({ project, isOpen, onClose }) => {
    if (!isOpen || !project) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 16 }}
                    className="relative w-full max-w-2xl bg-white dark:bg-[#08102a] rounded-[2rem] border border-sky-200/80 dark:border-[#192b68] shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
                >
                    {/* Header Image or Graphic Header */}
                    <div className="relative h-48 sm:h-56 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 overflow-hidden shrink-0">
                        {project.thumbnail ? (
                            <img
                                src={`${BASE_URL}/uploads/${encodeURIComponent(project.thumbnail)}`}
                                alt={project.title}
                                className="w-full h-full object-cover opacity-80"
                                onError={(e) => {
                                    if (!e.target.dataset.tried) {
                                        e.target.dataset.tried = 'true';
                                        e.target.src = e.target.src.replace('localhost', '127.0.0.1');
                                    }
                                }}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                <Folder className="w-40 h-40 text-white" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#08102a] via-[#08102a]/40 to-transparent" />

                        {/* Top Action buttons */}
                        <div className="absolute top-4 right-4 flex items-center space-x-2">
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 backdrop-blur-sm transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Title overlay */}
                        <div className="absolute bottom-4 left-6 right-6">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-md border border-white/30 inline-block mb-2">
                                ID: {project._id.slice(-6)}
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                                {project.title}
                            </h2>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
                        {/* Meta info strip */}
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-blue-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-blue-900/40 font-semibold">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                                <Folder className="h-3.5 w-3.5 text-slate-400" />
                                <span>{project.department?.name || 'Department Vault'}</span>
                            </div>
                            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                                <FileCode className="h-3.5 w-3.5 text-slate-400" />
                                <span>{project.files?.length || 0} Files</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                                Project Overview
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#0c1638] p-4 rounded-2xl border border-slate-100 dark:border-[#17275c]">
                                {project.description || 'No detailed description provided for this project.'}
                            </p>
                        </div>

                        {/* Live links */}
                        {(project.liveUrl || project.githubUrl) && (
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                                    Project Deployments & Links
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {project.liveUrl && (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/50 hover:bg-blue-100/70 dark:hover:bg-blue-900/40 transition-all group"
                                        >
                                            <div className="flex items-center space-x-2.5 truncate">
                                                <Globe className="h-4 w-4 text-blue-600 dark:text-sky-400 shrink-0" />
                                                <span className="text-xs font-bold text-blue-900 dark:text-sky-200 truncate">
                                                    Live Preview
                                                </span>
                                            </div>
                                            <ExternalLink className="h-4 w-4 text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                                        </a>
                                    )}
                                    {project.githubUrl && (
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-all group"
                                        >
                                            <div className="flex items-center space-x-2.5 truncate">
                                                <Code className="h-4 w-4 text-slate-700 dark:text-slate-300 shrink-0" />
                                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                                                    GitHub Repository
                                                </span>
                                            </div>
                                            <ExternalLink className="h-4 w-4 text-slate-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Files list */}
                        {project.files && project.files.length > 0 && (
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                                    Files in Repository ({project.files.length})
                                </h4>
                                <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                                    {project.files.map((file, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#0c1638] border border-slate-100 dark:border-[#17275c] text-xs"
                                        >
                                            <div className="flex items-center space-x-2 truncate">
                                                <FileCode className="h-4 w-4 text-blue-500 shrink-0" />
                                                <span className="font-medium text-slate-700 dark:text-slate-200 truncate">
                                                    {file.name || file.relativePath || `File ${i + 1}`}
                                                </span>
                                            </div>
                                            {file.size && (
                                                <span className="text-[10px] text-slate-400 font-semibold shrink-0 ml-2">
                                                    {(file.size / 1024).toFixed(1)} KB
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 sm:p-6 bg-slate-50 dark:bg-[#070d22] border-t border-slate-200/80 dark:border-[#192b68] flex items-center justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

// --- Main Component ---
const MyProjects = ({ defaultOpenUpload = false }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all'); // all, live, github, files
    const [sortBy, setSortBy] = useState('newest'); // newest, oldest, az, files
    const [viewMode, setViewMode] = useState('grid'); // grid, list
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [detailsProject, setDetailsProject] = useState(null);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [droppedFiles, setDroppedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const location = useLocation();
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (location.state?.openUpload) {
            setShowProjectModal(true);
        }
    }, [location.state]);

    useEffect(() => {
        if (defaultOpenUpload) {
            setEditingProject(null);
            setShowProjectModal(true);
        }
    }, [defaultOpenUpload]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/projects/my');
            setProjects(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const executeDeleteProject = async () => {
        if (!projectToDelete) return;
        try {
            await api.delete(`/projects/${projectToDelete._id}`);
            setProjectToDelete(null);
            fetchProjects();
        } catch (err) {
            alert('Delete failed. Please try again.');
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // Filter & Sort pipeline
    const filteredProjects = useMemo(() => {
        let result = projects.filter((p) => {
            const matchesSearch =
                p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.department?.name?.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            if (activeFilter === 'live') return Boolean(p.liveUrl);
            if (activeFilter === 'github') return Boolean(p.githubUrl);
            if (activeFilter === 'files') return Boolean(p.files && p.files.length > 0);

            return true;
        });

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortBy === 'az') return (a.title || '').localeCompare(b.title || '');
            if (sortBy === 'files') return (b.files?.length || 0) - (a.files?.length || 0);
            return 0;
        });

        return result;
    }, [projects, searchTerm, activeFilter, sortBy]);

    // Total file count across all projects
    const totalFilesCount = useMemo(() => {
        return projects.reduce((acc, p) => acc + (p.files?.length || 0), 0);
    }, [projects]);

    const liveProjectsCount = useMemo(() => {
        return projects.filter((p) => Boolean(p.liveUrl)).length;
    }, [projects]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        setIsDragging(false);

        const items = e.dataTransfer.items;
        const filesArray = [];

        if (items) {
            const scanFiles = async (entry) => {
                if (entry.isFile) {
                    const file = await new Promise((resolve) => entry.file(resolve));
                    filesArray.push(file);
                } else if (entry.isDirectory) {
                    const reader = entry.createReader();
                    const entries = await new Promise((resolve) => {
                        reader.readEntries(resolve);
                    });
                    for (const subEntry of entries) {
                        await scanFiles(subEntry);
                    }
                }
            };

            for (let i = 0; i < items.length; i++) {
                const item = items[i].webkitGetAsEntry();
                if (item) {
                    await scanFiles(item);
                }
            }
        } else {
            filesArray.push(...Array.from(e.dataTransfer.files));
        }

        if (filesArray.length > 0) {
            setDroppedFiles(filesArray);
            setShowProjectModal(true);
        }
    };

    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setDroppedFiles(Array.from(e.target.files));
            setShowProjectModal(true);
        }
    };

    return (
        <div
            className="space-y-8 relative min-h-[82vh] pb-24"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Global Drag-and-drop Cyber Hologram Overlay */}
            <AnimatePresence>
                {isDragging && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="fixed inset-0 z-[120] bg-blue-900/30 backdrop-blur-xl border-4 border-dashed border-blue-500 m-6 rounded-[3rem] flex items-center justify-center pointer-events-none shadow-2xl shadow-blue-500/20"
                    >
                        <div className="bg-white/95 dark:bg-[#070e28]/95 p-10 sm:p-14 rounded-[2.5rem] shadow-2xl text-center space-y-4 border border-blue-200 dark:border-blue-700/60 max-w-md">
                            <div className="h-24 w-24 bg-gradient-to-tr from-blue-600 to-sky-400 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30 animate-bounce">
                                <Upload className="h-12 w-12 text-white" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                Drop to Initialize Vault
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                                Release your project folders or files to instantly launch the deployment wizard.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hidden native input for manual trigger */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileInputChange}
            />

            {/* 🌟 Section 1: Hero Header & Quick Actions */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-white via-sky-50/50 to-blue-50/30 dark:from-[#08112d] dark:via-[#09153b] dark:to-[#0a1844] p-8 sm:p-10 border border-sky-100 dark:border-[#14235a] shadow-xl shadow-sky-900/5 transition-all">
                {/* Ambient glow in background */}
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-500/10 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                        {/* Pill badge */}
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800/60 text-blue-700 dark:text-sky-300 text-xs font-bold tracking-wide">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>ENTERPRISE WORKSPACE & VAULT</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            {defaultOpenUpload ? 'Office Upload Workspace' : 'Project Vault'}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base font-medium leading-relaxed">
                            {defaultOpenUpload
                                ? 'Upload, version, and manage enterprise file structures across all departments.'
                                : 'Access, manage, and deploy your complete repository portfolio and live builds.'}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center space-x-2 px-5 py-3.5 rounded-2xl bg-white dark:bg-[#0c1842] border border-sky-200/80 dark:border-[#1b2f73] text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-sky-300 hover:border-blue-300 text-xs font-bold transition-all shadow-sm hover:shadow cursor-pointer active:scale-95"
                        >
                            <Upload className="h-4 w-4" />
                            <span>Quick Drop</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setEditingProject(null);
                                setShowProjectModal(true);
                            }}
                            className="flex items-center space-x-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                        >
                            <Plus className="h-4 w-4 stroke-[3]" />
                            <span>New Project</span>
                        </button>
                    </div>
                </div>

                {/* 📊 Stat Metric Counters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-sky-100 dark:border-[#14235a]/80">
                    <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#070e28]/70 border border-sky-100 dark:border-[#142456] backdrop-blur-xs">
                        <div className="flex items-center justify-between text-slate-400 mb-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider">Total Vault</span>
                            <Folder className="h-4 w-4 text-blue-600 dark:text-sky-400" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                            {projects.length}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">Active projects</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#070e28]/70 border border-sky-100 dark:border-[#142456] backdrop-blur-xs">
                        <div className="flex items-center justify-between text-slate-400 mb-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider">Stored Files</span>
                            <FileCode className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                            {totalFilesCount}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">Artifacts & assets</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#070e28]/70 border border-sky-100 dark:border-[#142456] backdrop-blur-xs">
                        <div className="flex items-center justify-between text-slate-400 mb-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider">Live Builds</span>
                            <Globe className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                            {liveProjectsCount}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">Accessible online</span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#070e28]/70 border border-sky-100 dark:border-[#142456] backdrop-blur-xs">
                        <div className="flex items-center justify-between text-slate-400 mb-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider">Security</span>
                            <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                            100%
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">Encrypted & sync'd</span>
                    </div>
                </div>
            </div>

            {/* 🔍 Section 2: Interactive Filter, Search & View Controls */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white/80 dark:bg-[#08112d]/80 backdrop-blur-md p-3.5 rounded-2xl border border-sky-100 dark:border-[#14235a] shadow-xs">
                {/* Search Bar with Clear Icon */}
                <div className="relative flex-1 min-w-[260px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search project title, department, tech..."
                        className="w-full bg-[#f1f6fc] dark:bg-[#0a153a] border border-sky-100 dark:border-[#162763] pl-11 pr-10 py-2.5 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {/* Filter Pills */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 select-none">
                    <button
                        type="button"
                        onClick={() => setActiveFilter('all')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeFilter === 'all'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0e1d52]'
                        }`}
                    >
                        All ({projects.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveFilter('live')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeFilter === 'live'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0e1d52]'
                        }`}
                    >
                        Live Demo
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveFilter('github')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeFilter === 'github'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0e1d52]'
                        }`}
                    >
                        Git Repos
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveFilter('files')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeFilter === 'files'
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0e1d52]'
                        }`}
                    >
                        With Files
                    </button>
                </div>

                {/* Sort & Grid/List View Toggles */}
                <div className="flex items-center space-x-2 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100 dark:border-slate-800">
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-[#f1f6fc] dark:bg-[#0a153a] border border-sky-100 dark:border-[#162763] text-xs font-bold text-slate-700 dark:text-slate-200 py-2 pl-3 pr-8 rounded-xl focus:outline-none cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="az">Alphabetical A-Z</option>
                            <option value="files">Most Files</option>
                        </select>
                    </div>

                    <div className="flex items-center p-1 rounded-xl bg-[#f1f6fc] dark:bg-[#0a153a] border border-sky-100 dark:border-[#162763]">
                        <button
                            type="button"
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                viewMode === 'grid'
                                    ? 'bg-white dark:bg-[#14235a] text-blue-600 dark:text-sky-300 shadow-xs'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
                            }`}
                            title="Grid View"
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                viewMode === 'list'
                                    ? 'bg-white dark:bg-[#14235a] text-blue-600 dark:text-sky-300 shadow-xs'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
                            }`}
                            title="List View"
                        >
                            <List className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 📦 Section 3: Projects Display (Grid or List or Beautiful Empty State) */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-28 space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                        Synchronizing Vault Records...
                    </p>
                </div>
            ) : filteredProjects.length === 0 ? (
                /* ✨ Redesigned, High-End Empty State */
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-white/90 via-sky-50/40 to-white dark:from-[#08112d] dark:via-[#070f2b] dark:to-[#08112d] border-2 border-dashed border-sky-200 dark:border-[#1b2d69] p-12 sm:p-20 text-center shadow-xl shadow-sky-950/5"
                >
                    {/* Background subtle glowing radial circles */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-lg mx-auto space-y-6">
                        {/* Glowing icon badge */}
                        <div className="relative inline-flex items-center justify-center">
                            <div className="absolute inset-0 rounded-3xl bg-blue-500/20 blur-xl animate-pulse" />
                            <div className="relative h-24 w-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-xl shadow-blue-600/30">
                                <FolderOpen className="h-11 w-11 text-white" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                {searchTerm ? 'No Matching Projects Found' : 'Your Project Vault is Ready'}
                            </h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                {searchTerm
                                    ? `No projects found matching "${searchTerm}". Try resetting filters or search query.`
                                    : 'There are no projects in your vault yet. Drop code repositories, ZIP archives, or assets to deploy your first project.'}
                            </p>
                        </div>

                        {/* Interactive Buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                            {searchTerm ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setActiveFilter('all');
                                    }}
                                    className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                                >
                                    Reset Filters
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingProject(null);
                                            setShowProjectModal(true);
                                        }}
                                        className="flex items-center space-x-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white text-xs font-black uppercase tracking-wider shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                    >
                                        <Plus className="h-4 w-4 stroke-[3]" />
                                        <span>Create First Project</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-[#0c1842] border border-sky-200 dark:border-[#1b2f73] text-slate-700 dark:text-slate-200 hover:border-blue-400 text-xs font-bold shadow-sm transition-all cursor-pointer"
                                    >
                                        <Upload className="h-4 w-4 text-blue-600 dark:text-sky-400" />
                                        <span>Browse Files</span>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* File Format Support Pills */}
                        <div className="pt-6 border-t border-sky-100 dark:border-[#132152] flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-slate-400">
                            <span className="text-slate-500 dark:text-slate-400">Supported formats:</span>
                            <span className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-[#0c1840] border border-sky-100 dark:border-[#162763] text-sky-700 dark:text-sky-300">
                                Folder / Directory
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-[#0c1840] border border-sky-100 dark:border-[#162763] text-sky-700 dark:text-sky-300">
                                .ZIP Archives
                            </span>
                            <span className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-[#0c1840] border border-sky-100 dark:border-[#162763] text-sky-700 dark:text-sky-300">
                                Web & Git Repos
                            </span>
                        </div>
                    </div>
                </motion.div>
            ) : viewMode === 'grid' ? (
                /* 🔲 Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                            onClick={() => setDetailsProject(project)}
                            className="group relative flex flex-col rounded-[2rem] bg-white dark:bg-[#08112d] border border-sky-100 dark:border-[#14235a] hover:border-blue-300 dark:hover:border-blue-600/70 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 cursor-pointer"
                        >
                            {/* Card Media Preview */}
                            <div className="relative h-44 w-full bg-gradient-to-tr from-slate-100 to-sky-50 dark:from-[#091438] dark:to-[#0d1e56] overflow-hidden">
                                {project.thumbnail ? (
                                    <img
                                        src={`${BASE_URL}/uploads/${encodeURIComponent(project.thumbnail)}`}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            if (!e.target.dataset.tried) {
                                                e.target.dataset.tried = 'true';
                                                e.target.src = e.target.src.replace('localhost', '127.0.0.1');
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-slate-700">
                                        <Folder className="h-16 w-16 stroke-1 group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                                {/* Top Floating Badges */}
                                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/40 text-white backdrop-blur-md border border-white/20">
                                        ID: {project._id.slice(-6)}
                                    </span>
                                </div>

                                {/* Bottom Department Pill on Media */}
                                <div className="absolute bottom-3 left-3.5">
                                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 dark:bg-[#070e28]/90 text-slate-800 dark:text-white backdrop-blur-md shadow-xs">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                        <span>{project.department?.name || 'Workspace'}</span>
                                    </span>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                                        {project.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed">
                                        {project.description || 'Enterprise repository deployment ready for development and staging.'}
                                    </p>
                                </div>

                                {/* Meta details */}
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        {project.liveUrl && (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400 hover:bg-blue-100 transition-colors"
                                                title="Open Live Preview"
                                            >
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </a>
                                        )}
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                                                title="Open GitHub"
                                            >
                                                <Code className="h-3.5 w-3.5" />
                                            </a>
                                        )}
                                        <div className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-sky-50 dark:bg-blue-950/30 text-sky-700 dark:text-sky-300 text-[10px] font-bold">
                                            <FileCode className="h-3 w-3" />
                                            <span>{project.files?.length || 0} Files</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingProject(project);
                                                setShowProjectModal(true);
                                            }}
                                            className="text-slate-500 hover:text-blue-600 dark:hover:text-sky-300 font-semibold flex items-center space-x-1 transition-colors cursor-pointer text-xs"
                                            title="Edit Project"
                                        >
                                            <Edit className="h-3.5 w-3.5" />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setProjectToDelete(project)}
                                            className="text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 font-semibold flex items-center space-x-1 transition-colors cursor-pointer text-xs"
                                            title="Delete Project"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            <span>Delete</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDetailsProject(project)}
                                            className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 dark:text-sky-400 hover:underline cursor-pointer"
                                        >
                                            <span>Details</span>
                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                /* 📋 List View */
                <div className="space-y-3">
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            onClick={() => setDetailsProject(project)}
                            className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#08112d] border border-sky-100 dark:border-[#14235a] hover:border-blue-300 dark:hover:border-blue-600/70 shadow-xs hover:shadow-md transition-all gap-4 cursor-pointer"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white shrink-0 shadow-sm">
                                    <Folder className="h-6 w-6" />
                                </div>
                                <div className="space-y-1 truncate max-w-md">
                                    <div className="flex items-center space-x-2">
                                        <h4 className="text-base font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-sky-400">
                                            {project.title}
                                        </h4>
                                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase">
                                            {project.department?.name || 'Workspace'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 truncate">
                                        {project.description || 'No description provided'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end space-x-4 shrink-0">
                                <div className="text-right hidden md:block">
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                                        {project.files?.length || 0} Files
                                    </span>
                                    <span className="text-[10px] text-slate-400 block">
                                        {new Date(project.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                    {project.liveUrl && (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-sky-400 hover:bg-blue-100 transition-colors"
                                            title="Live URL"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    )}
                                    {project.githubUrl && (
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
                                            title="GitHub"
                                        >
                                            <Code className="h-3.5 w-3.5" />
                                        </a>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingProject(project);
                                            setShowProjectModal(true);
                                        }}
                                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
                                        title="Edit Project"
                                    >
                                        <Edit className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setProjectToDelete(project)}
                                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                                        title="Delete Project"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Project Upload / Edit Modal Engine */}
            <ProjectEngine
                isOpen={showProjectModal}
                initialFiles={droppedFiles}
                project={editingProject}
                onClose={() => {
                    setShowProjectModal(false);
                    setEditingProject(null);
                    setDroppedFiles([]);
                }}
                onSuccess={fetchProjects}
            />

            {/* Project Details Modal */}
            <ProjectDetailsModal
                project={detailsProject}
                isOpen={Boolean(detailsProject)}
                onClose={() => setDetailsProject(null)}
            />

            {/* Common Confirm Delete Modal */}
            <ConfirmDeleteModal
                isOpen={Boolean(projectToDelete)}
                onClose={() => setProjectToDelete(null)}
                onConfirm={executeDeleteProject}
                title="Delete Project?"
                itemName={projectToDelete?.title}
                message="Are you sure you want to delete this project? All associated uploaded files and data will be permanently removed."
                confirmText="Delete Project"
            />
        </div>
    );
};

export default MyProjects;
