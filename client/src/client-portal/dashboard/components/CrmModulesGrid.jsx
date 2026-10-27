import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ReceiptText, Boxes, MessageSquare, Users, BarChart3, ShieldCheck,
    FolderLock, Zap, Flame, PackageSearch, Smartphone, Store, ShieldAlert,
    LayoutGrid, Gift, Truck, LineChart, Barcode, Receipt, Scissors,
    Share2, Network, Stethoscope, Pill, Microscope, BedDouble, Lock,
    Building, CalendarCheck, HardHat, PieChart, Sparkles, CheckCircle2,
    Layers, Cpu, ArrowRight
} from 'lucide-react';

const iconMap = {
    FolderLock, ReceiptText, MessageSquare, UsersCheck: Users, BarChart3, ShieldCheck,
    Zap, Flame, PackageSearch, Smartphone, Store, ShieldAlert,
    LayoutGrid, Boxes, Gift, Truck, LineChart,
    Barcode, Receipt, Scissors, Share2, Network,
    Users, Stethoscope, Pill, Microscope, BedDouble, Lock,
    Building, CalendarCheck, HardHat, PieChart, Layers, Cpu
};

/**
 * Interactive Spotlight Card
 * Tracks local cursor position and casts an interactive specular glow inside the card.
 */
const SpotlightModuleCard = ({ module, index, total }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0, opacity: 0 });
    const IconComponent = iconMap[module.icon] || Layers;

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            opacity: 1
        });
    };

    const handleMouseLeave = () => {
        setMousePos(prev => ({ ...prev, opacity: 0 }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.4, 
                delay: index * 0.07,
                type: "spring",
                stiffness: 260,
                damping: 20
            }}
            whileHover={{ y: -6, scale: 1.01 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative rounded-3xl p-6 bg-white/95 dark:bg-[#070e28]/95 backdrop-blur-2xl border border-sky-100/90 dark:border-[#14235a] shadow-lg shadow-sky-950/5 hover:border-sky-300 dark:hover:border-sky-500/80 hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-default"
        >
            {/* Interactive Cursor Spotlight Glow */}
            <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-300 rounded-3xl"
                style={{
                    opacity: mousePos.opacity,
                    background: `radial-gradient(circle 240px at ${mousePos.x}px ${mousePos.y}px, rgba(56, 189, 248, 0.12), transparent 80%)`,
                }}
            />

            {/* Top Row: Module Icon & Tag */}
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <motion.div 
                        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-[#0a1438] border border-sky-100 dark:border-[#14235a] flex items-center justify-center text-blue-700 dark:text-sky-300 group-hover:bg-gradient-to-b group-hover:from-[#32509a] group-hover:to-[#233c74] group-hover:text-white transition-all duration-300 shadow-xs"
                    >
                        <IconComponent className="w-5 h-5" />
                    </motion.div>
                    
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 dark:bg-[#0d1d52] text-slate-600 dark:text-sky-200 border border-slate-200/60 dark:border-[#14235a] shadow-xs">
                        {module.tag || `Unit 0${index + 1}`}
                    </span>
                </div>

                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-300 transition-colors">
                    {module.title}
                </h4>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {module.desc}
                </p>
            </div>

            {/* Actionable Feature Bullets with Animated Checkmarks */}
            <div className="relative z-10 mt-5 pt-4 border-t border-slate-100 dark:border-[#14235a]/70 space-y-2">
                {module.bullets?.map((b, bIdx) => (
                    <motion.div 
                        key={bIdx} 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index * 0.05) + (bIdx * 0.03) }}
                        className="flex items-center space-x-2 text-[11px] font-medium text-slate-600 dark:text-slate-300"
                    >
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="truncate">{b}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

const CrmModulesGrid = ({ intelligence, subtype = '' }) => {
    if (!intelligence || !intelligence.modules) return null;

    return (
        <div className="space-y-5">
            {/* Header with Luxury Brand Accent & Animated Pulse */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-100 dark:border-[#14235a]/60">
                <div className="flex items-center space-x-3">
                    <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="w-10 h-10 rounded-2xl bg-gradient-to-b from-[#32509a] to-[#233c74] text-white flex items-center justify-center shadow-md shadow-[#233c74]/20 shrink-0"
                    >
                        <Cpu className="w-5 h-5 text-sky-300" />
                    </motion.div>
                    <div>
                        <div className="flex items-center space-x-2">
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Core CRM & ERP Architecture Modules
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 border border-blue-200/60 dark:border-[#14235a]">
                                6 Production Units
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            Tailor-engineered functional workflow modules for <span className="font-bold text-slate-700 dark:text-slate-200">{subtype}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-xl border border-emerald-200/60 dark:border-emerald-800/40 self-start sm:self-auto shadow-2xs">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span>Active Production Engine</span>
                </div>
            </div>

            {/* 6 Spotlight Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {intelligence.modules.map((m, idx) => (
                    <SpotlightModuleCard
                        key={`${subtype}-${idx}`}
                        module={m}
                        index={idx}
                        total={intelligence.modules.length}
                    />
                ))}
            </div>
        </div>
    );
};

export default CrmModulesGrid;
