import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    Briefcase,
    Building2,
    CheckCircle2,
    FileText,
    FolderKanban,
    FolderOpen,
    GitBranch,
    Loader2,
    Layers3,
    Link2,
    Plus,
    Upload,
    TrendingUp,
    Users
} from 'lucide-react';
import api from '../api';

const Office = () => {
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateMenu, setShowCreateMenu] = useState(false);
    const [quickMode, setQuickMode] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [quickTitle, setQuickTitle] = useState('');
    const [quickDescription, setQuickDescription] = useState('');
    const [liveUrl, setLiveUrl] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const folderInputRef = useRef(null);

    const fetchOfficeData = async () => {
        try {
            const { data } = await api.get('/office/overview');
            setDepartments(data.departments || []);
            setEmployees(data.employees || []);
            setProjects(data.projects || []);
        } catch (error) {
            console.error('Error fetching office overview:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOfficeData();
    }, []);

    const resetQuickCreate = () => {
        setQuickMode('');
        setSelectedFiles([]);
        setQuickTitle('');
        setQuickDescription('');
        setLiveUrl('');
        setGithubUrl('');
    };

    const submitQuickCreate = async () => {
        if (!quickTitle.trim()) {
            alert('Please enter a title first.');
            return;
        }

        if (quickMode === 'links' && !liveUrl.trim() && !githubUrl.trim()) {
            alert('Please enter at least one link.');
            return;
        }

        if ((quickMode === 'files' || quickMode === 'folder') && selectedFiles.length === 0) {
            alert(`Please select ${quickMode === 'folder' ? 'a folder' : 'files'} first.`);
            return;
        }

        setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('scope', 'office');
            formData.append('title', quickTitle);
            formData.append('description', quickDescription);
            formData.append('liveUrl', liveUrl);
            formData.append('githubUrl', githubUrl);

            selectedFiles.forEach((file) => formData.append('files', file));

            await api.post('/projects', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            resetQuickCreate();
            fetchOfficeData();
        } catch (error) {
            alert(error.response?.data?.message || 'Upload failed');
        } finally {
            setSubmitting(false);
        }
    };

    const departmentMap = useMemo(() => {
        return departments.map((department) => {
            const departmentEmployees = employees.filter(
                (employee) => employee.department?._id === department._id
            );
            const departmentProjects = projects.filter(
                (project) => project.department?._id === department._id
            );

            return {
                ...department,
                employees: departmentEmployees,
                projects: departmentProjects
            };
        });
    }, [departments, employees, projects]);

    const officeStats = useMemo(() => {
        const activeDepartments = departmentMap.filter(
            (department) => department.projects.length > 0 || department.employees.length > 0
        ).length;

        return [
            {
                name: 'Office Departments',
                value: departments.length,
                subtext: 'Operational Units',
                icon: Building2,
                cardBg: 'bg-gradient-to-br from-white via-[#fff4f4] to-[#ffebeb] dark:from-[#1c0d10] dark:via-[#261217] dark:to-[#0a0507] border-[#ffd5d5] dark:border-[#52202a]',
                iconBg: 'bg-[#FF6B6B] shadow-md shadow-[#FF6B6B]/30 text-white',
                badgeText: 'Operational',
                badgeStyle: 'bg-[#fff0f0] dark:bg-[#33141a]/80 text-[#e04848] dark:text-[#ff9999] border-[#ffc2c2] dark:border-[#5c242f]',
                glowColor: 'bg-[#FF6B6B]',
                hoverBorder: 'hover:border-[#FF6B6B]/70 dark:hover:border-[#FF6B6B]/60',
                hoverShadow: 'hover:shadow-xl hover:shadow-[#FF6B6B]/15'
            },
            {
                name: 'Reporting Managers',
                value: departmentMap.length,
                subtext: 'Supervisory Leads',
                icon: Layers3,
                cardBg: 'bg-gradient-to-br from-white via-[#fffdf2] to-[#fff8e3] dark:from-[#1c1708] dark:via-[#261f0a] dark:to-[#0a0802] border-[#ffe8a8] dark:border-[#524114]',
                iconBg: 'bg-[#FFD166] shadow-md shadow-[#FFD166]/35 text-white',
                badgeText: 'Hierarchy Synced',
                badgeStyle: 'bg-[#fff9e6] dark:bg-[#33280c]/80 text-[#b58000] dark:text-[#ffe082] border-[#ffdf85] dark:border-[#5c4714]',
                glowColor: 'bg-[#FFD166]',
                hoverBorder: 'hover:border-[#FFD166]/80 dark:hover:border-[#FFD166]/60',
                hoverShadow: 'hover:shadow-xl hover:shadow-[#FFD166]/15'
            },
            {
                name: 'Active Development Units',
                value: activeDepartments,
                subtext: 'In Production',
                icon: GitBranch,
                cardBg: 'bg-gradient-to-br from-white via-[#f0fdf9] to-[#e4faf3] dark:from-[#061c16] dark:via-[#09261e] dark:to-[#030d0a] border-[#b5f2e1] dark:border-[#134d3c]',
                iconBg: 'bg-[#06D6A0] shadow-md shadow-[#06D6A0]/30 text-white',
                badgeText: '100% Active Work',
                badgeStyle: 'bg-[#e8fbf5] dark:bg-[#0c362a]/80 text-[#048764] dark:text-[#5cebc7] border-[#a1ebd6] dark:border-[#175c47]',
                glowColor: 'bg-[#06D6A0]',
                hoverBorder: 'hover:border-[#06D6A0]/80 dark:hover:border-[#06D6A0]/60',
                hoverShadow: 'hover:shadow-xl hover:shadow-[#06D6A0]/15'
            },
            {
                name: 'Office Workforce',
                value: employees.length,
                subtext: 'Assigned Employees',
                icon: Users,
                cardBg: 'bg-gradient-to-br from-white via-[#f0f8fb] to-[#e4f2f7] dark:from-[#071620] dark:via-[#0a202e] dark:to-[#03090d] border-[#b8dfec] dark:border-[#123e54]',
                iconBg: 'bg-[#118AB2] shadow-md shadow-[#118AB2]/30 text-white',
                badgeText: 'Full Capacity',
                badgeStyle: 'bg-[#e6f4f8] dark:bg-[#0e2c3d]/80 text-[#0b5f7b] dark:text-[#6ec8e6] border-[#a5d6e6] dark:border-[#1a516e]',
                glowColor: 'bg-[#118AB2]',
                hoverBorder: 'hover:border-[#118AB2]/80 dark:hover:border-[#118AB2]/60',
                hoverShadow: 'hover:shadow-xl hover:shadow-[#118AB2]/15'
            }
        ];
    }, [departments.length, departmentMap, employees.length]);

    const recentProjects = useMemo(() => {
        return [...projects]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);
    }, [projects]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-700 border-t-transparent"></div>
                <p className="text-slate-500 font-medium">Loading office structure...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Office Structure</h1>
                    <p className="text-slate-500 mt-2">
                        One view for your complete office setup, teams, and development delivery.
                    </p>
                </div>
                <div className="relative">
                    <button
                        onClick={() => setShowCreateMenu((current) => !current)}
                        className="inline-flex items-center justify-center space-x-2 bg-gradient-to-b from-[#32509a] to-[#233c74] hover:from-[#3859aa] hover:to-[#264180] text-white px-5 py-3 rounded-2xl transition-all shadow-md shadow-[#233c74]/30 cursor-pointer"
                    >
                        <Plus className="h-5 w-5" />
                        <span className="font-bold">New</span>
                    </button>

                    {showCreateMenu && (
                        <div className="absolute right-0 top-full mt-3 w-72 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-3 z-20">
                            <button
                                onClick={() => {
                                    setShowCreateMenu(false);
                                    setQuickMode('folder');
                                    setSelectedFiles([]);
                                    folderInputRef.current?.click();
                                }}
                                className="w-full flex items-start space-x-3 rounded-xl p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all"
                            >
                                <FolderOpen className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">Folder</p>
                                    <p className="text-sm text-slate-500">Upload a complete project folder structure.</p>
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    setShowCreateMenu(false);
                                    setQuickMode('files');
                                    setSelectedFiles([]);
                                    fileInputRef.current?.click();
                                }}
                                className="w-full flex items-start space-x-3 rounded-xl p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all"
                            >
                                <FileText className="h-5 w-5 text-blue-500 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">File</p>
                                    <p className="text-sm text-slate-500">Upload selected files for office work.</p>
                                </div>
                            </button>
                            <button
                                onClick={() => {
                                    setShowCreateMenu(false);
                                    setQuickMode('links');
                                    setSelectedFiles([]);
                                }}
                                className="w-full flex items-start space-x-3 rounded-xl p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all"
                            >
                                <Link2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white">Links</p>
                                    <p className="text-sm text-slate-500">Type live and repository links in input fields.</p>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                        setSelectedFiles(files);
                        setQuickMode('files');
                        if (!quickTitle) {
                            const name = files[0].name.split('.')[0].replace(/[-_]/g, ' ');
                            setQuickTitle(name.charAt(0).toUpperCase() + name.slice(1));
                        }
                    }
                }}
            />

            <input
                ref={folderInputRef}
                type="file"
                multiple
                webkitdirectory="true"
                directory="true"
                className="hidden"
                onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) {
                        setSelectedFiles(files);
                        setQuickMode('folder');
                        if (!quickTitle) {
                            const rootFolder = files[0].webkitRelativePath?.split('/')[0] || 'Office Folder';
                            setQuickTitle(rootFolder);
                        }
                    }
                }}
            />

            {quickMode && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 space-y-5 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                {quickMode === 'links' ? 'Add Office Links' : `Upload Office ${quickMode === 'folder' ? 'Folder' : 'Files'}`}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {quickMode === 'links'
                                    ? 'Type links directly in the input fields below.'
                                    : `Selected ${selectedFiles.length} item${selectedFiles.length === 1 ? '' : 's'} for upload.`}
                            </p>
                        </div>
                        <button
                            onClick={resetQuickCreate}
                            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        >
                            Close
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Title</label>
                            <input
                                type="text"
                                value={quickTitle}
                                onChange={(e) => setQuickTitle(e.target.value)}
                                placeholder="Enter office work title"
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Description</label>
                            <input
                                type="text"
                                value={quickDescription}
                                onChange={(e) => setQuickDescription(e.target.value)}
                                placeholder="Short description"
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {quickMode === 'links' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Live Deployment Link</label>
                                <input
                                    type="url"
                                    value={liveUrl}
                                    onChange={(e) => setLiveUrl(e.target.value)}
                                    placeholder="https://preview.app"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Repository Link</label>
                                <input
                                    type="url"
                                    value={githubUrl}
                                    onChange={(e) => setGithubUrl(e.target.value)}
                                    placeholder="GitHub / GitLab Link"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800 p-5 bg-slate-50/70 dark:bg-slate-950/30">
                            <div className="flex items-center gap-3 mb-3">
                                <Upload className="h-5 w-5 text-blue-600" />
                                <p className="font-semibold text-slate-900 dark:text-white">
                                    {quickMode === 'folder' ? 'Folder Ready' : 'Files Ready'}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedFiles.slice(0, 8).map((file, index) => (
                                    <span
                                        key={`${file.name}-${index}`}
                                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                                    >
                                        {file.name}
                                    </span>
                                ))}
                                {selectedFiles.length > 8 && (
                                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-sky-100 dark:bg-blue-950/30 text-blue-700 dark:text-sky-300">
                                        +{selectedFiles.length - 8} more
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3">
                        <button
                            onClick={submitQuickCreate}
                            disabled={submitting}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-700 text-white font-bold hover:bg-blue-600 transition-all disabled:opacity-50"
                        >
                            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                            <span>{submitting ? 'Saving...' : 'Submit'}</span>
                        </button>
                        {(quickMode === 'files' || quickMode === 'folder') && (
                            <button
                                onClick={() => {
                                    if (quickMode === 'folder') {
                                        folderInputRef.current?.click();
                                    } else {
                                        fileInputRef.current?.click();
                                    }
                                }}
                                className="px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            >
                                Choose Again
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
                {officeStats.map((stat, index) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -6, scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        transition={{ delay: index * 0.08, duration: 0.35, ease: "easeOut" }}
                        className={`group relative overflow-hidden rounded-[26px] p-6 border ${stat.cardBg} ${stat.hoverBorder} ${stat.hoverShadow} shadow-xs backdrop-blur-xl transition-all duration-300 cursor-pointer select-none`}
                    >
                        {/* Soft Ambient Radial Corner Glow on Hover */}
                        <div
                            className={`pointer-events-none absolute -right-6 -top-6 w-28 h-28 rounded-full blur-2xl opacity-15 group-hover:opacity-40 transition-opacity duration-300 ${stat.glowColor}`}
                        />

                        {/* Top Row: Vibrant Solid Circular Icon + Status Tag + Animated Chevron */}
                        <div className="relative z-10 flex items-center justify-between">
                            {/* Solid Vibrant Circular Icon matching reference design */}
                            <div className={`w-12 h-12 rounded-full ${stat.iconBg} flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110`}>
                                <stat.icon className="h-6 w-6 drop-shadow-sm" />
                            </div>

                            {/* Status Tag */}
                            <span className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold border shadow-2xs ${stat.badgeStyle}`}>
                                {stat.badgeText}
                            </span>
                        </div>

                        {/* Metric Counter */}
                        <div className="relative z-10 mt-4 flex items-baseline">
                            <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                {stat.value}
                            </span>
                        </div>

                        {/* Title & Subtext */}
                        <div className="relative z-10 mt-1">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                                {stat.name}
                            </h3>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                {stat.subtext}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.4fr,0.9fr] gap-6">
                <div className="bg-white/90 dark:bg-[#070e28]/90 backdrop-blur-xl p-7 rounded-3xl shadow-lg shadow-sky-950/5 border border-sky-100/90 dark:border-[#14235a]">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Department Hierarchy</h2>
                            <p className="text-sm text-slate-500 mt-1">Each office unit and its current development ownership.</p>
                        </div>
                        <div className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-sky-50 dark:bg-blue-950/40 text-blue-700 dark:text-sky-300 border border-sky-200/60 dark:border-[#14235a] shadow-2xs">
                            {departmentMap.length} units
                        </div>
                    </div>

                    <div className="space-y-4">
                        {departmentMap.map((department, index) => (
                            <motion.div
                                key={department._id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -4 }}
                                transition={{ delay: index * 0.06, duration: 0.3 }}
                                className="group relative overflow-hidden rounded-[26px] border border-sky-100/90 dark:border-[#172b66] p-5 sm:p-6 bg-white dark:bg-[#070e28] shadow-lg shadow-sky-950/5 dark:shadow-black/40 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300/80 dark:hover:border-blue-500/60 transition-all duration-300 select-none"
                            >
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-center space-x-3.5">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1e3a8a] to-[#2563eb] text-white shadow-md shadow-blue-600/25 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
                                            <Briefcase className="h-6 w-6 text-white drop-shadow-xs" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">{department.name}</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                                                {department.description || 'Department structure is configured and available for new work.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2.5 text-center min-w-full md:min-w-[290px]">
                                        <div className="rounded-2xl bg-[#f8fbfe] dark:bg-[#0a1438] px-3 py-2.5 border border-sky-100/80 dark:border-[#14235a] shadow-2xs">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Employees</p>
                                            <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{department.employees.length}</p>
                                        </div>
                                        <div className="rounded-2xl bg-[#f8fbfe] dark:bg-[#0a1438] px-3 py-2.5 border border-sky-100/80 dark:border-[#14235a] shadow-2xs">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Projects</p>
                                            <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{department.projects.length}</p>
                                        </div>
                                        <div className="rounded-2xl bg-[#f8fbfe] dark:bg-[#0a1438] px-3 py-2.5 border border-sky-100/80 dark:border-[#14235a] shadow-2xs flex flex-col justify-center items-center">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status</p>
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs mt-0.5 ${
                                                department.projects.length > 0 
                                                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60'
                                                    : 'bg-sky-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 border-sky-200/80 dark:border-[#14235a]'
                                            }`}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                                <span>{department.projects.length > 0 ? 'Active' : 'Stable'}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                                    <div className="rounded-2xl border border-sky-100/80 dark:border-[#14235a] p-4 bg-[#f8fbfe]/70 dark:bg-[#0a1438]/50 shadow-2xs">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">Team Members</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {department.employees.length > 0 ? (
                                                department.employees.map((employee) => (
                                                    <span
                                                        key={employee._id}
                                                        className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-[#070e28] text-blue-700 dark:text-sky-300 border border-sky-200/80 dark:border-[#14235a] shadow-2xs"
                                                    >
                                                        @{employee.username}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-slate-400">No employees assigned yet.</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-sky-100/80 dark:border-[#14235a] p-4 bg-[#f8fbfe]/70 dark:bg-[#0a1438]/50 shadow-2xs">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">Development Scope</p>
                                        <div className="space-y-2">
                                            {department.projects.length > 0 ? (
                                                department.projects.slice(0, 3).map((project) => (
                                                    <div key={project._id} className="rounded-xl border border-sky-100 dark:border-[#14235a] p-3 bg-white dark:bg-[#070e28] shadow-2xs hover:border-sky-300 transition-colors">
                                                        <div className="flex items-center justify-between gap-3 text-sm">
                                                            <span className="text-slate-800 dark:text-slate-200 truncate pr-3 font-semibold text-xs">{project.title}</span>
                                                            <span className="text-[11px] text-slate-400">by @{project.employee?.username || 'team'}</span>
                                                        </div>
                                                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                                                            {project.liveUrl && (
                                                                <a
                                                                    href={project.liveUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-sky-400"
                                                                >
                                                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                                                    <span>Live Link</span>
                                                                </a>
                                                            )}
                                                            <span className="text-[11px] text-slate-400">{project.files?.length || 0} files</span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <span className="text-xs text-slate-400">No development items linked yet.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {departmentMap.length === 0 && (
                            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-10 text-center">
                                <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">No office structure yet</h3>
                                <p className="text-slate-500 mt-2">Add departments and employees to start building the office view.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white/90 dark:bg-[#070e28]/90 backdrop-blur-xl p-7 rounded-3xl shadow-lg shadow-sky-950/5 border border-sky-100/90 dark:border-[#14235a]">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Office Development Flow</h2>
                        <div className="space-y-3">
                            <div className="rounded-2xl p-4 bg-sky-50/50 dark:bg-slate-950/40 border border-sky-100/70 dark:border-slate-800/80">
                                <p className="text-xs uppercase tracking-wider text-sky-700 dark:text-sky-400 font-bold mb-1">Step 1</p>
                                <p className="font-semibold text-slate-900 dark:text-white">Department setup</p>
                                <p className="text-sm text-slate-500 mt-1">Create units for design, development, HR, operations, or any office wing.</p>
                            </div>
                            <div className="rounded-2xl p-4 bg-sky-50/50 dark:bg-slate-950/40 border border-sky-100/70 dark:border-slate-800/80">
                                <p className="text-xs uppercase tracking-wider text-sky-700 dark:text-sky-400 font-bold mb-1">Step 2</p>
                                <p className="font-semibold text-slate-900 dark:text-white">Employee allocation</p>
                                <p className="text-sm text-slate-500 mt-1">Assign employees into each department so the office hierarchy becomes visible.</p>
                            </div>
                            <div className="rounded-2xl p-4 bg-sky-50/50 dark:bg-slate-950/40 border border-sky-100/70 dark:border-slate-800/80">
                                <p className="text-xs uppercase tracking-wider text-sky-700 dark:text-sky-400 font-bold mb-1">Step 3</p>
                                <p className="font-semibold text-slate-900 dark:text-white">Development tracking</p>
                                <p className="text-sm text-slate-500 mt-1">Every uploaded project automatically reflects the work done for the office.</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/90 dark:bg-[#070e28]/90 backdrop-blur-xl p-7 rounded-3xl shadow-lg shadow-sky-950/5 border border-sky-100/90 dark:border-[#14235a]">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Development</h2>
                            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-sky-400">
                                <FolderKanban className="h-5 w-5" />
                            </div>
                        </div>

                        <div className="space-y-3">
                            {recentProjects.length > 0 ? (
                                recentProjects.map((project) => (
                                    <div
                                        key={project._id}
                                        className="rounded-xl border border-slate-200 dark:border-slate-800 p-4"
                                    >
                                        <p className="font-semibold text-slate-900 dark:text-white truncate">{project.title}</p>
                                        <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                                            {project.description || 'No project description added yet.'}
                                        </p>
                                        <div className="mt-2 flex items-center justify-between text-xs text-slate-500 gap-4">
                                            <span>{project.department?.name || 'General Office'}</span>
                                            <span>@{project.employee?.username || 'team'}</span>
                                        </div>
                                        <div className="mt-3 flex items-center gap-3 flex-wrap text-xs">
                                            <span className="font-semibold text-blue-600">{project.files?.length || 0} files</span>
                                            {project.liveUrl && (
                                                <a
                                                    href={project.liveUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center space-x-1 text-emerald-500 hover:text-emerald-400 font-semibold"
                                                >
                                                    <ArrowUpRight className="h-3.5 w-3.5" />
                                                    <span>Open Link</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center text-slate-500">
                                    No development updates available yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Office;
