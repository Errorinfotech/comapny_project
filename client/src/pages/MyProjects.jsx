import { useState, useEffect, useRef } from 'react';
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
    Edit
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectEngine from '../components/ProjectEngine';

// --- Sub-Components (Defined before main component to avoid ReferenceError) ---

const ProjectMenu = ({ onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
                <MoreVertical className="h-5 w-5" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-[50]"
                    >
                        <button
                            onClick={() => { onEdit(); setIsOpen(false); }}
                            className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-all group"
                        >
                            <Edit className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                            <span className="text-slate-700 dark:text-slate-300">Edit Project</span>
                        </button>
                        <button
                            onClick={() => { onDelete(); setIsOpen(false); }}
                            className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium text-red-600 transition-all group"
                        >
                            <Trash2 className="h-4 w-4 text-red-400 group-hover:text-red-600" />
                            <span>Delete Project</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- Main component ---

const MyProjects = ({ defaultOpenUpload = false }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [droppedFiles, setDroppedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const location = useLocation();

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
            const { data } = await api.get('/projects/my');
            setProjects(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async (id) => {
        if (window.confirm('Are you sure you want to delete this project? All files will be removed.')) {
            try {
                await api.delete(`/projects/${id}`);
                fetchProjects();
            } catch (err) {
                alert('Delete failed');
            }
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return (
        <div
            className="space-y-8 relative min-h-[80vh] pb-20"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <AnimatePresence>
                {isDragging && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-blue-700/20 backdrop-blur-md border-4 border-dashed border-blue-600 m-8 rounded-[3rem] flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-white dark:bg-slate-900 p-12 rounded-[2.5rem] shadow-2xl text-center space-y-4">
                            <div className="h-24 w-24 bg-sky-100 dark:bg-blue-950/30 rounded-3xl flex items-center justify-center mx-auto animate-bounce">
                                <Upload className="h-12 w-12 text-blue-700" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Drop to Upload</h2>
                            <p className="text-slate-500 font-medium">Release to start your new project upload.</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        {defaultOpenUpload ? 'Office Upload Workspace' : 'Project Vault'}
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">
                        {defaultOpenUpload
                            ? 'Enterprise-grade file management and deployment suite.'
                            : 'Access and manage your complete development portfolio.'}
                    </p>
                </div>
                <button
                    onClick={() => { setEditingProject(null); setShowProjectModal(true); }}
                    className="flex items-center space-x-3 bg-blue-700 hover:bg-blue-600 text-white px-8 py-4 rounded-[2rem] transition-all shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95"
                >
                    <Plus className="h-6 w-6 font-bold" />
                    <span className="font-black uppercase tracking-wider text-sm">New Project</span>
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search through your vault..."
                    className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 pl-16 pr-8 py-5 rounded-[2rem] focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/50 outline-none text-slate-900 dark:text-white font-bold text-lg shadow-sm transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProjects.map((project, index) => (
                    <motion.div
                        key={project._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden group hover:shadow-2xl transition-all relative flex flex-col"
                    >
                        {project.thumbnail && (
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={`${BASE_URL}/uploads/${encodeURIComponent(project.thumbnail)}`}
                                    alt=""
                                    className="h-full w-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                                    onError={(e) => {
                                        if (!e.target.dataset.tried) {
                                            e.target.dataset.tried = 'true';
                                            e.target.src = e.target.src.replace('localhost', '127.0.0.1');
                                        }
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent dark:from-slate-950 dark:via-slate-900/40 dark:to-transparent" />
                            </div>
                        )}

                        <div className="p-6 relative z-10 flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-2xl bg-sky-50 dark:bg-blue-950/30 text-blue-700 shadow-sm">
                                    <Folder className="h-7 w-7" />
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                                        Project ID: {project._id.slice(-6)}
                                    </span>
                                    <ProjectMenu
                                        onEdit={() => { setEditingProject(project); setShowProjectModal(true); }}
                                        onDelete={() => handleDeleteProject(project._id)}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <h3 className="text-2xl font-black mb-1 truncate text-slate-900 dark:text-white">{project.title}</h3>
                                <div className="flex items-center space-x-4 text-xs text-slate-500 font-bold">
                                    <div className="flex items-center space-x-1.5">
                                        <div className="h-5 w-5 rounded-full bg-sky-100 dark:bg-blue-950/50 flex items-center justify-center">
                                            <Search className="h-3 w-3 text-blue-700" />
                                        </div>
                                        <span>@{project.employee?.username || 'you'}</span>
                                    </div>
                                    <div className="flex items-center space-x-1.5">
                                        <div className="h-5 w-5 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <Folder className="h-3 w-3 text-slate-400" />
                                        </div>
                                        <span>{project.department?.name || 'Developers'}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 font-medium leading-relaxed">
                                {project.description || 'Developed a comprehensive solution with efficient workflows and modern technologies.'}
                            </p>

                            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 pt-5">
                                <div className="flex items-center space-x-2">
                                    {project.liveUrl && (
                                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-sky-400 hover:scale-110 transition-all">
                                            <ExternalLink className="h-4.5 w-4.5" />
                                        </a>
                                    )}
                                    {project.githubUrl && (
                                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-sky-400 hover:scale-110 transition-all">
                                            <Code className="h-4.5 w-4.5" />
                                        </a>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2 bg-sky-50 dark:bg-blue-950/20 px-3 py-1.5 rounded-xl border border-sky-100 dark:border-blue-900/50">
                                    <FileCode className="h-4 w-4 text-blue-700 dark:text-sky-400" />
                                    <span className="text-[10px] font-black text-blue-700 dark:text-sky-400 uppercase tracking-tighter">
                                        {project.files?.length || 0} ITEMS
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/30 px-6 py-3.5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50 relative z-10">
                            <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>Uploaded {new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                                Details
                            </button>
                        </div>
                    </motion.div>
                ))}

                {filteredProjects.length === 0 && !loading && (
                    <div className="col-span-full flex flex-col items-center justify-center py-40 bg-white dark:bg-slate-900 rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-slate-800 shadow-inner">
                        <div className="h-28 w-28 bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mb-8 text-slate-300 dark:text-slate-600 shadow-xl">
                            <Upload className="h-12 w-12" />
                        </div>
                        <h3 className="text-3xl font-black text-slate-400 text-center leading-tight">
                            Your vault is empty.<br />
                            <span className="text-slate-300 dark:text-slate-700">Drag & drop files to initialize.</span>
                        </h3>
                    </div>
                )}
            </div>

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
        </div>
    );
};

export default MyProjects;
