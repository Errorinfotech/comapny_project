import React, { useState, useEffect } from 'react';
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
    Layers
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Card, Badge, Button, Input } from '@/components/ui';

const AdminProjects = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const employeeId = searchParams.get('employeeId');
    const deptId = searchParams.get('dept');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAllProjects = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (employeeId) queryParams.append('employeeId', employeeId);
            if (deptId) queryParams.append('dept', deptId);
            
            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
            const { data } = await api.get(`/admin/projects${queryString}`);
            setProjects(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllProjects();
    }, [employeeId, deptId]);

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.employee?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.department?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
                <div>
                    <div className="flex items-center space-x-2.5">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            All Company Projects
                        </h1>
                        <Badge variant="primary" size="sm">{filteredProjects.length} Projects</Badge>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {employeeId || deptId
                            ? 'Filtered portfolio view for selected criteria.'
                            : 'Oversee and audit all development work across the organization.'}
                    </p>
                </div>

                {(employeeId || deptId) && (
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSearchParams({})}
                        icon={X}
                    >
                        Clear Filters
                    </Button>
                )}
            </div>

            {/* Search Filter */}
            <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by title, author (@employee) or department..."
                    className="w-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                        <Card className="p-0 overflow-hidden flex flex-col justify-between h-full group" hover={true}>
                            {/* Card Media Preview (if thumbnail exists) */}
                            {project.thumbnail ? (
                                <div className="h-36 w-full relative overflow-hidden bg-slate-950">
                                    <img
                                        src={`${BASE_URL}/uploads/${encodeURIComponent(project.thumbnail)}`}
                                        alt={project.title}
                                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                                        onError={(e) => {
                                            if (e.target.src.includes('localhost')) {
                                                e.target.src = e.target.src.replace('localhost', '127.0.0.1');
                                            }
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/20" />
                                    <div className="absolute top-3 right-3">
                                        <Badge variant="default" size="sm" className="bg-black/60 text-white border-white/20 backdrop-blur-md">
                                            ID: {project._id.slice(-5)}
                                        </Badge>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-20 w-full bg-gradient-to-tr from-blue-600/10 via-cyan-500/10 to-transparent p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
                                    <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-600">
                                        <FolderOpen className="h-5 w-5" />
                                    </div>
                                    <Badge variant="default" size="sm">
                                        ID: {project._id.slice(-5)}
                                    </Badge>
                                </div>
                            )}

                            {/* Card Content */}
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                        {project.title}
                                    </h3>

                                    {/* Author & Dept meta */}
                                    <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">
                                        <div className="flex items-center space-x-1">
                                            <User className="h-3.5 w-3.5 text-blue-600" />
                                            <span>@{project.employee?.username || 'member'}</span>
                                        </div>
                                        <span>•</span>
                                        <div className="flex items-center space-x-1">
                                            <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                                            <span>{project.department?.name || 'Global'}</span>
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                                        {project.description || 'Enterprise project repository and asset storage.'}
                                    </p>
                                </div>

                                {/* External Links & Files */}
                                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        {project.liveUrl && (
                                            <a
                                                href={project.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                title="View Live Demo"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        )}
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                title="View GitHub Repository"
                                            >
                                                <Code className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>

                                    <Badge variant="cyan" size="sm">
                                        <FileText className="h-3 w-3 mr-1" />
                                        {project.files?.length || 0} Files
                                    </Badge>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="px-5 py-2.5 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                                <div className="flex items-center space-x-1.5">
                                    <Calendar className="h-3 w-3" />
                                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                                <span className="text-blue-600 font-semibold group-hover:underline">
                                    View Vault
                                </span>
                            </div>
                        </Card>
                    </motion.div>
                ))}

                {filteredProjects.length === 0 && (
                    <div className="col-span-full py-16 text-center glass-card rounded-2xl">
                        <Folder className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-600 dark:text-slate-400">No Projects Found</h3>
                        <p className="text-xs text-slate-400 mt-1">Try clearing filters or search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProjects;
