import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, FolderOpen, TrendingUp, Plus, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, Badge, Button } from '@/components/ui';

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
        {
            name: 'Total Departments',
            value: stats.totalDepartments,
            icon: Briefcase,
            gradient: 'from-blue-500 to-indigo-600',
            bg: 'bg-blue-500/10 text-blue-500',
            badge: 'Active Teams',
            onClick: () => navigate('/admin/departments')
        },
        {
            name: 'Total Employees',
            value: stats.totalEmployees,
            icon: Users,
            gradient: 'from-indigo-500 to-purple-600',
            bg: 'bg-indigo-500/10 text-indigo-500',
            badge: 'Team Members',
            onClick: () => navigate('/admin/employees')
        },
        {
            name: 'Total Projects',
            value: stats.totalProjects,
            icon: FolderOpen,
            gradient: 'from-cyan-500 to-blue-600',
            bg: 'bg-cyan-500/10 text-cyan-500',
            badge: 'Vault Items',
            onClick: () => navigate('/admin/projects')
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-64" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-36 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
                <div>
                    <div className="flex items-center space-x-2.5 mb-1">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Admin Overview
                        </h1>
                        <Badge variant="primary" dot size="sm">System Online</Badge>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Monitor departments, employees and project infrastructure in real time.
                    </p>
                </div>

                <div className="flex items-center space-x-3">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate('/admin/projects')}
                        icon={FolderOpen}
                    >
                        Browse All Projects
                    </Button>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.name}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.08, duration: 0.3 }}
                    >
                        <Card
                            onClick={card.onClick}
                            className="relative overflow-hidden cursor-pointer group"
                        >
                            {/* Subtle background glow on hover */}
                            <div className="absolute -right-8 -top-8 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-300" />

                            <div className="flex items-center justify-between relative z-10">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        {card.name}
                                    </p>
                                    <p className="text-3xl sm:text-4xl font-extrabold mt-2 text-slate-900 dark:text-white tracking-tight">
                                        {card.value}
                                    </p>
                                </div>
                                <div className={`p-3.5 rounded-2xl ${card.bg} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                    <card.icon className="h-6 w-6" />
                                </div>
                            </div>

                            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                                <span className="flex items-center space-x-1.5 text-emerald-500 font-medium">
                                    <TrendingUp className="h-3.5 w-3.5" />
                                    <span>{card.badge}</span>
                                </span>
                                <span className="group-hover:translate-x-1 transition-transform text-indigo-500 font-semibold flex items-center space-x-1">
                                    <span>View Details</span>
                                    <ArrowRight className="h-3 w-3" />
                                </span>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions & System Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <h2 className="text-base font-bold text-slate-900 dark:text-white">
                                Management Shortcuts
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">Quickly provision teams or team members</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/admin/departments')}
                            className="flex items-start space-x-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500 dark:hover:border-indigo-500/60 bg-white/50 dark:bg-slate-900/40 hover:bg-indigo-500/5 transition-all text-left group"
                        >
                            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl group-hover:scale-105 transition-transform">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                                    Manage Departments
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Create, edit or organize company divisions
                                </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all self-center" />
                        </button>

                        <button
                            onClick={() => navigate('/admin/employees')}
                            className="flex items-start space-x-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 hover:border-indigo-500 dark:hover:border-indigo-500/60 bg-white/50 dark:bg-slate-900/40 hover:bg-indigo-500/5 transition-all text-left group"
                        >
                            <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl group-hover:scale-105 transition-transform">
                                <Users className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                                    Manage Employees
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Onboard colleagues, assign roles and credentials
                                </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all self-center" />
                        </button>
                    </div>
                </Card>

                {/* System Status / Health */}
                <Card>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Security & Health</h3>
                            <p className="text-xs text-slate-400">Database & API Status</p>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2 text-xs">
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                            <span className="text-slate-500 font-medium">Database</span>
                            <span className="flex items-center space-x-1.5 text-emerald-500 font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Atlas Connected</span>
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                            <span className="text-slate-500 font-medium">Auth Engine</span>
                            <span className="text-indigo-500 font-semibold">JWT Active</span>
                        </div>

                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                            <span className="text-slate-500 font-medium">Max Upload Limit</span>
                            <span className="text-slate-700 dark:text-slate-300 font-semibold">2000 MB</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
