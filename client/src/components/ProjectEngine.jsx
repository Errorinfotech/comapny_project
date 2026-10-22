import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Code,
    Globe,
    Image as ImageIcon,
    Upload,
    X
} from 'lucide-react';
import api, { BASE_URL } from '../api';

const ProjectEngine = ({
    isOpen,
    onClose,
    onSuccess,
    initialFiles = [],
    project = null,
    initialMode = 'files'
}) => {
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

    useEffect(() => {
        if (project) {
            setTitle(project.title || '');
            setDescription(project.description || '');
            setLiveUrl(project.liveUrl || '');
            setGithubUrl(project.githubUrl || '');
            setFiles([]);
            setThumbnailFile(null);
            setThumbnailPreview(project.thumbnail ? `${BASE_URL}/uploads/${project.thumbnail}` : null);
            setUploadMode('files');
        } else {
            setTitle('');
            setDescription('');
            setLiveUrl('');
            setGithubUrl('');
            setFiles([]);
            setThumbnailFile(null);
            setThumbnailPreview(null);
            setUploadMode(initialMode === 'folder' ? 'folder' : 'files');
        }
    }, [project, isOpen, initialMode]);

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

                // Fallback: find first "meaningful" file (ignore dotfiles/system files)
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
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 w-full max-w-3xl p-10 rounded-[3rem] shadow-2xl overflow-y-auto max-h-[90vh] border border-slate-200 dark:border-slate-800 scrollbar-hide"
            >
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-bold">{project ? 'Edit Project' : 'Project Engine'}</h2>
                        <p className="text-slate-500 font-medium mt-1">
                            {project ? `Modifying artifacts for ${project.title}` : 'Configure project artifacts and metadata.'}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 transition-all text-slate-500">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Project Title</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium text-lg text-slate-900 dark:text-white"
                                    placeholder="Enter project name"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Project Description</label>
                                <textarea
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-blue-600 outline-none transition-all h-48 font-medium resize-none text-slate-900 dark:text-white scrollbar-hide"
                                    placeholder="Briefly describe your project..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Project Thumbnail</label>
                                <div className="group relative h-40 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem] flex items-center justify-center overflow-hidden hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-blue-950/10 transition-all cursor-pointer">
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
                                        <img src={thumbnailPreview} alt="Preview" className="h-full w-full object-cover group-hover:scale-110 transition-all duration-500" />
                                    ) : (
                                        <div className="text-center">
                                            <ImageIcon className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                                            <p className="text-sm font-bold text-slate-400">Click to upload cover image</p>
                                        </div>
                                    )}
                                    {thumbnailPreview && (
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                            <p className="text-white font-bold text-sm">Change Thumbnail</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Live Deployment</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                                        <input
                                            type="url"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
                                            placeholder="https://preview.app"
                                            value={liveUrl}
                                            onChange={(e) => setLiveUrl(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Code Repository</label>
                                    <div className="relative">
                                        <Code className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                                        <input
                                            type="url"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
                                            placeholder="GitHub / GitLab Link"
                                            value={githubUrl}
                                            onChange={(e) => setGithubUrl(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {!project && !isLinksOnly && (
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-500">Resource Package</label>
                                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                                            <button
                                                type="button"
                                                onClick={() => { setUploadMode('files'); setFiles([]); }}
                                                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${uploadMode === 'files' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-700' : 'text-slate-500'}`}
                                            >
                                                FILES
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setUploadMode('folder'); setFiles([]); }}
                                                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${uploadMode === 'folder' ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-700' : 'text-slate-500'}`}
                                            >
                                                FOLDER
                                            </button>
                                        </div>
                                    </div>
                                    <div className="group relative border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[2rem] p-10 text-center hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-blue-950/10 transition-all cursor-pointer">
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
                                        <Upload className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4 group-hover:text-blue-600 transition-all animate-pulse" />
                                        <p className="text-lg font-bold text-slate-600 dark:text-slate-400">
                                            {uploadMode === 'folder' ? 'Select folder to upload' : 'Drag & drop or browse files'}
                                        </p>
                                        <div className="mt-3 flex flex-wrap justify-center gap-2">
                                            {files.length > 0 ? (
                                                files.slice(0, 3).map((file, index) => (
                                                    <span key={index} className="px-3 py-1 bg-sky-100 dark:bg-blue-950/30 text-blue-700 dark:text-sky-400 text-[10px] font-bold rounded-lg uppercase">
                                                        {file.name.slice(0, 10)}...
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-slate-400 font-medium">
                                                    {uploadMode === 'folder' ? 'Full directory support' : 'Images, ZIP, PDF, Docs'}
                                                </span>
                                            )}
                                            {files.length > 3 && <span className="text-[10px] font-bold text-slate-400">+{files.length - 3} MORE</span>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isLinksOnly && (
                                <div className="rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-6">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Links Only Mode</p>
                                    <p className="text-sm text-slate-500 mt-2">
                                        Add your live deployment and repository links in the input fields above. No file or folder upload is needed here.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-8 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold transition-all hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className={`flex-1 px-8 py-5 rounded-2xl bg-blue-700 text-white font-bold transition-all shadow-2xl shadow-blue-600/40 relative overflow-hidden ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 active:scale-95 group'}`}
                        >
                            <span className="relative z-10">
                                {uploading 
                                    ? (uploadProgress === 100 ? 'Processing on server...' : `Uploading... ${uploadProgress}%`) 
                                    : (project ? 'Save Changes' : 'Publish Project')}
                            </span>
                            {uploading && (
                                <motion.div
                                    className="absolute inset-0 bg-sky-400"
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
