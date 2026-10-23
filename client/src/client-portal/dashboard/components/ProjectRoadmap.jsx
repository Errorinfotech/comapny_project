import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ShieldCheck, Rocket, Layers } from 'lucide-react';

const milestones = [
    {
        title: "1. Discovery & SOW",
        detail: "Scope specifications & business requirements signed off.",
        status: "completed",
        date: "Completed"
    },
    {
        title: "2. UI/UX Design System",
        detail: "Interactive prototypes, design tokens & brand alignment.",
        status: "completed",
        date: "Verified"
    },
    {
        title: "3. Full-Stack Engineering",
        detail: "Backend APIs, database indexing & responsive frontend.",
        status: "completed",
        date: "Production Ready"
    },
    {
        title: "4. Live Deployment",
        detail: "Cloud CDN hosting, verified SSL & continuous monitoring.",
        status: "active",
        date: "Live in Production"
    }
];

const ProjectRoadmap = ({ overallProgress = 100 }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="rounded-3xl p-6 sm:p-7 bg-white/95 dark:bg-[#070e28]/95 backdrop-blur-2xl border border-sky-100/90 dark:border-[#14235a] shadow-lg shadow-sky-950/5"
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                        <Layers className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                        <span>Project Lifecycle Roadmap</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Continuous tracking of deliverables & SLA performance
                    </p>
                </div>

                <div className="flex items-center space-x-2.5 self-start sm:self-auto">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Completion:</span>
                    <span className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-sky-300 border border-blue-200/60 dark:border-[#14235a] text-xs font-mono font-extrabold shadow-2xs">
                        {overallProgress}%
                    </span>
                </div>
            </div>

            {/* Animated Progress Bar Track */}
            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-[#0c1846] overflow-hidden mb-6">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${overallProgress}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-[#32509a] via-[#38bdf8] to-emerald-500 shadow-sm"
                />
            </div>

            {/* Milestone Steps Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {milestones.map((m, idx) => {
                    const isCompleted = m.status === 'completed';
                    const isActive = m.status === 'active';
                    return (
                        <motion.div 
                            key={idx}
                            whileHover={{ y: -3, scale: 1.02 }}
                            transition={{ duration: 0.15 }}
                            className={`p-4 rounded-2xl border transition-all cursor-default ${
                                isActive 
                                    ? 'bg-blue-50/50 dark:bg-[#0d1d52] border-blue-300 dark:border-sky-500/70 shadow-xs ring-1 ring-sky-400/20' 
                                    : 'bg-slate-50/70 dark:bg-[#0a1438]/60 border-slate-200/60 dark:border-[#14235a]/60 hover:border-slate-300 dark:hover:border-[#1e3478]'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                                    {m.title}
                                </span>
                                {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : (
                                    <span className="relative flex h-2 w-2 shrink-0">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed mb-2">
                                {m.detail}
                            </p>
                            <div className="text-[10px] font-bold font-mono text-blue-600 dark:text-sky-400">
                                {m.date}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default ProjectRoadmap;
