import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Code,
    Globe,
    Image as ImageIcon,
    Upload,
    X,
    User,
    Briefcase
} from 'lucide-react';
import api, { BASE_URL, getStorageUrl } from '../api';
import { useAuth } from '../context/AuthContext';

const ProjectEngine = ({
    isOpen,
    onClose,
    onSuccess,
    initialFiles = [],
    project = null,
    initialMode = 'files',
    initialEmployeeId = null,
    departmentId = null,
    departmentName = ''
}) => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [liveUrl, setLiveUrl] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [files, setFiles] = useState([]);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [uploadMode, setUploadMode] = useState('files');
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Admin assignable employee, department, and client portal publishing
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
    const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
    const [showOnClientPortal, setShowOnClientPortal] = useState(false);
    const [clientCategory, setClientCategory] = useState('');

    // Fetch employees and departments for admin assignment
    useEffect(() => {
        if (isOpen && isAdmin) {
            const fetchMeta = async () => {
                try {
                    const [empRes, deptRes] = await Promise.all([
                        api.get('/admin/employees'),
                        api.get('/admin/departments')
                    ]);
                    setEmployees(Array.isArray(empRes.data) ? empRes.data : []);
                    setDepartments(Array.isArray(deptRes.data) ? deptRes.data : []);
                } catch (e) {
                    console.error('Error fetching admin meta for project engine:', e);
                }
            };
            fetchMeta();
        }
    }, [isOpen, isAdmin]);

    useEffect(() => {
        if (project) {
            setTitle(project.title || '');
            setDescription(project.description || '');
            setLiveUrl(project.liveUrl || '');
            setGithubUrl(project.githubUrl || '');
            setFiles([]);
            setThumbnailFile(null);
            setThumbnailPreview(project.thumbnail ? getStorageUrl(project.thumbnail) : null);
            setUploadMode('files');
            setSelectedEmployeeId(project.employee?._id || project.employee || '');
            setSelectedDepartmentId(project.department?._id || project.department || '');
            setShowOnClientPortal(Boolean(project.showOnClientPortal));
            setClientCategory(project.clientCategory || '');
        } else {
            setTitle('');
            setDescription('');
            setLiveUrl('');
            setGithubUrl('');
            setFiles([]);
            setThumbnailFile(null);
            setThumbnailPreview(null);
            setUploadMode(initialMode === 'folder' ? 'folder' : 'files');
            setSelectedEmployeeId(initialEmployeeId || '');
            setSelectedDepartmentId(departmentId || '');
            setShowOnClientPortal(false);
            setClientCategory('');
        }
    }, [project, isOpen, initialMode, initialEmployeeId, departmentId]);

    useEffect(() => {
        if (initialFiles.length > 0 && !project) {
            setFiles(initialFiles);
            if (!title) {
                // Try to get folder name from relative path first
                const firstWithRelative = initialFiles.find(f => f.webkitRelativePath);
                if (firstWithRelative) {
                    const folderName = firstWithRelative.webkitRelativePath.split('/')[0];
                    if (folderName && folderName !== '.') {
                        setTitle(folderName.replace(/[-_]/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
                        return;
                    }
                }

                // Fallback: find first "meaningful" file
                const meaningfulFile = initialFiles.find(f => !f.name.startsWith('.') && !f.name.includes('COMMIT_EDITMSG')) || initialFiles[0];
                const name = meaningfulFile.name.split('.')[0].replace(/[-_]/g, ' ');
                setTitle(name.charAt(0).toUpperCase() + name.slice(1));
            }
        }
    }, [initialFiles, project, title]);

    const isLinksOnly = !project && initialMode === 'links';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            if (project) {
                const formData = new FormData();
                formData.append('title', title);
                formData.append('description', description);
                formData.append('liveUrl', liveUrl);
                formData.append('githubUrl', githubUrl);

                if (isAdmin) {
                    if (selectedEmployeeId) {
                        formData.append('employeeId', selectedEmployeeId);
                    }
                    if (selectedDepartmentId) {
                        formData.append('department', selectedDepartmentId);
                    }
                }
                
                if (isAdmin) {
                    formData.append('showOnClientPortal', showOnClientPortal);
                    formData.append('clientCategory', clientCategory);
                }

                if (thumbnailFile) {
                    formData.append('thumbnail', thumbnailFile);
                }

                await api.put(`/projects/${project._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                });
            } else {
                const formData = new FormData();
                formData.append('title', title);
                formData.append('description', description);
                formData.append('liveUrl', liveUrl);
                formData.append('githubUrl', githubUrl);
                formData.append('scope', 'office');

                if (isAdmin && selectedEmployeeId) {
                    formData.append('employeeId', selectedEmployeeId);
                }

                if (isAdmin) {
                    formData.append('showOnClientPortal', showOnClientPortal);
                    formData.append('clientCategory', clientCategory);
                }

                const finalDept = selectedDepartmentId || departmentId;
                if (finalDept) {
                    formData.append('department', finalDept);
                }
                if (departmentName) {
                    formData.append('departmentName', departmentName);
                }

                const folderNames = new Set();
                const paths = [];
                files.forEach((file) => {
                    const relPath = file.webkitRelativePath || file.name;
                    
                    // Robustness: Skip node_modules and .git to prevent crashes on massive projects
                    if (relPath.includes('node_modules') || relPath.includes('.git')) return;

                    formData.append('files', file);
                    paths.push(relPath);

                    // Extract folder structure
                    const parts = relPath.split('/');
                    if (parts.length > 1) {
                        for (let i = 1; i < parts.length; i++) {
                            folderNames.add(parts.slice(0, i).join('/'));
                        }
                    }
                });

                formData.append('relativePaths', JSON.stringify(paths));

                if (folderNames.size > 0) {
                    formData.append('folders', JSON.stringify(Array.from(folderNames)));
                }

                if (thumbnailFile) {
                    formData.append('thumbnail', thumbnailFile);
                }

                await api.post('/projects', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                });
            }

            onSuccess?.();
            onClose?.();
        } catch (err) {
            alert(err.response?.data?.message || 'Action failed');
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white dark:bg-[#070e28] w-full max-w-3xl p-8 sm:p-10 rounded-[2.5rem] shadow-2xl overflow-y-auto max-h-[90vh] border border-sky-100 dark:border-[#15245c] scrollbar-hide"
            >
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                            {project ? 'Edit Project' : departmentName ? `Add ${departmentName} Project` : 'Project Deployment Engine'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-sm mt-1">
                            {project ? `Modifying artifacts & metadata for ${project.title}` : 'Configure project owner, artifacts, and deployment links.'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-500 cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 👤 Admin Employee & Department Assignment Bar */}
                    {isAdmin && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/80 dark:bg-[#0c1844] border border-sky-100 dark:border-[#192b6a] space-y-3">
                            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 dark:text-sky-300 block">
                                Ownership & Organization (Admin Controls)
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div>
                                    <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                                        <User className="h-3.5 w-3.5 text-blue-600" />
                                        <span>Assign Employee *</span>
                                    </label>
                                    <select
                                        value={selectedEmployeeId}
                                        onChange={(e) => {
                                            const empId = e.target.value;
                                            setSelectedEmployeeId(empId);
                                            // Auto-select employee's department if available and not yet set
                                            if (empId) {
                                                const empObj = employees.find(emp => emp._id === empId);
                                                if (empObj?.department?._id) {
                                                    setSelectedDepartmentId(empObj.department._id);
                                                } else if (empObj?.department) {
                                                    setSelectedDepartmentId(empObj.department);
                                                }
                                            }
                                        }}
                                        className="w-full bg-white dark:bg-[#070e28] border border-sky-200 dark:border-[#1b2d69] rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                                    >
                                        <option value="">Select Employee...</option>
                                        {employees.map(emp => (
                                            <option key={emp._id} value={emp._id}>
                                                @{emp.username} {emp.department?.name ? `(${emp.department.name})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                                        <Briefcase className="h-3.5 w-3.5 text-blue-600" />
                                        <span>Department</span>
                                    </label>
                                    <select
                                        value={selectedDepartmentId}
                                        onChange={(e) => setSelectedDepartmentId(e.target.value)}
                                        className="w-full bg-white dark:bg-[#070e28] border border-sky-200 dark:border-[#1b2d69] rounded-xl py-2.5 px-3 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                                    >
                                        <option value="">Select Department...</option>
                                        {departments.map(dept => (
                                            <option key={dept._id} value={dept._id}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* 🚀 Client Portal Showcase Control */}
                            <div className="pt-3 border-t border-sky-100 dark:border-[#192b6a]">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <label className="flex items-center space-x-2.5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={showOnClientPortal}
                                            onChange={(e) => setShowOnClientPortal(e.target.checked)}
                                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <div>
                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block">
                                                Publish to Client Portal Showcase
                                            </span>
                                            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                                                Displays this project live in the Client Portal portfolio
                                            </span>
                                        </div>
                                    </label>

                                    {showOnClientPortal && (
                                        <div className="w-full sm:w-56 shrink-0">
                                            <select
                                                value={clientCategory}
                                                onChange={(e) => setClientCategory(e.target.value)}
                                                className="w-full bg-white dark:bg-[#070e28] border border-blue-400 dark:border-blue-600 rounded-xl py-2 px-3 text-xs font-bold text-blue-900 dark:text-sky-200 outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                                            >
                                                <option value="">Auto-detect Category</option>
                                                <option value="website">Website</option>
                                                <option value="software">Software</option>
                                                <option value="graphics">Graphics</option>
                                                <option value="digital-marketing">Digital Marketing</option>
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Project Title *</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-semibold text-sm text-slate-900 dark:text-white"
                                    placeholder="Enter project name"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Project Description</label>
                                <textarea
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 focus:ring-2 focus:ring-blue-600 outline-none transition-all h-36 font-medium text-xs resize-none text-slate-900 dark:text-white"
                                    placeholder="Briefly describe your project..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Project Thumbnail</label>
                                <div className="group relative h-36 border-2 border-dashed border-sky-200 dark:border-slate-800 rounded-2xl flex items-center justify-center overflow-hidden hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-blue-950/10 transition-all cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                setThumbnailFile(file);
                                                setThumbnailPreview(URL.createObjectURL(file));
                                            }
                                        }}
                                    />
                                    {thumbnailPreview ? (
                                        <img src={thumbnailPreview} alt="Preview" className="h-full w-full object-cover group-hover:scale-105 transition-all duration-500" />
                                    ) : (
                                        <div className="text-center">
                                            <ImageIcon className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-1" />
                                            <p className="text-xs font-bold text-slate-400">Click to upload cover image</p>
                                        </div>
                                    )}
                                    {thumbnailPreview && (
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                            <p className="text-white font-bold text-xs">Change Thumbnail</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-3.5">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Live Deployment URL</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                        <input
                                            type="url"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 pl-10 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium text-xs text-slate-900 dark:text-white"
                                            placeholder="https://preview.app"
                                            value={liveUrl}
                                            onChange={(e) => setLiveUrl(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Code Repository</label>
                                    <div className="relative">
                                        <Code className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                                        <input
                                            type="url"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 pl-10 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium text-xs text-slate-900 dark:text-white"
                                            placeholder="GitHub / GitLab Link"
                                            value={githubUrl}
                                            onChange={(e) => setGithubUrl(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {!project && !isLinksOnly && (
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Resource Files</label>
                                        <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg">
                                            <button
                                                type="button"
                                                onClick={() => { setUploadMode('files'); setFiles([]); }}
                                                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${uploadMode === 'files' ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-700 dark:text-sky-300' : 'text-slate-500'}`}
                                            >
                                                FILES
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setUploadMode('folder'); setFiles([]); }}
                                                className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${uploadMode === 'folder' ? 'bg-white dark:bg-slate-700 shadow-xs text-blue-700 dark:text-sky-300' : 'text-slate-500'}`}
                                            >
                                                FOLDER
                                            </button>
                                        </div>
                                    </div>
                                    <div className="group relative border-2 border-dashed border-sky-200 dark:border-slate-800 rounded-2xl p-6 text-center hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-blue-950/10 transition-all cursor-pointer">
                                        {uploadMode === 'folder' ? (
                                            <input
                                                type="file"
                                                multiple
                                                webkitdirectory="true"
                                                directory="true"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                    const selectedFiles = Array.from(e.target.files);
                                                    setFiles(selectedFiles);
                                                    if (!title && selectedFiles.length > 0) {
                                                        const first = selectedFiles.find(f => f.webkitRelativePath);
                                                        const folderName = first ? first.webkitRelativePath.split('/')[0] : '';
                                                        if (folderName && folderName !== '.') {
                                                            setTitle(folderName.replace(/[-_]/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
                                                        }
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <input
                                                type="file"
                                                multiple
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                    const selectedFiles = Array.from(e.target.files);
                                                    setFiles(selectedFiles);
                                                    if (!title && selectedFiles.length > 0) {
                                                        const meaningfulFile = selectedFiles.find(f => !f.name.startsWith('.')) || selectedFiles[0];
                                                        const name = meaningfulFile.name.split('.')[0].replace(/[-_]/g, ' ');
                                                        setTitle(name.charAt(0).toUpperCase() + name.slice(1));
                                                    }
                                                }}
                                            />
                                        )}
                                        <Upload className="h-8 w-8 text-blue-500 dark:text-sky-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                            {uploadMode === 'folder' ? 'Click to select project folder' : 'Drag & drop or browse files'}
                                        </p>
                                        <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                                            {files.length > 0 ? (
                                                files.slice(0, 3).map((file, index) => (
                                                    <span key={index} className="px-2 py-0.5 bg-sky-100 dark:bg-blue-950/30 text-blue-700 dark:text-sky-400 text-[10px] font-bold rounded-md">
                                                        {file.name.slice(0, 12)}...
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[11px] text-slate-400">
                                                    {uploadMode === 'folder' ? 'Full directory preserved' : 'ZIP, PDF, JS, CSS, Media'}
                                                </span>
                                            )}
                                            {files.length > 3 && <span className="text-[10px] font-bold text-slate-400">+{files.length - 3} MORE</span>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isLinksOnly && (
                                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
                                    <p className="text-xs font-semibold text-slate-900 dark:text-white">Links Only Mode</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Add your live deployment and repository links in the input fields above.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex space-x-3 pt-4 border-t border-slate-100 dark:border-[#14235a]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-6 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className={`flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 relative overflow-hidden cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                        >
                            <span className="relative z-10">
                                {uploading 
                                    ? (uploadProgress === 100 ? 'Processing on server...' : `Uploading... ${uploadProgress}%`) 
                                    : (project ? 'Save Changes' : 'Publish Project')}
                            </span>
                            {uploading && (
                                <motion.div
                                    className="absolute inset-0 bg-sky-400/40"
                                    initial={{ x: '-100%' }}
                                    animate={{ x: `${uploadProgress - 100}%` }}
                                    transition={{ type: 'spring', damping: 20 }}
                                />
                            )}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ProjectEngine;
