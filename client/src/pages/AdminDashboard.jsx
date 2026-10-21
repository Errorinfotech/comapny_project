import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, FolderOpen, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalDepartments: 0,
        totalEmployees: 0,
        totalProjects: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data);
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);


    const cards = [
        { name: 'Total Departments', value: stats.totalDepartments, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
        { name: 'Total Employees', value: stats.totalEmployees, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
        { name: 'Total Projects', value: stats.totalProjects, icon: FolderOpen, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    ];

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Overview</h1>
                <p className="text-slate-500 mt-2">Manage your company project infrastructure from here.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">{card.name}</p>
                                <p className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">{card.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl ${card.bg}`}>
                                <card.icon className={`h-6 w-6 ${card.color}`} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-green-500 space-x-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>System active</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                    <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/admin/departments')}
                            className="flex items-center space-x-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all text-left group"
                        >
                            <Briefcase className="h-5 w-5 text-indigo-500" />
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">Add Department</p>
                                <p className="text-xs text-slate-500">Create new team</p>
                            </div>
                        </button>
                        <button
                            onClick={() => navigate('/admin/employees')}
                            className="flex items-center space-x-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 transition-all text-left group"
                        >
                            <Users className="h-5 w-5 text-indigo-500" />
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">Add Employee</p>
                                <p className="text-xs text-slate-500">New team member</p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
