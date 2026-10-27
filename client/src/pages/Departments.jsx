import React, { useState, useEffect } from 'react';
import api from '../api';
import { Plus, Briefcase, Trash2, Edit, Users, FolderOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input, Modal, Badge, ConfirmDeleteModal } from '@/components/ui';

const Departments = () => {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDept, setEditingDept] = useState(null);
    const [deptToDelete, setDeptToDelete] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [saving, setSaving] = useState(false);

    const fetchDepartments = async () => {
        try {
            const { data } = await api.get('/admin/departments');
            setDepartments(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingDept) {
                await api.put(`/admin/departments/${editingDept._id}`, formData);
            } else {
                await api.post('/admin/departments', formData);
            }
            handleCloseModal();
            fetchDepartments();
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving department');
        } finally {
            setSaving(false);
        }
    };

    const executeDeleteDept = async () => {
        if (!deptToDelete) return;
        try {
            await api.delete(`/admin/departments/${deptToDelete._id}`);
            setDeptToDelete(null);
            fetchDepartments();
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting department');
        }
    };

    const handleEdit = (dept) => {
        setEditingDept(dept);
        setFormData({ name: dept.name, description: dept.description || '' });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingDept(null);
        setFormData({ name: '', description: '' });
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-64" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                    ))}
                </div>
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
                            Departments
                        </h1>
                        <Badge variant="cyan" size="sm">{departments.length} Total</Badge>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Organize your company divisions and assign projects/employees.
                    </p>
                </div>

                <Button
                    onClick={() => { setEditingDept(null); setShowModal(true); }}
                    icon={Plus}
                >
                    Add Department
                </Button>
            </div>

            {/* Department Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept, index) => (
                    <motion.div
                        key={dept._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="flex flex-col justify-between h-full group">
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-blue-600/10 text-blue-600 rounded-xl group-hover:scale-105 transition-transform">
                                        <Briefcase className="h-5 w-5" />
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={() => handleEdit(dept)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                            title="Edit Department"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeptToDelete(dept)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                                            title="Delete Department"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 group-hover:text-blue-600 transition-colors">
                                    {dept.name}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                    {dept.description || 'No description provided for this department.'}
                                </p>
                            </div>

                            <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs">
                                <button
                                    onClick={() => navigate(`/admin/employees?dept=${dept._id}`)}
                                    className="flex items-center space-x-1.5 text-slate-500 hover:text-blue-600 font-medium transition-colors"
                                >
                                    <Users className="h-3.5 w-3.5" />
                                    <span>View Team</span>
                                </button>
                                <button
                                    onClick={() => navigate(`/admin/projects?dept=${dept._id}`)}
                                    className="flex items-center space-x-1.5 text-blue-600 hover:underline font-semibold"
                                >
                                    <FolderOpen className="h-3.5 w-3.5" />
                                    <span>Projects</span>
                                </button>
                            </div>
                        </Card>
                    </motion.div>
                ))}

                {departments.length === 0 && (
                    <div className="col-span-full py-16 text-center glass-card rounded-2xl">
                        <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-600 dark:text-slate-400">No departments found</h3>
                        <p className="text-xs text-slate-400 mt-1 mb-4">Click below to create your first company department</p>
                        <Button onClick={() => setShowModal(true)} icon={Plus} size="sm">
                            Add Department
                        </Button>
                    </div>
                )}
            </div>

            {/* Department Modal */}
            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title={editingDept ? 'Edit Department' : 'Create New Department'}
                description="Manage department name and summary details"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Department Name"
                        placeholder="e.g. Full Stack Development, UI/UX Design"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />

                    <div className="flex flex-col space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Description
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Briefly describe what this department manages..."
                            className="w-full rounded-xl p-3 text-sm bg-white/80 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/40 focus:border-blue-600"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Button
                            variant="secondary"
                            onClick={handleCloseModal}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            loading={saving}
                        >
                            {editingDept ? 'Save Changes' : 'Create Department'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Common Confirm Delete Modal */}
            <ConfirmDeleteModal
                isOpen={Boolean(deptToDelete)}
                onClose={() => setDeptToDelete(null)}
                onConfirm={executeDeleteDept}
                title="Delete Department?"
                itemName={deptToDelete?.name}
                message="Are you sure you want to delete this department? Employees and projects associated with this department may need to be reassigned."
                confirmText="Delete Department"
            />
        </div>
    );
};

export default Departments;
