import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowUpRight,
    Briefcase,
    Building2,
    CheckCircle2,
    Code,
    FileText,
    FolderKanban,
    FolderOpen,
    GitBranch,
    Loader2,
    Layers3,
    Link2,
    Palette,
    Plus,
    Upload,
    TrendingUp,
    Users
} from 'lucide-react';
import api from '../api';

const Office = () => {
    const navigate = useNavigate();
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
        const baseDepts = [
            { name: 'developers', description: 'all developer team' },
            { name: 'Digital Marketing', description: 'Digital Marketing Team' },
            { name: 'Graphic Designing', description: 'Creative UI/UX & Graphic Design Team' }
        ];

        // Merge incoming departments with baseDepts to ensure all 3 exist
        const allDepts = [...departments];
        baseDepts.forEach((base) => {
            const found = allDepts.some(
                (d) => d.name?.toLowerCase() === base.name.toLowerCase()
            );
            if (!found) {
                allDepts.push({
                    _id: `temp-${base.name.toLowerCase().replace(/\s+/g, '-')}`,
                    ...base
                });
            }
        });

        const mapped = allDepts.map((department) => {
            const deptIdStr = department._id?.toString();
            const deptNameLower = (department.name || '').toLowerCase();

            const departmentEmployees = employees.filter((employee) => {
                const empDeptId = (employee.department?._id || employee.department)?.toString();
                const empDeptName = (employee.department?.name || '').toLowerCase();
                return (deptIdStr && empDeptId === deptIdStr) || (empDeptName && empDeptName === deptNameLower);
            });

            const empIdsInDept = new Set(departmentEmployees.map((e) => e._id?.toString()));

            const departmentProjects = projects.filter((project) => {
                const projDeptId = (project.department?._id || project.department)?.toString();
                const projDeptName = (project.department?.name || '').toLowerCase();
                const projEmpId = (project.employee?._id || project.employee)?.toString();

                const matchesDeptDirect = (deptIdStr && projDeptId === deptIdStr) || (projDeptName && projDeptName === deptNameLower);
                const matchesEmpInDept = Boolean(projEmpId && empIdsInDept.has(projEmpId));

                return matchesDeptDirect || matchesEmpInDept;
            });

            const lower = department.name?.toLowerCase() || '';
            let icon = Briefcase;
            let gradient = 'from-[#1e3a8a] to-[#2563eb]';
            let shadow = 'shadow-blue-600/25';
            let sortOrder = 4;

            if (lower.includes('dev')) {
                icon = Code;
                gradient = 'from-blue-600 to-indigo-600';
                shadow = 'shadow-blue-600/25';
                sortOrder = 1;
            } else if (lower.includes('market') || lower.includes('digital')) {
                icon = TrendingUp;
                gradient = 'from-sky-500 to-blue-600';
                shadow = 'shadow-sky-500/25';
                sortOrder = 2;
            } else if (lower.includes('graphic') || lower.includes('design')) {
                icon = Palette;
                gradient = 'from-violet-600 to-purple-600';
                shadow = 'shadow-violet-600/25';
                sortOrder = 3;
            }

            return {
                ...department,
                employees: departmentEmployees,
                projects: departmentProjects,
                icon,
                gradient,
                shadow,
                sortOrder
            };
        });

        return mapped.sort((a, b) => a.sortOrder - b.sortOrder);
    }, [departments, employees, projects]);

    const officeStats = useMemo(() => {
        const activeDepartments = departmentMap.filter(
            (department) => department.projects.length > 0 || department.employees.length > 0
        ).length;

        return [
            {
                name: 'Office Departments',
                value: departmentMap.length,
                subtext: 'Operational Units',
                icon: Building2,
                iconStyle: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
                badgeText: 'Operational',
                badgeStyle: 'bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-900/50',
                hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-700/60',
                onClick: () => navigate('/admin/departments')
            },
            {
                name: 'Reporting Managers',
                value: departmentMap.length,
                subtext: 'Supervisory Leads',
                icon: Layers3,
                iconStyle: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
                badgeText: 'Hierarchy Synced',
                badgeStyle: 'bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-900/50',
                hoverBorder: 'hover:border-indigo-300 dark:hover:border-indigo-700/60'
            },
            {
                name: 'Active Development Units',
                value: activeDepartments,
                subtext: 'In Production',
                icon: GitBranch,
                iconStyle: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
                badgeText: '100% Active Work',
                badgeStyle: 'bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900/50',
                hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700/60',
                onClick: () => navigate('/admin/projects')
            },
            {
                name: 'Employee Directory',
                value: employees.length,
                subtext: 'Assigned Employees',
                icon: Users,
                iconStyle: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
                badgeText: 'Full Capacity',
                badgeStyle: 'bg-amber-50/80 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-900/50',
                hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-700/60',
                onClick: () => navigate('/admin/employees')
            }
        ];
    }, [departments.length, departmentMap, employees.length, navigate]);

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

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {officeStats.map((stat, index) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={stat.onClick ? { y: -4 } : { y: -2 }}
                        transition={{ delay: index * 0.05, duration: 0.25, ease: "easeOut" }}
                        onClick={stat.onClick}
                        className={`group relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md ${stat.hoverBorder} transition-all duration-200 select-none ${stat.onClick ? 'cursor-pointer hover:shadow-lg' : ''
                            }`}
                    >
                        {/* Top Row: Icon + Status Tag / Action */}
                        <div className="flex items-center justify-between">
                            <div className={`w-11 h-11 rounded-xl ${stat.iconStyle} flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}>
                                <stat.icon className="h-5 w-5" />
                            </div>

                            <div className="flex items-center gap-1.5">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${stat.badgeStyle}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                                    {stat.badgeText}
                                </span>
                                {stat.onClick && (
                                    <span className="p-1 rounded-lg text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 opacity-60 group-hover:opacity-100 transition-all">
                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Metric Counter */}
                        <div className="mt-4">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                {stat.value}
                            </span>
                        </div>

                        {/* Title & Subtext */}
                        <div className="mt-1">
                            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
                                {stat.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {stat.subtext}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Department Hierarchy - 3 Vertical Cards Side-by-Side */}
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

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {departmentMap.map((department, index) => (
                        <motion.div
                            key={department._id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -6 }}
                            transition={{ delay: index * 0.08, duration: 0.3 }}
                            onClick={() => {
                                const targetId = department._id.startsWith('temp-') ? '' : department._id;
                                navigate(`/admin/projects?dept=${targetId}&deptName=${encodeURIComponent(department.name)}`);
                            }}
                            className="group relative overflow-hidden rounded-[26px] border border-sky-100/90 dark:border-[#172b66] p-6 bg-white dark:bg-[#070e28] shadow-lg shadow-sky-950/5 dark:shadow-black/40 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300/80 dark:hover:border-blue-500/60 transition-all duration-300 flex flex-col justify-between cursor-pointer select-none"
                        >
                            {/* Card Content Top */}
                            <div>
                                {/* Header: Icon + Status Tag */}
                                <div className="flex items-center justify-between">
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${department.gradient} text-white shadow-md ${department.shadow} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105`}>
                                        <department.icon className="h-6 w-6 text-white drop-shadow-xs" />
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border shadow-2xs ${department.projects.length > 0
                                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60'
                                            : 'bg-sky-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 border-sky-200/80 dark:border-[#14235a]'
                                        }`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                        <span>{department.projects.length > 0 ? 'Active' : 'Stable'}</span>
                                    </span>
                                </div>

                                {/* Title & Description */}
                                <div className="mt-4">
                                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{department.name}</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                        {department.description || 'Department structure is configured and available for new work.'}
                                    </p>
                                </div>

                                {/* Metric Counters */}
                                <div className="grid grid-cols-2 gap-3 mt-5">
                                    <div className="rounded-2xl bg-[#f8fbfe] dark:bg-[#0a1438] p-3 text-center border border-sky-100/80 dark:border-[#14235a] shadow-2xs">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Employees</p>
                                        <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{department.employees.length}</p>
                                    </div>
                                    <div className="rounded-2xl bg-[#f8fbfe] dark:bg-[#0a1438] p-3 text-center border border-sky-100/80 dark:border-[#14235a] shadow-2xs">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Projects</p>
                                        <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{department.projects.length}</p>
                                    </div>
                                </div>

                                {/* Team Members */}
                                <div className="mt-5 rounded-2xl border border-sky-100/80 dark:border-[#14235a] p-4 bg-[#f8fbfe]/70 dark:bg-[#0a1438]/50 shadow-2xs">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Team Members</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {department.employees.length > 0 ? (
                                            department.employees.map((employee) => (
                                                <span
                                                    key={employee._id}
                                                    className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white dark:bg-[#070e28] text-blue-700 dark:text-sky-300 border border-sky-200/80 dark:border-[#14235a] shadow-2xs"
                                                >
                                                    @{employee.username}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-slate-400">No employees assigned yet.</span>
                                        )}
                                    </div>
                                </div>

                                {/* Development Scope */}
                                <div className="mt-4 rounded-2xl border border-sky-100/80 dark:border-[#14235a] p-4 bg-[#f8fbfe]/70 dark:bg-[#0a1438]/50 shadow-2xs">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Development Scope</p>
                                    <div className="space-y-2">
                                        {department.projects.length > 0 ? (
                                            department.projects.slice(0, 2).map((project) => (
                                                <div key={project._id} className="rounded-xl border border-sky-100 dark:border-[#14235a] p-2.5 bg-white dark:bg-[#070e28] shadow-2xs">
                                                    <div className="flex items-center justify-between gap-2 text-xs">
                                                        <span className="text-slate-800 dark:text-slate-200 truncate font-semibold">{project.title}</span>
                                                        <span className="text-[10px] text-slate-400 shrink-0">by @{project.employee?.username || 'team'}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-xs text-slate-400">No development items linked yet.</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Card Action Footer */}
                            <div className="mt-5 pt-4 border-t border-sky-100/70 dark:border-[#14235a]/70 flex items-center justify-between">
                                <span className="text-xs font-bold text-blue-600 dark:text-sky-400 group-hover:underline flex items-center gap-1.5">
                                    <span>View Projects</span>
                                    <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </span>
                                <span className="px-2.5 py-1 rounded-xl text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 border border-blue-200/50 dark:border-blue-800/40">
                                    + Add Project
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {departmentMap.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-10 text-center mt-6">
                        <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">No office structure yet</h3>
                        <p className="text-slate-500 mt-2">Add departments and employees to start building the office view.</p>
                    </div>
                )}
            </div>

            {/* Bottom 2 Columns: Flow & Recent Projects */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                        {project.files && project.files.length > 0 && (
                                            <span className="font-semibold text-blue-600">
                                                {project.files.length} {project.files.length === 1 ? 'file' : 'files'}
                                            </span>
                                        )}
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
    );
};

export default Office;
