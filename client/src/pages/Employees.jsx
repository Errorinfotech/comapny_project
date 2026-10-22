import React, { useState, useEffect } from 'react';
import api from '../api';
import { UserPlus, Trash2, Key, Search, Users, User, Shield, Lock, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Card, Input, Modal, Badge } from '@/components/ui';

const Employees = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const deptId = searchParams.get('deptId') || searchParams.get('dept');
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [newEmp, setNewEmp] = useState({ username: '', password: '', departmentId: '' });
    const [newPassword, setNewPassword] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        try {
            const [empRes, deptRes] = await Promise.all([
                api.get(`/admin/employees${deptId ? `?deptId=${deptId}` : ''}`),
                api.get('/admin/departments')
            ]);
            setEmployees(empRes.data);
            setDepartments(deptRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [deptId]);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/admin/employees', newEmp);
            setShowModal(false);
            setNewEmp({ username: '', password: '', departmentId: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating employee');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to remove this employee?')) {
            try {
                await api.delete(`/admin/employees/${id}`);
                fetchData();
            } catch (err) {
                alert(err.response?.data?.message || 'Error deleting employee');
            }
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.put(`/admin/employees/${selectedEmp._id}/reset`, { newPassword });
            setShowResetModal(false);
            setNewPassword('');
            setSelectedEmp(null);
            alert('Password reset successfully');
        } catch (err) {
            alert(err.response?.data?.message || 'Error resetting password');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.department?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        if (deptId) {
            return matchesSearch && (emp.department?._id === deptId || emp.department === deptId);
        }
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse max-w-7xl mx-auto">
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-64" />
                <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
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
                            Employees
                        </h1>
                        <Badge variant="primary" size="sm">{filteredEmployees.length} Members</Badge>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage company employee profiles, department roles and login credentials.
                    </p>
                </div>

                <Button
                    onClick={() => setShowModal(true)}
                    icon={UserPlus}
                >
                    Add Employee
                </Button>
            </div>

            {/* Table Card */}
            <Card className="p-0 overflow-hidden" hover={false}>
                {/* Search Bar header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter employees by username or department..."
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider bg-slate-50/70 dark:bg-slate-900/30">
                                <th className="px-6 py-3.5">Employee</th>
                                <th className="px-6 py-3.5">Department</th>
                                <th className="px-6 py-3.5">Role</th>
                                <th className="px-6 py-3.5">Joined Date</th>
                                <th className="px-6 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
                            {filteredEmployees.map((emp) => (
                                <tr
                                    key={emp._id}
                                    onClick={() => navigate(`/admin/projects?employeeId=${emp._id}`)}
                                    className="hover:bg-blue-600/5 dark:hover:bg-blue-600/5 transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-800 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-blue-600/20">
                                                {emp.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <span className="font-semibold text-slate-900 dark:text-white block">
                                                    {emp.username}
                                                </span>
                                                <span className="text-[11px] text-slate-400 block font-normal">
                                                    @{emp.username}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant="cyan" size="sm">
                                            {emp.department?.name || 'Unassigned'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="capitalize text-xs font-semibold text-slate-600 dark:text-slate-300">
                                            {emp.role || 'employee'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-400">
                                        {new Date(emp.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedEmp(emp); setShowResetModal(true); }}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                title="Reset Password"
                                            >
                                                <Key className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(emp._id); }}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                                                title="Delete Employee"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredEmployees.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-16 text-center text-slate-400">
                                        <Users className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                                        <p className="text-sm font-semibold">No employees matched your criteria</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Add Employee Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Add New Employee"
                description="Set up login credentials and assign a department"
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <Input
                        label="Username"
                        placeholder="e.g. john_doe"
                        icon={User}
                        required
                        value={newEmp.username}
                        onChange={(e) => setNewEmp({ ...newEmp, username: e.target.value })}
                    />

                    <Input
                        label="Temporary Password"
                        type="password"
                        placeholder="Minimum 6 characters"
                        icon={Lock}
                        required
                        value={newEmp.password}
                        onChange={(e) => setNewEmp({ ...newEmp, password: e.target.value })}
                    />

                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Department
                        </label>
                        <select
                            className="w-full rounded-xl py-2.5 px-3 text-sm bg-white/80 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600"
                            required
                            value={newEmp.departmentId}
                            onChange={(e) => setNewEmp({ ...newEmp, departmentId: e.target.value })}
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept._id} value={dept._id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button
                            variant="secondary"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={submitting}
                        >
                            Create Employee
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Reset Password Modal */}
            <Modal
                isOpen={showResetModal}
                onClose={() => { setShowResetModal(false); setSelectedEmp(null); }}
                title="Reset Employee Password"
                description={`Assign a new security credential for @${selectedEmp?.username}`}
            >
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <Input
                        label="New Password"
                        type="password"
                        placeholder="Enter secure new password"
                        icon={Key}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button
                            variant="secondary"
                            onClick={() => { setShowResetModal(false); setSelectedEmp(null); }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={submitting}
                        >
                            Update Password
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Employees;
