const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/departments', getDepartments);
router.post('/departments', adminOnly, createDepartment);
router.put('/departments/:id', adminOnly, updateDepartment);
router.delete('/departments/:id', adminOnly, deleteDepartment);

router.get('/employees', adminOnly, getEmployees);
router.post('/employees', adminOnly, createEmployee);
router.delete('/employees/:id', adminOnly, deleteEmployee);
router.put('/employees/:id/reset', adminOnly, resetEmployeePassword);

router.get('/projects', adminOnly, getAllProjects);

router.get('/stats', adminOnly, getAdminStats);

module.exports = router;
