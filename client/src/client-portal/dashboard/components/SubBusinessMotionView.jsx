import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
    Briefcase, Check, ArrowLeft, ArrowRight, 
    Sparkles, Search, Layers, Loader2
} from 'lucide-react';
import { BUSINESS_SECTORS } from './HorizontalBusinessMotionView';

/**
 * SubBusinessMotionView (STEP 2)
 * Clean animated view of the selected business's sub-businesses.
 */
const SubBusinessMotionView = ({
    parentBusiness,
    subtypes = [],
    selectedSubtype,
    onSelectSubtype,
    onBackToBusinesses,
    configuredSubtypes = []
}) => {
    const [filterQuery, setFilterQuery] = useState('');
    const [clickedSub, setClickedSub] = useState(null);
    const [isZoomingToConfigure, setIsZoomingToConfigure] = useState(false);

    const sectorItem = BUSINESS_SECTORS.find(i => i.type === parentBusiness) || BUSINESS_SECTORS[0];
    const ParentIcon = sectorItem.icon;

    const filteredSubtypes = useMemo(() => {
        if (!filterQuery.trim()) return subtypes;
        return subtypes.filter(sub => sub.toLowerCase().includes(filterQuery.toLowerCase()));
    }, [subtypes, filterQuery]);

    const handleCardClick = (sub) => {
        if (isZoomingToConfigure) return;
        setClickedSub(sub);
        setIsZoomingToConfigure(true);

        setTimeout(() => {
            onSelectSubtype(sub);
        }, 380);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 1.06 }}
            animate={isZoomingToConfigure ? { opacity: 0, scale: 0.9, filter: 'blur(5px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, filter: 'blur(6px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full bg-white/95 dark:bg-[#070e28]/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-[#D9E8FA] dark:border-[#14235a] shadow-xl shadow-sky-950/5 relative select-none"
        >
            {/* Top Bar: Back Button & Selected Business Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-100 dark:border-[#14235a]/60">
                <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                    <button
                        type="button"
                        onClick={onBackToBusinesses}
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-slate-50 hover:bg-[#EDF6FF] dark:bg-[#0a1438] dark:hover:bg-[#101f56] text-[#2463EB] dark:text-sky-300 border border-[#D9E8FA] dark:border-[#14235a] text-xs font-bold transition-all cursor-pointer shadow-xs group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        <span>Back to Businesses</span>
                    </button>

                    <div className="h-6 w-px bg-slate-200 dark:bg-[#14235a] hidden sm:block" />

                    <div className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-2xl bg-[#EDF6FF] dark:bg-[#0c1a44] border border-[#D9E8FA] dark:border-[#14235a]">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-blue-600 text-white">
                            <ParentIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                        <span className="text-xs font-extrabold text-[#172B4D] dark:text-white">
                            {parentBusiness}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold bg-white dark:bg-[#070e28] px-2 py-0.5 rounded-lg border border-slate-200/80 dark:border-[#14235a]">
                            {subtypes.length} Sub-Businesses
                        </span>
                    </div>
                </div>

                {/* Subtype Filter Input */}
                {subtypes.length > 4 && (
                    <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                            placeholder="Filter sub-businesses..."
                            className="w-full pl-8 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0a1438] border border-slate-200 dark:border-[#14235a] text-xs font-medium text-[#172B4D] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2463EB]"
                        />
                    </div>
                )}
            </div>

            {/* Section Heading */}
            <div className="max-w-2xl mb-7 space-y-1">
                <h3 
                    className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#0f1d40] dark:text-white tracking-[-0.03em] leading-tight"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    Choose Your Sub-Business
                </h3>
                <p 
                    className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 font-medium"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                    Select a sub-business under <span className="font-bold text-[#2463EB] dark:text-sky-300">{parentBusiness}</span> to configure client deliverables.
                </p>
            </div>

            {/* Clean Sub-Business Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredSubtypes.map((sub, idx) => {
                    const isSelected = sub === clickedSub;
                    const isConfigured = configuredSubtypes.includes(sub);

                    return (
                        <motion.div
                            key={sub}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.03 }}
                            whileHover={!isZoomingToConfigure ? { y: -5, scale: 1.02 } : {}}
                            whileTap={!isZoomingToConfigure ? { scale: 0.98 } : {}}
                            onClick={() => handleCardClick(sub)}
                            className={`p-5 rounded-3xl text-left cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between border group shadow-sm ${
                                isSelected
                                    ? 'bg-gradient-to-br from-[#2463EB] to-[#1d4ed8] text-white border-blue-400 shadow-xl shadow-[#2463EB]/40 ring-4 ring-blue-400/50 scale-103 z-10'
                                    : 'bg-white dark:bg-[#070e28] text-[#172B4D] dark:text-white border-[#D9E8FA] dark:border-[#14235a] hover:border-[#2463EB] hover:shadow-xl hover:shadow-[#2463EB]/15'
                            }`}
                        >
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                                        isSelected
                                            ? 'bg-white/20 text-white shadow-inner'
                                            : 'bg-[#EDF6FF] dark:bg-[#0a1438] text-[#2463EB] dark:text-sky-400 group-hover:bg-[#2463EB] group-hover:text-white shadow-xs'
                                    }`}>
                                        <Briefcase className="w-6 h-6 stroke-[2]" />
                                    </div>

                                    {isSelected ? (
                                        <div className="w-6 h-6 rounded-full bg-white text-[#2463EB] flex items-center justify-center shadow-xs">
                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                        </div>
                                    ) : isConfigured ? (
                                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span>Live</span>
                                        </span>
                                    ) : null}
                                </div>

                                <h4 className={`text-base font-extrabold leading-snug line-clamp-2 ${
                                    isSelected ? 'text-white' : 'text-[#172B4D] dark:text-white group-hover:text-[#2463EB] transition-colors'
                                }`}>
                                    {sub}
                                </h4>
                            </div>

                            <div className={`mt-5 pt-3.5 border-t flex items-center justify-between text-xs font-bold uppercase tracking-wider ${
                                isSelected
                                    ? 'border-white/20 text-white'
                                    : 'border-slate-100 dark:border-[#14235a]/60 text-[#2463EB] dark:text-sky-400'
                            }`}>
                                <span>{isSelected ? 'Opening...' : 'Select'}</span>
                                <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                                    isSelected ? 'bg-white/15 text-white' : 'bg-slate-50 dark:bg-[#0a1438] text-slate-400 group-hover:bg-[#2463EB] group-hover:text-white group-hover:translate-x-1 shadow-2xs'
                                }`}>
                                    {isSelected ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {filteredSubtypes.length === 0 && (
                <div className="py-12 text-center text-xs text-[#7185A3] dark:text-slate-400">
                    No sub-businesses match your search "{filterQuery}"
                </div>
            )}
        </motion.div>
    );
};

export default SubBusinessMotionView;
