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
            cardBg: 'bg-gradient-to-br from-white via-[#f5f3ff] to-[#ede9fe] dark:from-[#130f2c] dark:via-[#191438] dark:to-[#070514] border-[#ddd6fe] dark:border-[#382b6b]',
            iconBg: 'bg-[#6366f1] shadow-md shadow-[#6366f1]/30 text-white',
            badgeText: 'Active Units',
            badgeStyle: 'bg-[#ede9fe] dark:bg-[#251b47] text-[#4f46e5] dark:text-[#a5b4fc] border-[#c7d2fe] dark:border-[#372b66]',
            glowColor: 'bg-[#6366f1]',
            hoverBorder: 'hover:border-[#6366f1]/70 dark:hover:border-[#6366f1]/60',
            hoverShadow: 'hover:shadow-xl hover:shadow-[#6366f1]/15',
            onClick: () => navigate('/admin/departments')
        },
        {
            name: 'Active Development Units',
            value: stats.totalProjects,
            subtext: 'In Production',
            icon: FolderOpen,
            cardBg: 'bg-gradient-to-br from-white via-[#f0f9ff] to-[#e0f2fe] dark:from-[#081827] dark:via-[#0c2236] dark:to-[#040c14] border-[#bae6fd] dark:border-[#134063]',
            iconBg: 'bg-[#0ea5e9] shadow-md shadow-[#0ea5e9]/30 text-white',
            badgeText: '100% Active Work',
            badgeStyle: 'bg-[#e0f2fe] dark:bg-[#0c2b45] text-[#0284c7] dark:text-[#7dd3fc] border-[#7dd3fc] dark:border-[#184d78]',
            glowColor: 'bg-[#0ea5e9]',
            hoverBorder: 'hover:border-[#0ea5e9]/70 dark:hover:border-[#0ea5e9]/60',
            hoverShadow: 'hover:shadow-xl hover:shadow-[#0ea5e9]/15',
            onClick: () => navigate('/admin/projects')
        },
        {
            name: 'Office Workforce',
            value: stats.totalEmployees,
            subtext: 'Assigned Employees',
            icon: Users,
            cardBg: 'bg-gradient-to-br from-white via-[#fffbeb] to-[#fef3c7] dark:from-[#211a07] dark:via-[#2b220a] dark:to-[#0a0802] border-[#fde68a] dark:border-[#524114]',
            iconBg: 'bg-[#f59e0b] shadow-md shadow-[#f59e0b]/30 text-white',
            badgeText: 'Full Capacity',
            badgeStyle: 'bg-[#fef3c7] dark:bg-[#382b0b] text-[#d97706] dark:text-[#fcd34d] border-[#fcd34d] dark:border-[#5e4712]',
            glowColor: 'bg-[#f59e0b]',
            hoverBorder: 'hover:border-[#f59e0b]/70 dark:hover:border-[#f59e0b]/60',
            hoverShadow: 'hover:shadow-xl hover:shadow-[#f59e0b]/15',
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

                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => navigate('/admin/projects')}
                        className="inline-flex items-center justify-center space-x-2 bg-gradient-to-b from-[#32509a] to-[#233c74] hover:from-[#3859aa] hover:to-[#264180] text-white px-5 py-3 rounded-2xl transition-all shadow-md shadow-[#233c74]/30 font-bold cursor-pointer"
                    >
                        <Plus className="h-5 w-5" />
                        <span>New</span>
                    </button>
                </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, index) => (
                    <motion.div
                        key={card.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -6, scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        transition={{ delay: index * 0.08, duration: 0.35, ease: "easeOut" }}
                        onClick={card.onClick}
                        className={`group relative overflow-hidden rounded-[26px] p-6 border ${card.cardBg} ${card.hoverBorder} ${card.hoverShadow} shadow-xs transition-all duration-300 cursor-pointer select-none`}
                    >
                        {/* Soft Ambient Radial Corner Glow on Hover */}
                        <div
                            className={`pointer-events-none absolute -right-6 -top-6 w-28 h-28 rounded-full blur-2xl opacity-15 group-hover:opacity-40 transition-opacity duration-300 ${card.glowColor}`}
                        />

                        {/* Top Row: Vibrant Solid Circular Icon + Status Tag */}
                        <div className="relative z-10 flex items-center justify-between">
                            <div className={`w-12 h-12 rounded-full ${card.iconBg} flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110`}>
                                <card.icon className="h-6 w-6 drop-shadow-sm" />
                            </div>

                            <span className={`px-2.5 py-1 rounded-full text-[10.5px] font-bold border shadow-2xs ${card.badgeStyle}`}>
                                {card.badgeText}
                            </span>
                        </div>

                        {/* Metric Counter */}
                        <div className="relative z-10 mt-4 flex items-baseline">
                            <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                                {card.value}
                            </span>
                        </div>

                        {/* Title & Subtext */}
                        <div className="relative z-10 mt-1">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                                {card.name}
                            </h3>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
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
