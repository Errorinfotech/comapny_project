import { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { BASE_URL } from '../api';
import {
    Plus,
    Folder,
    ArrowLeft,
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
import ProjectDetailsModal from '../components/ProjectDetailsModal';
import { ConfirmDeleteModal } from '../components/ui';

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
    const navigate = useNavigate();
    const { user } = useAuth();
    const fileInputRef = useRef(null);

    const handleBack = () => {
        // 1. If explicit return state was provided
        if (location.state?.from) {
            navigate(location.state.from);
            return;
        }

        // 2. Check previously visited in-app route recorded in sessionStorage
        const prevRoute = sessionStorage.getItem('prev_route');
        if (prevRoute && prevRoute !== location.pathname && !prevRoute.includes('/login')) {
            navigate(prevRoute);
            return;
        }

        // 3. Check document.referrer if it's from our own origin
        if (document.referrer && document.referrer.includes(window.location.host)) {
            try {
                const refUrl = new URL(document.referrer);
                if (refUrl.pathname && refUrl.pathname !== location.pathname && !refUrl.pathname.includes('/login')) {
                    navigate(refUrl.pathname + refUrl.search);
                    return;
                }
            } catch {
                // Ignore parse error
            }
        }

        // 4. Check last active portal
        const lastPortal = sessionStorage.getItem('last_active_portal');
        if (lastPortal && lastPortal !== location.pathname) {
            navigate(lastPortal);
            return;
        }

        // 5. If browser history state has in-app steps
        if (window.history.state && typeof window.history.state.idx === 'number' && window.history.state.idx > 0) {
            navigate(-1);
            return;
        }

        // 6. Direct fallback according to role
        if (user?.role === 'admin') {
            navigate('/admin/office');
        } else {
            navigate('/client-portal');
        }
    };

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

            {/* 🌟 Clean Brand Header & Actions in Error Infotech Luxury Theme */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#CBDCF8] dark:border-[#14235a]/80">
                <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <h1 
                            className="text-3xl sm:text-4xl font-black text-[#0f1d40] dark:text-white tracking-tight leading-tight"
                            style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                            {user?.username ? `${user.username.charAt(0).toUpperCase() + user.username.slice(1)}'s Workspace` : 'My Workspace'}
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDF6FF] dark:bg-[#0e1d52] text-[#1E3A8A] dark:text-sky-300 border border-[#CBDCF8] dark:border-[#1c3380]">
                            {projects.length} {projects.length === 1 ? 'Uploaded Project' : 'Uploaded Projects'}
                        </span>
                    </div>
                    <p 
                        className="text-[#5A6D87] dark:text-slate-400 text-xs sm:text-sm font-medium leading-relaxed"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        {defaultOpenUpload
                            ? 'Upload, version, and manage enterprise file structures across all departments.'
                            : `Your personal repository vault (@${user?.username || 'user'}). Access and manage only your uploaded builds and projects.`}
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 sm:pt-2">
                    <button
                        type="button"
                        onClick={() => {
                            setEditingProject(null);
                            setShowProjectModal(true);
                        }}
                        className="flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#193278] hover:to-[#1d4ed8] text-white text-xs font-bold transition-all shadow-md shadow-blue-900/15 hover:shadow-lg hover:shadow-blue-900/25 active:scale-95 cursor-pointer"
                    >
                        <Plus className="h-4 w-4 stroke-[3]" />
                        <span>New Project</span>
                    </button>
                </div>
            </div>

            {/* 🔍 Section 2: Interactive Filter, Search & View Controls */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white/95 dark:bg-[#070e28]/95 backdrop-blur-xl p-2.5 sm:p-3 rounded-2xl border border-[#CBDCF8] dark:border-[#14235a] shadow-xs">
                {/* Search Bar with Clear Icon */}
                <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search project title, department, tech..."
                        className="w-full bg-[#F4F8FD] dark:bg-[#0a153a] border border-[#CBDCF8]/70 dark:border-[#162763] pl-10 pr-9 py-2 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
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
                <div className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0 select-none">
                    <button
                        type="button"
                        onClick={() => setActiveFilter('all')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeFilter === 'all'
                                ? 'bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:text-[#1E3A8A] dark:hover:text-white hover:bg-[#EDF6FF] dark:hover:bg-[#101f56]/60'
                        }`}
                    >
                        All ({projects.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveFilter('live')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeFilter === 'live'
                                ? 'bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:text-[#1E3A8A] dark:hover:text-white hover:bg-[#EDF6FF] dark:hover:bg-[#101f56]/60'
                        }`}
                    >
                        Live Demo
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveFilter('github')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeFilter === 'github'
                                ? 'bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:text-[#1E3A8A] dark:hover:text-white hover:bg-[#EDF6FF] dark:hover:bg-[#101f56]/60'
                        }`}
                    >
                        Git Repos
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveFilter('files')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            activeFilter === 'files'
                                ? 'bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-300 hover:text-[#1E3A8A] dark:hover:text-white hover:bg-[#EDF6FF] dark:hover:bg-[#101f56]/60'
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
                            className="bg-[#F4F8FD] dark:bg-[#0a153a] border border-[#CBDCF8]/70 dark:border-[#162763] text-xs font-bold text-slate-700 dark:text-slate-200 py-1.5 pl-3 pr-8 rounded-xl focus:outline-none cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="az">Alphabetical A-Z</option>
                            <option value="files">Most Files</option>
                        </select>
                    </div>

                    <div className="flex items-center p-1 rounded-xl bg-[#F4F8FD] dark:bg-[#0a153a] border border-[#CBDCF8]/70 dark:border-[#162763]">
                        <button
                            type="button"
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                viewMode === 'grid'
                                    ? 'bg-white dark:bg-[#14235a] text-[#1E3A8A] dark:text-sky-300 shadow-xs'
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
                                    ? 'bg-white dark:bg-[#14235a] text-[#1E3A8A] dark:text-sky-300 shadow-xs'
                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
                            }`}
                            title="List View"
                        >
                            <List className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 📦 Section 3: Projects Display (Grid or List or Clean Empty State) */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-3">
                    <div className="w-10 h-10 border-3 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-bold text-slate-400 tracking-wider uppercase">
                        Loading Vault Projects...
                    </p>
                </div>
            ) : filteredProjects.length === 0 ? (
                /* ✨ Clean, Minimal Brand Empty State */
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-[2rem] bg-white/95 dark:bg-[#08112d]/95 border border-[#CBDCF8] dark:border-[#14235a] p-12 sm:p-16 text-center shadow-xs"
                >
                    <div className="relative z-10 max-w-md mx-auto space-y-4">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[#1E3A8A] to-[#2563EB] flex items-center justify-center mx-auto text-white shadow-md shadow-blue-900/15">
                            <FolderOpen className="h-8 w-8 stroke-[1.8]" />
                        </div>

                        <div className="space-y-1.5">
                            <h3 
                                className="text-xl sm:text-2xl font-bold text-[#0f1d40] dark:text-white tracking-tight"
                                style={{ fontFamily: "'Outfit', sans-serif" }}
                            >
                                {searchTerm ? 'No Matching Projects' : `No Projects Uploaded by @${user?.username || 'You'} Yet`}
                            </h3>
                            <p 
                                className="text-xs sm:text-sm text-[#5A6D87] dark:text-slate-400 font-medium leading-relaxed"
                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                            >
                                {searchTerm
                                    ? `No projects found matching "${searchTerm}". Try resetting filters or search query.`
                                    : `You haven't uploaded any projects yet. Click "+ New Project" or drag & drop files to start building your portfolio.`}
                            </p>
                        </div>

                        <div className="pt-2 flex items-center justify-center gap-3">
                            {searchTerm ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setActiveFilter('all');
                                    }}
                                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                                >
                                    Reset Filters
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingProject(null);
                                        setShowProjectModal(true);
                                    }}
                                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#193278] hover:to-[#1d4ed8] text-white text-xs font-bold shadow-md shadow-blue-900/15 transition-all cursor-pointer"
                                >
                                    <Plus className="h-4 w-4 stroke-[3]" />
                                    <span>Create Project</span>
                                </button>
                            )}
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
