import React, { useState, useEffect, useRef } from 'react';
import api, { BASE_URL } from '../api';
import {
    Folder,
    ExternalLink,
    Code,
    FileText,
    Calendar,
    Search,
    User,
    Briefcase,
    X,
    FolderOpen,
    Layers,
    Plus,
    ArrowLeft,
    ArrowRight,
    Edit,
    Trash2,
    MoreVertical,
    FileCode,
    Globe,
    ArrowUpRight,
    Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Badge, Button, ConfirmDeleteModal } from '@/components/ui';
import ProjectEngine from '../components/ProjectEngine';
import './CurtainCard.css';

// --- Sub-Component: Project Details Modal (View Only) ---
const AdminProjectDetailsModal = ({ project, isOpen, onClose }) => {
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
                    <div className="relative h-48 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 overflow-hidden shrink-0">
                        {project.thumbnail ? (
                            <img
                                src={`${BASE_URL}/uploads/${encodeURIComponent(project.thumbnail)}`}
                                alt={project.title}
                                className="w-full h-full object-cover opacity-85"
                                onError={(e) => {
                                    if (!e.target.dataset.tried) {
                                        e.target.dataset.tried = 'true';
                                        e.target.src = e.target.src.replace('localhost', '127.0.0.1');
                                    }
                                }}
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center opacity-20">
                                <Folder className="w-36 h-36 text-white" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#08102a] via-[#08102a]/40 to-transparent" />

                        {/* Top Close Button */}
                        <div className="absolute top-4 right-4 flex items-center space-x-2">
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 backdrop-blur-sm transition-all cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Title overlay */}
                        <div className="absolute bottom-4 left-6 right-6">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-md border border-white/30 inline-block mb-1.5">
                                ID: {project._id.slice(-6)}
                            </span>
                            <h2 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
                                {project.title}
                            </h2>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">
                        {/* Meta info strip */}
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-blue-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-blue-900/40 font-semibold">
                                <User className="h-3.5 w-3.5" />
                                <span>@{project.employee?.username || 'member'}</span>
                            </div>
                            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                                <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                                <span>{project.department?.name || 'Global'}</span>
                            </div>
                            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                                <FileCode className="h-3.5 w-3.5 text-slate-400" />
                                <span>{project.files?.length || 0} Files</span>
                            </div>
                            {project.showOnClientPortal ? (
                                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>Client Portal ({project.clientCategory || 'General'})</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold">
                                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                                    <span>Internal Workspace</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                                Project Overview
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#0c1638] p-4 rounded-2xl border border-slate-100 dark:border-[#17275c]">
                                {project.description || 'Enterprise project repository and asset storage.'}
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

                    {/* Footer Actions - View Only */}
                    <div className="p-4 sm:p-6 bg-slate-50 dark:bg-[#070d22] border-t border-slate-200/80 dark:border-[#192b68] flex items-center justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition-colors cursor-pointer"
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
const AdminProjects = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const employeeId = searchParams.get('employeeId');
    const employeeName = searchParams.get('employeeName') || '';
    const deptId = searchParams.get('dept');
    const deptName = searchParams.get('deptName') || '';
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [portalFilter, setPortalFilter] = useState('all'); // 'all' | 'portal' | 'internal'
    const [togglingId, setTogglingId] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [detailsProject, setDetailsProject] = useState(null);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [openCardId, setOpenCardId] = useState(null);

    const FALLBACK_GRADIENTS = [
        'radial-gradient(circle at 50% 35%, #555566, #181920 70%)',
        'linear-gradient(160deg, #0b1730, #05070d)',
        'linear-gradient(160deg, #2a1f2d, #0c0a10)',
        'linear-gradient(160deg, #10281f, #06100c)',
        'linear-gradient(160deg, #271418, #0a0406)',
        'linear-gradient(160deg, #1f1b2e, #08060d)'
    ];

    const fetchAllProjects = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (employeeId) queryParams.append('employeeId', employeeId);
            if (deptId) queryParams.append('dept', deptId);
            if (deptName) queryParams.append('deptName', deptName);

            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
            const { data } = await api.get(`/admin/projects${queryString}`);
            setProjects(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching admin projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleClientPortal = async (projectId) => {
        try {
            setTogglingId(projectId);
            const { data } = await api.patch(`/projects/${projectId}/toggle-portal`);
            setProjects(prev => prev.map(p => p._id === projectId ? {
                ...p,
                showOnClientPortal: data.showOnClientPortal,
                clientCategory: data.clientCategory
            } : p));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update Client Portal status.');
        } finally {
            setTogglingId(null);
        }
    };

    const executeDeleteProject = async () => {
        if (!projectToDelete) return;
        try {
            await api.delete(`/projects/${projectToDelete._id}`);
            setProjectToDelete(null);
            fetchAllProjects();
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed. Please try again.');
        }
    };

    useEffect(() => {
        fetchAllProjects();
    }, [employeeId, deptId, deptName]);

    const filteredProjects = projects.filter(p => {
        const matchesSearch =
            p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.employee?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.department?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        if (portalFilter === 'portal') return Boolean(p.showOnClientPortal);
        if (portalFilter === 'internal') return !p.showOnClientPortal;
        return true;
    });

    const portalCount = projects.filter(p => p.showOnClientPortal).length;
    const internalCount = projects.filter(p => !p.showOnClientPortal).length;

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse max-w-7xl mx-auto">
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-64" />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
                <div>
                    <div className="flex items-center gap-2.5 mb-2">
                        <button
                            onClick={() => navigate('/admin/office')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Back to Office</span>
                        </button>
                        {deptName && (
                            <Badge variant="cyan" size="sm">
                                {deptName}
                            </Badge>
                        )}
                        {employeeName && (
                            <Badge variant="cyan" size="sm">
                                @{employeeName}
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center space-x-2.5">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            {deptName ? `${deptName} Projects` : employeeName ? `@${employeeName}'s Projects` : 'All Company Projects'}
                        </h1>
                        <Badge variant="primary" size="sm">{filteredProjects.length} Projects</Badge>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {deptName
                            ? `Manage and upload development work for the ${deptName} team.`
                            : employeeName
                                ? `Filtered portfolio and repository view for @${employeeName}.`
                                : employeeId
                                    ? 'Filtered portfolio view for selected employee.'
                                    : 'Oversee, edit, and audit all development work across the organization.'}
                    </p>
                </div>

                <div className="flex items-center gap-2.5">
                    {(employeeId || deptId || deptName || employeeName) && (
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSearchParams({})}
                            icon={X}
                        >
                            Clear Filters
                        </Button>
                    )}
                    <Button
                        onClick={() => {
                            setEditingProject(null);
                            setShowUploadModal(true);
                        }}
                        icon={Plus}
                    >
                        Add Project
                    </Button>
                </div>
            </div>

            {/* Search Filter & Segment Tabs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by title, author (@employee) or department..."
                        className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Filter Tabs: All / Client Portal / Internal */}
                <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold shrink-0 self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => setPortalFilter('all')}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${portalFilter === 'all'
                                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-sky-400 shadow-xs'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                    >
                        All ({projects.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setPortalFilter('portal')}
                        className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${portalFilter === 'portal'
                                ? 'bg-emerald-500 text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Client Portal ({portalCount})</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setPortalFilter('internal')}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${portalFilter === 'internal'
                                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                            }`}
                    >
                        Internal ({internalCount})
                    </button>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProjects.map((project, index) => (
                    <motion.div
                        key={project._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                    >
                        <article
                            className={`curtain-card ${openCardId === project._id ? 'open' : ''}`}
                            onClick={() => {
                                if (window.innerWidth <= 768) {
                                    setOpenCardId((prev) => (prev === project._id ? null : project._id));
                                } else {
                                    setDetailsProject(project);
                                }
                            }}
                        >
                            {/* Card: thumbnail = whole card. Real image / fallback gradient */}
                            <div
                                className="curtain-bg"
                                style={{
                                    background: FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]
                                }}
                            >
                                {project.thumbnail ? (
                                    <img
                                        src={`${BASE_URL}/uploads/${encodeURIComponent(project.thumbnail)}`}
                                        alt={project.title}
                                        className="curtain-img"
                                        onError={(e) => {
                                            if (!e.target.dataset.tried) {
                                                e.target.dataset.tried = 'true';
                                                e.target.src = e.target.src.replace('localhost', '127.0.0.1');
                                            } else {
                                                e.target.style.display = 'none';
                                                const ph = e.target.parentElement?.querySelector('.curtain-ph');
                                                if (ph) ph.style.display = 'grid';
                                            }
                                        }}
                                    />
                                ) : null}

                                {/* Top Right: 1-Click Client Portal Toggle */}
                                <div className="absolute top-3 right-3 z-10 pointer-events-none">
                                    <button
                                        type="button"
                                        disabled={togglingId === project._id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleClientPortal(project._id);
                                        }}
                                        className={`pointer-events-auto px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide backdrop-blur-md border transition-all flex items-center gap-1.5 shadow-lg cursor-pointer ${project.showOnClientPortal
                                                ? 'bg-emerald-500/90 text-white border-emerald-400/50 hover:bg-emerald-600 shadow-emerald-500/20'
                                                : 'bg-black/60 text-slate-300 border-white/20 hover:bg-black/80 hover:text-white'
                                            } ${togglingId === project._id ? 'opacity-50 animate-pulse' : ''}`}
                                        title={
                                            project.showOnClientPortal
                                                ? 'Visible on Client Portal showcase! Click to make private.'
                                                : 'Internal only. Click to publish on Client Portal!'
                                        }
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${project.showOnClientPortal ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
                                        <span>{project.showOnClientPortal ? 'On Portal' : 'Private'}</span>
                                        {project.showOnClientPortal && project.clientCategory && (
                                            <span className="opacity-80 font-mono text-[9px] uppercase">
                                                [{project.clientCategory}]
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Card Info Bottom Curtain */}
                            <div className="curtain-info">
                                <h3 className="curtain-title">{project.title}</h3>
                                <div className="curtain-meta">
                                    @{project.employee?.username || 'member'} · {project.department?.name || 'developers'}
                                </div>

                                <div className="curtain-more">
                                    <div className="curtain-in">
                                        <p className="curtain-desc">
                                            {project.description || 'Designed and developed a professional business solution to establish high quality digital presence.'}
                                        </p>

                                        <div className="curtain-foot">
                                            <div className="flex items-center gap-2">
                                                {project.liveUrl ? (
                                                    <a
                                                        href={project.liveUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="inline-flex items-center gap-1 text-white/90 hover:text-white hover:underline cursor-pointer"
                                                        title="Open Live Preview"
                                                    >
                                                        <span>Preview</span>
                                                        <ExternalLink className="w-3.5 h-3.5 inline opacity-80" />
                                                    </a>
                                                ) : (
                                                    <span
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDetailsProject(project);
                                                        }}
                                                        className="inline-flex items-center gap-1 text-white/90 hover:text-white hover:underline cursor-pointer"
                                                        title="Preview Details"
                                                    >
                                                        <span>Preview</span>
                                                    </span>
                                                )}
                                            </div>
                                            <span className="curtain-files">{project.files?.length || 0} Files</span>
                                        </div>

                                        <div className="curtain-act">
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingProject(project);
                                                    setShowUploadModal(true);
                                                }}
                                                title="Edit Project"
                                            >
                                                ✎ Edit
                                            </span>
                                            <span
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setProjectToDelete(project);
                                                }}
                                                title="Delete Project"
                                            >
                                                🗑 Delete
                                            </span>
                                            <span
                                                className="curtain-act-details inline-flex items-center gap-1"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDetailsProject(project);
                                                }}
                                            >
                                                <span>Details</span>
                                                <ArrowRight className="w-3.5 h-3.5 inline stroke-[2.5]" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </motion.div>
                ))}

                {filteredProjects.length === 0 && (
                    <div className="col-span-full py-16 text-center glass-card rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8">
                        <Folder className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Projects Found</h3>
                        <p className="text-xs text-slate-400 mt-1 mb-5">
                            {deptName ? `No projects uploaded for ${deptName} yet.` : 'Try clearing filters or search terms.'}
                        </p>
                        <Button
                            onClick={() => {
                                setEditingProject(null);
                                setShowUploadModal(true);
                            }}
                            icon={Plus}
                        >
                            Add First Project
                        </Button>
                    </div>
                )}
            </div>

            {/* Project Upload & Edit Engine */}
            <ProjectEngine
                isOpen={showUploadModal}
                project={editingProject}
                onClose={() => {
                    setShowUploadModal(false);
                    setEditingProject(null);
                }}
                onSuccess={fetchAllProjects}
                initialEmployeeId={employeeId}
                departmentId={deptId}
                departmentName={deptName}
            />

            {/* Admin Project Details Modal (View Only) */}
            <AdminProjectDetailsModal
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
                message="Are you sure you want to delete this project? All associated repository files, assets, and project deployments will be permanently deleted."
                confirmText="Delete Project"
            />
        </div>
    );
};

export default AdminProjects;
