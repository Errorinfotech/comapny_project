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
            name: 'Office Departments',
            value: stats.totalDepartments,
            subtext: 'Operational Units',
            icon: Briefcase,
            iconStyle: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
            badgeText: 'Active Units',
            badgeStyle: 'bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-900/50',
            hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-700/60',
            onClick: () => navigate('/admin/departments')
        },
        {
            name: 'Active Development Units',
            value: stats.totalProjects,
            subtext: 'In Production',
            icon: FolderOpen,
            iconStyle: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
            badgeText: '100% Active Work',
            badgeStyle: 'bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900/50',
            hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700/60',
            onClick: () => navigate('/admin/projects')
        },
        {
            name: 'Office Workforce',
            value: stats.totalEmployees,
            subtext: 'Assigned Employees',
            icon: Users,
            iconStyle: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
            badgeText: 'Full Capacity',
            badgeStyle: 'bg-amber-50/80 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-900/50',
            hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-700/60',
            onClick: () => navigate('/admin/employees')
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
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Overview</h1>
                    <p className="text-slate-500 mt-2">
                        One view for your complete office setup, teams, and development delivery.
                    </p>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.name}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -3 }}
                        transition={{ delay: index * 0.05, duration: 0.25, ease: "easeOut" }}
                        onClick={card.onClick}
                        className={`group relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md ${card.hoverBorder} transition-all duration-200 cursor-pointer select-none`}
                    >
                        {/* Top Row: Icon + Status Tag */}
                        <div className="flex items-center justify-between">
                            <div className={`w-11 h-11 rounded-xl ${card.iconStyle} flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}>
                                <card.icon className="h-5 w-5" />
                            </div>

                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${card.badgeStyle}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                                {card.badgeText}
                            </span>
                        </div>

                        {/* Metric Counter */}
                        <div className="mt-4">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                {card.value}
                            </span>
                        </div>

                        {/* Title & Subtext */}
                        <div className="mt-1">
                            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
                                {card.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {card.subtext}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions & System Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <Card className="lg:col-span-2 dark:bg-[#070e28] dark:border-[#121c42]">
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
                            className="flex items-start space-x-4 p-4 rounded-xl border border-slate-200 dark:border-[#14235a] hover:border-blue-900/40 dark:hover:border-sky-500/50 bg-white/70 dark:bg-[#091338] hover:bg-blue-50/40 dark:hover:bg-[#0d1c52] transition-all text-left group shadow-xs cursor-pointer"
                        >
                            <div className="p-3 bg-blue-50 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300 rounded-xl group-hover:scale-105 transition-transform border border-blue-900/10 dark:border-blue-800/40">
                                <Briefcase className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-950 dark:group-hover:text-sky-300 transition-colors">
                                    Manage Departments
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Create, edit or organize company divisions
                                </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-500 group-hover:text-blue-900 dark:group-hover:text-sky-300 group-hover:translate-x-0.5 transition-all self-center" />
                        </button>

                        <button
                            onClick={() => navigate('/admin/employees')}
                            className="flex items-start space-x-4 p-4 rounded-xl border border-slate-200 dark:border-[#14235a] hover:border-blue-900/40 dark:hover:border-sky-500/50 bg-white/70 dark:bg-[#091338] hover:bg-blue-50/40 dark:hover:bg-[#0d1c52] transition-all text-left group shadow-xs cursor-pointer"
                        >
                            <div className="p-3 bg-sky-50 text-blue-950 dark:bg-blue-950/60 dark:text-sky-300 rounded-xl group-hover:scale-105 transition-transform border border-blue-950/10 dark:border-blue-900/40">
                                <Users className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-950 dark:group-hover:text-sky-300 transition-colors">
                                    Manage Employees
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Onboard colleagues, assign roles and credentials
                                </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-300 dark:text-slate-500 group-hover:text-blue-950 dark:group-hover:text-sky-300 group-hover:translate-x-0.5 transition-all self-center" />
                        </button>
                    </div>
                </Card>

                {/* System Status / Health */}
                <Card className="dark:bg-[#070e28] dark:border-[#121c42]">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-950/50 dark:text-emerald-400">
                            <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Security & Health</h3>
                            <p className="text-xs text-slate-400">Database & API Status</p>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2 text-xs">
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#091338] border border-slate-100 dark:border-[#14235a]">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Database</span>
                            <span className="flex items-center space-x-1.5 text-emerald-500 dark:text-emerald-400 font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                                <span>Atlas Connected</span>
                            </span>
                        </div>

                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#091338] border border-slate-100 dark:border-[#14235a]">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Auth Engine</span>
                            <span className="text-blue-600 dark:text-sky-400 font-semibold">JWT Active</span>
                        </div>

                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#091338] border border-slate-100 dark:border-[#14235a]">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Max Upload Limit</span>
                            <span className="text-slate-700 dark:text-slate-200 font-semibold">2000 MB</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
