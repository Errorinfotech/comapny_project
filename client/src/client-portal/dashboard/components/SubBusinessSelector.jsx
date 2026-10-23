import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Briefcase, Check, ArrowLeft, ArrowRight, 
    Sparkles, Search, Layers, Loader2 
} from 'lucide-react';
import { INDUSTRY_METADATA } from './Industry3DCarousel';

/**
 * SubBusinessSelector (STAGE 3)
 * Screen titled: "Choose Your Sub-Business"
 * - Clear "← Back to Businesses" control
 * - Selected Business Hero Badge & context
 * - Staggered entrance animation for sub-business cards
 * - Hover elevation, glow and icon micro-motion
 * - Click transition: Highlight card, blue electric sweep, checkmark pop, then smooth transition to Configuration Studio
 */
const SubBusinessSelector = ({
    parentBusiness,
    subtypes = [],
    selectedSubtype,
    onConfirmSubtype,
    onBackToBusinesses,
    configuredSubtypes = []
}) => {
    const [filterQuery, setFilterQuery] = useState('');
    const [animatingSub, setAnimatingSub] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const meta = INDUSTRY_METADATA[parentBusiness] || { icon: Briefcase, tagline: "Enterprise Solutions" };
    const ParentIcon = meta.icon;

    const filteredSubtypes = useMemo(() => {
        if (!filterQuery.trim()) return subtypes;
        return subtypes.filter(sub => sub.toLowerCase().includes(filterQuery.toLowerCase()));
    }, [subtypes, filterQuery]);

    const handleCardClick = (sub) => {
        if (isTransitioning) return;
        setAnimatingSub(sub);
        setIsTransitioning(true);

        // Sequence: electric glow sweep (350ms) -> trigger transition to Configuration Studio
        setTimeout(() => {
            if (onConfirmSubtype) {
                onConfirmSubtype(sub);
            }
        }, 380);
    };

    // Staggered animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 16, scale: 0.96 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="w-full bg-white/95 dark:bg-[#070e28]/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-[#D9E8FA] dark:border-[#14235a] shadow-xl shadow-sky-950/5 relative overflow-hidden"
        >
            {/* Top Navigation Bar: Back Button & Context Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-100 dark:border-[#14235a]/60">
                <div className="flex items-center space-x-3">
                    <button
                        type="button"
                        onClick={onBackToBusinesses}
                        className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-slate-50 hover:bg-[#EDF6FF] dark:bg-[#0a1438] dark:hover:bg-[#101f56] text-[#2463EB] dark:text-sky-300 border border-[#D9E8FA] dark:border-[#14235a] text-xs font-bold transition-all cursor-pointer shadow-2xs group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        <span>Back to Businesses</span>
                    </button>

                    <div className="h-6 w-px bg-slate-200 dark:bg-[#14235a] hidden sm:block" />

                    <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#EDF6FF] dark:bg-[#0c1a44] border border-[#D9E8FA] dark:border-[#14235a]">
                        <ParentIcon className="w-4 h-4 text-[#2463EB] dark:text-sky-400" />
                        <span className="text-xs font-extrabold text-[#172B4D] dark:text-white">
                            {parentBusiness}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                            ({subtypes.length} Units)
                        </span>
                    </div>
                </div>

                {/* Subtype Search if more than 6 options */}
                {subtypes.length > 6 && (
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

            {/* Section Header */}
            <div className="max-w-2xl mb-7">
                <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#EDF6FF] dark:bg-[#0c1a44] text-[#2463EB] dark:text-sky-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3 h-3" />
                    <span>Stage 2 of 3: Deliverable Unit</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] dark:text-white tracking-tight">
                    Choose Your Sub-Business
                </h3>
                <p className="text-xs sm:text-sm text-[#7185A3] dark:text-slate-400 mt-1.5 leading-relaxed">
                    Select the specialized deliverable unit under <span className="font-semibold text-[#2463EB] dark:text-sky-300">{parentBusiness}</span> to enter its dedicated production workspace.
                </p>
            </div>

            {/* Staggered Animated Grid of Sub-Business Cards */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5"
            >
                {filteredSubtypes.map((sub) => {
                    const isSelected = sub === (animatingSub || selectedSubtype);
                    const isConfigured = configuredSubtypes.includes(sub);
                    const isCurrentAnimating = sub === animatingSub;

                    return (
                        <motion.div
                            key={sub}
                            variants={cardVariants}
                            whileHover={!isTransitioning ? { y: -4, scale: 1.02 } : {}}
                            whileTap={!isTransitioning ? { scale: 0.98 } : {}}
                            onClick={() => handleCardClick(sub)}
                            className={`p-5 rounded-2xl text-left cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between border group ${
                                isCurrentAnimating
                                    ? 'bg-gradient-to-br from-[#2463EB] to-[#1d4ed8] text-white border-blue-400 shadow-xl shadow-[#2463EB]/40 ring-4 ring-blue-400/50'
                                    : isSelected
                                        ? 'bg-[#EDF6FF] dark:bg-[#0c1e54] border-[#2463EB] text-[#2463EB] dark:text-white shadow-md shadow-[#2463EB]/20 ring-2 ring-[#2463EB]/40'
                                        : 'bg-white dark:bg-[#0a1438] hover:bg-slate-50 dark:hover:bg-[#0f1d52] text-[#172B4D] dark:text-slate-200 border-slate-200/80 dark:border-[#14235a] hover:border-sky-300 dark:hover:border-sky-500/50 hover:shadow-md'
                            }`}
                        >
                            {/* Electric Glow Sweep Animation on Selection */}
                            {isCurrentAnimating && (
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '200%' }}
                                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                                />
                            )}

                            <div>
                                <div className="flex items-center justify-between mb-3.5">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                        isCurrentAnimating
                                            ? 'bg-white/20 text-white'
                                            : isSelected
                                                ? 'bg-[#2463EB] text-white shadow-xs'
                                                : 'bg-[#EDF6FF] dark:bg-[#070e28] text-[#2463EB] dark:text-sky-400 group-hover:scale-108'
                                    }`}>
                                        <Briefcase className="w-5 h-5" />
                                    </div>

                                    {isCurrentAnimating ? (
                                        <div className="w-6 h-6 rounded-full bg-white text-[#2463EB] flex items-center justify-center shadow-xs">
                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                        </div>
                                    ) : isConfigured ? (
                                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            <span>Active</span>
                                        </span>
                                    ) : null}
                                </div>

                                <h4 className={`text-sm font-extrabold leading-snug line-clamp-2 ${
                                    isCurrentAnimating ? 'text-white' : 'text-[#172B4D] dark:text-white'
                                }`}>
                                    {sub}
                                </h4>

                                <p className={`text-[11px] mt-1 line-clamp-2 ${
                                    isCurrentAnimating 
                                        ? 'text-blue-100' 
                                        : isSelected 
                                            ? 'text-[#2463EB] dark:text-sky-300' 
                                            : 'text-[#7185A3] dark:text-slate-400'
                                }`}>
                                    {isConfigured ? 'Production URLs live & accessible' : 'Configure client URLs & deliverables'}
                                </p>
                            </div>

                            <div className={`mt-4 pt-3 border-t flex items-center justify-between text-[11px] font-bold uppercase tracking-wider ${
                                isCurrentAnimating
                                    ? 'border-white/20 text-white'
                                    : 'border-slate-100 dark:border-[#14235a]/60 text-[#2463EB] dark:text-sky-400'
                            }`}>
                                <span>{isCurrentAnimating ? 'Entering Studio...' : 'Select Unit'}</span>
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-transform group-hover:translate-x-1 ${
                                    isCurrentAnimating ? 'bg-white/15 text-white' : 'bg-slate-50 dark:bg-[#070e28] text-slate-400'
                                }`}>
                                    {isCurrentAnimating ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <ArrowRight className="w-3 h-3" />
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {filteredSubtypes.length === 0 && (
                <div className="py-12 text-center text-xs text-[#7185A3] dark:text-slate-400">
                    No sub-businesses match your search "{filterQuery}"
                </div>
            )}
        </motion.section>
    );
};

export default SubBusinessSelector;
