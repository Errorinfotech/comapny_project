import { useState, useEffect } from 'react';
import api, { BASE_URL } from '../api';
import {
    Folder,
    ExternalLink,
    Code,
    FileText,
    Calendar,
    Search,
    User,
    Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

const AdminProjects = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const employeeId = searchParams.get('employeeId');
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAllProjects = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/admin/projects${employeeId ? `?employeeId=${employeeId}` : ''}`);
            setProjects(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllProjects();
    }, [employeeId]);

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.employee?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.department?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="text-slate-500 font-medium">Loading projects...</p>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">All Company Projects</h1>
                    <p className="text-slate-500 mt-2">
                        {employeeId ? `Showing projects for selected employee.` : 'Oversee all development work across the organization.'}
                    </p>
                </div>
                {employeeId && (
                    <button
                        onClick={() => setSearchParams({})}
                        className="text-sm font-bold text-indigo-600 hover:text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl transition-all"
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            <div className="flex items-center space-x-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search projects, employees, or departments..."
                        className="w-full bg-transparent border-none pl-12 pr-4 py-2 focus:ring-0 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProjects.map((project, index) => (
                    <motion.div
                        key={project._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden group hover:shadow-2xl transition-all relative"
                    >
                        {project.thumbnail && (
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={`${BASE_URL}/uploads/${encodeURIComponent(project.thumbnail)}`}
                                    alt=""
                                    className="h-full w-full object-cover opacity-80"
                                    onError={(e) => {
                                        console.error('Admin Thumbnail failed to load:', e.target.src);
                                        if (e.target.src.includes('localhost')) {
                                            e.target.src = e.target.src.replace('localhost', '127.0.0.1');
                                        }
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/20 to-transparent dark:from-slate-900/60 dark:via-slate-900/20 dark:to-transparent" />
                            </div>
                        )}
                        <div className="p-5 relative z-10">
                            <div className="flex justify-between items-start mb-3">
                                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 transition-colors">
                                    <Folder className="h-8 w-8" />
                                </div>
                                <div className="text-right">
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500">
                                        Project ID: {project._id.slice(-6)}
                                    </span>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold mb-1 truncate">{project.title}</h3>

                            <div className="flex items-center space-x-4 mb-3 text-xs text-slate-500">
                                <div className="flex items-center space-x-1">
                                    <User className="h-3 w-3" />
                                    <span className="font-medium">@{project.employee?.username}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Briefcase className="h-3 w-3" />
                                    <span>{project.department?.name || 'Global'}</span>
                                </div>
                            </div>

                            <p className="text-sm text-slate-400 line-clamp-2 mb-4 h-10">
                                {project.description || 'No description provided.'}
                            </p>

                            <div className="flex items-center space-x-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                                {project.liveUrl && (
                                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:text-indigo-500 transition-all">
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                )}
                                {project.githubUrl && (
                                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:text-indigo-500 transition-all">
                                        <Code className="h-4 w-4" />
                                    </a>
                                )}
                                <div className="flex-1"></div>
                                <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-500">
                                    <FileText className="h-4 w-4" />
                                    <span>{project.files?.length || 0} ITEMS</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-2.5 flex items-center justify-between">
                            <div className="flex items-center space-x-1.5 text-[10px] font-bold text-slate-400 uppercase">
                                <Calendar className="h-3 w-3" />
                                <span>Uploaded {new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                            <button className="text-[10px] font-bold text-indigo-500 uppercase hover:underline">
                                Details
                            </button>
                        </div>
                    </motion.div>
                ))}

                {filteredProjects.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
                        <Folder className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-slate-400">No Projects Found</h3>
                        <p className="text-slate-500 mt-2">Adjust your filters or wait for employees to upload work.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminProjects;
