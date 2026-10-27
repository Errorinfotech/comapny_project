const Project = require('../models/Project');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');
const r2 = require('../config/r2');

// @desc    Create a new project/upload
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
    try {
        const { title, description, liveUrl, githubUrl, folders, scope, showOnClientPortal, clientCategory } = req.body;

        const uploadedFiles = req.files?.files || [];
        const uploadedThumbnail = req.files?.thumbnail || [];
        
        let relativePaths = [];
        if (req.body.relativePaths) {
            try {
                relativePaths = JSON.parse(req.body.relativePaths);
            } catch (e) {
                // Fallback for single path or non-JSON
                relativePaths = Array.isArray(req.body.relativePaths) ? req.body.relativePaths : [req.body.relativePaths];
            }
        }

        let files = [];
        if (r2.isR2Configured && uploadedFiles.length > 0) {
            const chunkSize = 10;
            for (let i = 0; i < uploadedFiles.length; i += chunkSize) {
                const chunk = uploadedFiles.slice(i, i + chunkSize);
                const chunkResults = await Promise.all(chunk.map(async (file, cIndex) => {
                    const globalIndex = i + cIndex;
                    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
                    const fileKey = `projects/${Date.now()}-${globalIndex}-${sanitizedName}`;
                    try {
                        const uploadRes = await r2.uploadFile(file.path, fileKey, file.mimetype);
                        try { fs.unlinkSync(file.path); } catch (e) {}
                        return {
                            name: file.originalname,
                            path: uploadRes.url,
                            size: file.size,
                            type: file.mimetype,
                            relativePath: relativePaths[globalIndex] || file.originalname
                        };
                    } catch (uploadErr) {
                        console.error(`Failed to upload ${file.originalname} to R2:`, uploadErr);
                        return {
                            name: file.originalname,
                            path: file.path.replace(/\\/g, '/'),
                            size: file.size,
                            type: file.mimetype,
                            relativePath: relativePaths[globalIndex] || file.originalname
                        };
                    }
                }));
                files.push(...chunkResults);
            }
        } else {
            files = uploadedFiles.map((file, index) => ({
                name: file.originalname,
                path: file.path.replace(/\\/g, '/'),
                size: file.size,
                type: file.mimetype,
                relativePath: relativePaths[index] || file.originalname
            }));
        }

        let thumbnail = '';
        if (uploadedThumbnail[0]) {
            const thumbFile = uploadedThumbnail[0];
            if (r2.isR2Configured) {
                const sanitizedThumbName = thumbFile.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
                const thumbKey = `Thumbnails/${Date.now()}-${sanitizedThumbName}`;
                try {
                    const uploadRes = await r2.uploadFile(thumbFile.path, thumbKey, thumbFile.mimetype);
                    thumbnail = uploadRes.url;
                    try { fs.unlinkSync(thumbFile.path); } catch (e) {}
                } catch (thumbErr) {
                    console.error('Failed to upload thumbnail to R2:', thumbErr);
                    thumbnail = path.basename(thumbFile.path);
                }
            } else {
                thumbnail = path.basename(thumbFile.path);
            }
        }

        if (!title || !title.trim()) {
            return res.status(400).json({ message: 'Project title is required' });
        }

        if (!files.length && !liveUrl && !githubUrl) {
            return res.status(400).json({ message: 'Please upload files/folder or add at least one link' });
        }

        const normalizedScope = scope === 'office' ? 'office' : 'workspace';

        let parsedFolders = [];
        if (folders) {
            try {
                parsedFolders = typeof folders === 'string' ? JSON.parse(folders) : folders;
            } catch (e) {
                parsedFolders = Array.isArray(folders) ? folders : [];
            }
        }

        let assignedEmployee = req.user._id;
        if (req.user.role === 'admin' && (req.body.employeeId || req.body.employee)) {
            assignedEmployee = req.body.employeeId || req.body.employee;
        }

        let assignedDept = req.body.department || req.body.departmentId || req.user.department || undefined;
        if (assignedDept && typeof assignedDept === 'string' && assignedDept.startsWith('temp-')) {
            const deptName = req.body.departmentName;
            if (deptName) {
                const Department = require('../models/Department');
                const foundDept = await Department.findOne({
                    name: { $regex: new RegExp(`^${deptName}$`, 'i') }
                });
                if (foundDept) assignedDept = foundDept._id;
                else assignedDept = undefined;
            } else {
                assignedDept = undefined;
            }
        }

        // If department was not explicitly selected but employee belongs to a department, auto-link it
        if (!assignedDept && assignedEmployee) {
            const empUser = await User.findById(assignedEmployee);
            if (empUser && empUser.department) {
                assignedDept = empUser.department;
            }
        }

        const isClientPortal = req.user.role === 'admin'
            ? (showOnClientPortal === 'true' || showOnClientPortal === true)
            : false;
        const normalizedCategory = req.user.role === 'admin' ? (clientCategory || '') : '';

        const project = await Project.create({
            scope: normalizedScope,
            title: title.trim(),
            description,
            employee: assignedEmployee,
            department: assignedDept,
            files,
            thumbnail,
            folders: parsedFolders,
            liveUrl,
            githubUrl,
            showOnClientPortal: isClientPortal,
            clientCategory: normalizedCategory,
            activityLog: [{ action: 'Project created' }]
        });

        res.status(201).json(project);
    } catch (error) {
        console.error('CREATE PROJECT ERROR:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get user projects
// @route   GET /api/projects/my
// @access  Private
const getMyProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            employee: req.user._id
        })
        .populate('department', 'name')
        .populate('employee', 'username email')
        .sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all projects (for admin)
