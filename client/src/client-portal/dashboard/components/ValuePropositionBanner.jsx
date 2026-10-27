import React from 'react';
import { motion } from 'framer-motion';
import { Award, Zap, ShieldCheck, Headphones, Sparkles } from 'lucide-react';

const valuePillars = [
    {
        icon: Sparkles,
        title: "100% Custom Tailored",
        subtitle: "Built to match your unique operational workflow, no rigid templates."
    },
    {
        icon: Zap,
        title: "GST & E-Invoice Native",
        subtitle: "1-Click automated GSTR-1/3B exports, e-way bills & thermal barcoding."
    },
    {
        icon: ShieldCheck,
        title: "0% Commission & Data Privacy",
        subtitle: "Complete ownership of your client records on your private cloud database."
    },
    {
        icon: Headphones,
        title: "Direct Engineering SLA",
        subtitle: "Dedicated relationship manager & priority customization support."
    }
];

const ValuePropositionBanner = () => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="rounded-3xl p-6 sm:p-7 bg-white/95 dark:bg-[#070e28]/95 backdrop-blur-2xl border border-sky-100/90 dark:border-[#14235a] shadow-lg shadow-sky-950/5"
        >
            <div className="flex items-center space-x-2 mb-4">
                <Award className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 dark:text-white">
                    The Error Infotech Enterprise Advantage
                </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {valuePillars.map((p, i) => {
                    const Icon = p.icon;
                    return (
                        <motion.div 
                            key={i} 
                            whileHover={{ y: -4, scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className="p-4 rounded-2xl bg-slate-50/70 dark:bg-[#0a1438]/60 border border-slate-200/60 dark:border-[#14235a]/60 hover:border-sky-300 dark:hover:border-sky-500/60 shadow-xs cursor-default group"
                        >
                            <motion.div 
                                whileHover={{ rotate: [0, -10, 10, 0] }}
                                className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-[#0d1d52] text-blue-600 dark:text-sky-300 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs"
                            >
                                <Icon className="w-4 h-4" />
                            </motion.div>
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-300 transition-colors">
                                {p.title}
                            </h5>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                {p.subtitle}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default ValuePropositionBanner;
