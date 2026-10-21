import { useState, useEffect } from 'react';
import api from '../api';
import { Plus, UserPlus, Trash2, Key, Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Employees = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const deptId = searchParams.get('deptId');
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [newEmp, setNewEmp] = useState({ username: '', password: '', departmentId: '' });
    const [newPassword, setNewPassword] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

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
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/admin/employees', newEmp);
            setShowModal(false);
            setNewEmp({ username: '', password: '', departmentId: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Error creating employee');
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
        try {
            await api.put(`/admin/employees/${selectedEmp._id}/reset`, { newPassword });
            setShowResetModal(false);
            setNewPassword('');
            setSelectedEmp(null);
            alert('Password reset successfully');
        } catch (err) {
            alert(err.response?.data?.message || 'Error resetting password');
        }
    };

    const filteredEmployees = employees.filter(emp => {
        const matchesSearch = emp.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.department?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        if (deptId) {
            return matchesSearch && emp.department?._id === deptId;
        }
        return matchesSearch;
    });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Employees</h1>
                    <p className="text-slate-500 mt-2">Manage team member accounts and credentials.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                >
                    <UserPlus className="h-5 w-5" />
                    <span>Add Employee</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or department..."
                            className="bg-transparent border-none w-full pl-10 pr-4 py-1 text-sm focus:ring-0 outline-none text-slate-900 dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">User</th>
                                <th className="px-6 py-4 font-semibold">Department</th>
                                <th className="px-6 py-4 font-semibold">Username</th>
                                <th className="px-6 py-4 font-semibold">Joined At</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredEmployees.map((emp) => (
                                <tr
                                    key={emp._id}
                                    onClick={() => navigate(`/admin/projects?employeeId=${emp._id}`)}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                                {emp.username.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium text-slate-900 dark:text-white">{emp.username}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                                            {emp.department?.name || 'Unassigned'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">@{emp.username}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(emp.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setSelectedEmp(emp); setShowResetModal(true); }}
                                                className="p-2 text-slate-400 hover:text-indigo-500"
                                                title="Reset Password"
                                            >
                                                <Key className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(emp._id); }}
                                                className="p-2 text-slate-400 hover:text-red-500"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Employee Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-2xl shadow-2xl relative"
                    >
                        <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <X className="h-5 w-5" />
                        </button>
                        <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Username</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                                    required
                                    value={newEmp.username}
                                    onChange={(e) => setNewEmp({ ...newEmp, username: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                    value={newEmp.password}
                                    onChange={(e) => setNewEmp({ ...newEmp, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Department</label>
                                <select
                                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                    value={newEmp.departmentId}
                                    onChange={(e) => setNewEmp({ ...newEmp, departmentId: e.target.value })}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept._id} value={dept._id}>{dept.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-all"
                                >
                                    Add Employee
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Reset Password Modal */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 w-full max-w-md p-8 rounded-2xl shadow-2xl relative"
                    >
                        <button onClick={() => setShowResetModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <X className="h-5 w-5" />
                        </button>
                        <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
                        <p className="text-slate-500 mb-6 font-medium">Set a new password for @{selectedEmp?.username}</p>
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">New Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    required
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new secure password"
                                />
                            </div>
                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowResetModal(false)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Employees;