// @route   GET /api/projects
// @access  Private/Admin
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { scope: 'workspace' },
                { scope: { $exists: false } }
            ]
        })
            .populate('employee', 'username email')
            .populate('department', 'name')
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get client portal projects (ONLY admin published showcase projects)
// @route   GET /api/projects/portal
// @access  Public
const getClientPortalProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            showOnClientPortal: true
        })
            .populate('employee', 'username')
            .populate('department', 'name')
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Toggle project on Client Portal showcase (Admin only)
// @route   PATCH /api/projects/:id/toggle-portal
// @access  Private/Admin
const toggleClientPortal = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.showOnClientPortal = !project.showOnClientPortal;
        if (req.body.clientCategory) {
            project.clientCategory = req.body.clientCategory;
        }

        project.activityLog.push({
            action: project.showOnClientPortal
                ? 'Published to Client Portal'
                : 'Removed from Client Portal'
        });

        await project.save();

        const updated = await Project.findById(project._id)
            .populate('employee', 'username email')
            .populate('department', 'name');

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Search projects
// @route   GET /api/projects/search
// @access  Private
const searchProjects = async (req, res) => {
    const { query } = req.query;
    try {
        // Use aggregation to search in populated fields
        const projects = await Project.aggregate([
            {
                $match: {
                    $or: [
                        { scope: 'workspace' },
                        { scope: { $exists: false } }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'employee',
                    foreignField: '_id',
                    as: 'employee'
                }
            },
            { $unwind: '$employee' },
            {
                $lookup: {
                    from: 'departments',
                    localField: 'department',
                    foreignField: '_id',
                    as: 'department'
                }
            },
            { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
            {
                $match: {
                    $or: [
                        { title: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } },
                        { 'employee.username': { $regex: query, $options: 'i' } },
                        { 'department.name': { $regex: query, $options: 'i' } }
                    ]
                }
            },
            {
                $project: {
                    'employee.password': 0,
                    'employee.__v': 0,
                    'department.__v': 0,
                    '__v': 0
                }
            },
            { $sort: { createdAt: -1 } }
        ]);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Only owner or admin can delete
        if (project.employee.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Delete actual files from R2 or local disk
        for (const file of project.files) {
            if (file && file.path) {
                if (
                    file.path.startsWith('http://') ||
                    file.path.startsWith('https://') ||
                    file.path.startsWith('/api/storage/') ||
                    file.path.startsWith('projects/')
                ) {
                    await r2.deleteFile(file.path);
                } else {
                    const filePath = path.resolve(file.path);
                    if (fs.existsSync(filePath)) {
                        try { fs.unlinkSync(filePath); } catch (e) {}
                    }
                }
            }
        }

        // Delete thumbnail if exists from R2 or local disk
        if (project.thumbnail) {
            if (
                project.thumbnail.startsWith('http://') ||
                project.thumbnail.startsWith('https://') ||
                project.thumbnail.startsWith('/api/storage/') ||
                project.thumbnail.startsWith('Thumbnails/')
            ) {
                await r2.deleteFile(project.thumbnail);
            } else {
                const thumbPath = path.resolve('uploads', project.thumbnail);
                if (fs.existsSync(thumbPath)) {
                    try { fs.unlinkSync(thumbPath); } catch (e) {}
                }
            }
        }

        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update project metadata
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
    try {
        const { title, description, liveUrl, githubUrl } = req.body;
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Only owner or admin can update
        if (project.employee.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        project.title = title || project.title;
        project.description = description || project.description;
        project.liveUrl = liveUrl || project.liveUrl;
        project.githubUrl = githubUrl || project.githubUrl;

        // Admin can reassign employee, department, and client portal status
        if (req.user.role === 'admin') {
            if (req.body.employeeId || req.body.employee) {
                project.employee = req.body.employeeId || req.body.employee;
            }
            if (req.body.department !== undefined) {
                project.department = req.body.department || undefined;
            }
            if (req.body.showOnClientPortal !== undefined) {
                project.showOnClientPortal = req.body.showOnClientPortal === 'true' || req.body.showOnClientPortal === true;
            }
            if (req.body.clientCategory !== undefined) {
                project.clientCategory = req.body.clientCategory;
            }
        }

        // Handle thumbnail update
        if (req.files && req.files['thumbnail'] && req.files['thumbnail'][0]) {
            const newThumbFile = req.files['thumbnail'][0];
            // Delete old thumbnail if exists from R2 or local disk
            if (project.thumbnail) {
                if (
                    project.thumbnail.startsWith('http://') ||
                    project.thumbnail.startsWith('https://') ||
                    project.thumbnail.startsWith('/api/storage/') ||
                    project.thumbnail.startsWith('Thumbnails/')
                ) {
                    await r2.deleteFile(project.thumbnail);
                } else {
                    const oldThumbPath = path.resolve('uploads', project.thumbnail);
                    if (fs.existsSync(oldThumbPath)) {
                        try { fs.unlinkSync(oldThumbPath); } catch (e) {}
                    }
                }
            }

            if (r2.isR2Configured) {
                const sanitizedThumbName = newThumbFile.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
                const thumbKey = `Thumbnails/${Date.now()}-${sanitizedThumbName}`;
                try {
                    const uploadRes = await r2.uploadFile(newThumbFile.path, thumbKey, newThumbFile.mimetype);
                    project.thumbnail = uploadRes.url;
                    try { fs.unlinkSync(newThumbFile.path); } catch (e) {}
                } catch (thumbErr) {
                    console.error('Failed to upload updated thumbnail to R2:', thumbErr);
                    project.thumbnail = path.basename(newThumbFile.path);
                }
            } else {
                project.thumbnail = path.basename(newThumbFile.path);
            }
        }

        project.activityLog.push({ action: 'Project metadata updated' });

        await project.save();
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createProject,
    getMyProjects,
    getAllProjects,
    getClientPortalProjects,
    toggleClientPortal,
    searchProjects,
    deleteProject,
    updateProject
};
