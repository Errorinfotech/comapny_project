const Project = require('../models/Project');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

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

        const files = uploadedFiles.map((file, index) => ({
            name: file.originalname,
            path: file.path.replace(/\\/g, '/'),
            size: file.size,
            type: file.mimetype,
            relativePath: relativePaths[index] || file.originalname
        }));

        const thumbnail = uploadedThumbnail[0] ? path.basename(uploadedThumbnail[0].path) : '';

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

        // Delete actual files from disk
        project.files.forEach(file => {
            const filePath = path.resolve(file.path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        // Delete thumbnail if exists
        if (project.thumbnail) {
            const thumbPath = path.resolve('uploads', project.thumbnail);
            if (fs.existsSync(thumbPath)) {
                fs.unlinkSync(thumbPath);
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
            // Delete old thumbnail if exists
            if (project.thumbnail) {
                const oldThumbPath = path.resolve('uploads', project.thumbnail);
                if (fs.existsSync(oldThumbPath)) {
                    fs.unlinkSync(oldThumbPath);
                }
            }
            project.thumbnail = path.basename(req.files['thumbnail'][0].path);
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
