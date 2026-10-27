const Department = require('../models/Department');
const User = require('../models/User');
const Project = require('../models/Project');
const bcrypt = require('bcryptjs');

// @desc    Create a new department
// @route   POST /api/admin/departments
// @access  Private/Admin
const createDepartment = async (req, res) => {
    const { name, description } = req.body;
    try {
        const departmentExists = await Department.findOne({ name });
        if (departmentExists) return res.status(400).json({ message: 'Department already exists' });

        const department = await Department.create({ name, description });
        res.status(201).json(department);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a department
// @route   PUT /api/admin/departments/:id
// @access  Private/Admin
const updateDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        department.name = req.body.name || department.name;
        department.description = req.body.description || department.description;

        const updatedDepartment = await department.save();
        res.json(updatedDepartment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a department
// @route   DELETE /api/admin/departments/:id
// @access  Private/Admin
const deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }

        await Department.deleteOne({ _id: req.params.id });
        res.json({ message: 'Department removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all departments
// @route   GET /api/admin/departments
// @access  Private
const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find({});
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Add a new employee or client
// @route   POST /api/admin/employees
// @access  Private/Admin
const createEmployee = async (req, res) => {
    const { username, password, departmentId, role, clientSubtype } = req.body;
    try {
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const employeeData = {
            username,
            password,
            role: role || 'employee'
        };

        if (role === 'client' && clientSubtype) {
            employeeData.clientSubtype = clientSubtype;
        } else if (departmentId && departmentId !== '') {
            employeeData.department = departmentId;
        }

        const employee = await User.create(employeeData);

        res.status(201).json({
            _id: employee._id,
            username: employee.username,
            role: employee.role,
            department: employee.department
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete an employee
// @route   DELETE /api/admin/employees/:id
// @access  Private/Admin
const deleteEmployee = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Don't delete self
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot delete yourself' });
        }

        await User.deleteOne({ _id: req.params.id });
        res.json({ message: 'Employee removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Reset employee password
// @route   PUT /api/admin/employees/:id/reset
// @access  Private/Admin
const resetEmployeePassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { newPassword } = req.body;
        if (!newPassword) return res.status(400).json({ message: 'New password is required' });

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all users (employees and clients)
// @route   GET /api/admin/employees
// @access  Private/Admin
const getEmployees = async (req, res) => {
    const { deptId } = req.query;
    try {
        const filter = { role: { $in: ['employee', 'client'] } };
        if (deptId) {
            filter.department = deptId;
        }
        const employees = await User.find(filter).populate('department', 'name');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all company projects
// @route   GET /api/admin/projects
// @access  Private/Admin
const getAllProjects = async (req, res) => {
    const { employeeId, dept, deptId, deptName } = req.query;
    try {
        const filter = {};
        if (employeeId) {
            filter.employee = employeeId;
        }

        const targetDeptId = dept || deptId;
        if (targetDeptId && targetDeptId !== 'undefined' && !targetDeptId.startsWith('temp-')) {
            filter.department = targetDeptId;
        } else if (deptName) {
            const matchedDept = await Department.findOne({
                name: { $regex: new RegExp(`^${deptName}$`, 'i') }
            });
            if (matchedDept) {
                filter.department = matchedDept._id;
            }
        }

        const projects = await Project.find(filter)
            .populate('employee', 'username')
            .populate('department', 'name')
            .sort('-createdAt');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    try {
        const totalDepartments = await Department.countDocuments();
        const totalEmployees = await User.countDocuments({ role: 'employee' });
        const totalProjects = await Project.countDocuments();

        res.json({
            totalDepartments,
            totalEmployees,
            totalProjects
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartments,
    createEmployee,
    deleteEmployee,
    resetEmployeePassword,
    getEmployees,
    getAllProjects,
    getAdminStats
};
