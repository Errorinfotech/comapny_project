const Department = require('../models/Department');
const User = require('../models/User');
const Project = require('../models/Project');

// @desc    Get office overview for any authenticated user
// @route   GET /api/office/overview
// @access  Private
const getOfficeOverview = async (req, res) => {
    try {
        const requiredDepartments = [
            { name: 'developers', description: 'all developer team' },
            { name: 'Digital Marketing', description: 'Digital Marketing Team' },
            { name: 'Graphic Designing', description: 'Creative UI/UX & Graphic Design Team' }
        ];

        for (const dept of requiredDepartments) {
            const exists = await Department.findOne({
                name: { $regex: new RegExp(`^${dept.name}$`, 'i') }
            });
            if (!exists) {
                await Department.create(dept);
            }
        }

        const [departments, employees, projects] = await Promise.all([
            Department.find({}).sort({ name: 1 }),
            User.find({ role: 'employee' }).select('username department createdAt').populate('department', 'name'),
            Project.find({ scope: 'office' })
                .populate('employee', 'username')
                .populate('department', 'name')
                .sort({ createdAt: -1 })
        ]);

        res.json({
            departments,
            employees,
            projects
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getOfficeOverview
};
