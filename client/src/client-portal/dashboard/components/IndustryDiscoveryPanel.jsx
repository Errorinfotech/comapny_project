import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Compass, Check, Layers, Building2 } from 'lucide-react';
import { INDUSTRY_METADATA } from './Industry3DCarousel';

/**
 * IndustryDiscoveryPanel
 * Compact "Explore Industries" panel that stays in two-way sync with the 3D carousel.
 * Allows quick searching, keyboard accessibility, and immediate selection.
 */
const IndustryDiscoveryPanel = ({
    industries = [],
    selectedIndustry,
    onSelectIndustry,
    configuredCounts = {}
}) => {
    const [search, setSearch] = useState('');

    const filteredIndustries = useMemo(() => {
        if (!search.trim()) return industries;
        return industries.filter(ind => 
            ind.toLowerCase().includes(search.toLowerCase())
        );
    }, [industries, search]);

    return (
        <div className="w-full bg-white/95 dark:bg-[#070e28]/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-[#D9E8FA] dark:border-[#14235a] shadow-lg shadow-sky-950/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-[#14235a]/60">
                <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#EDF6FF] dark:bg-[#0c1a44] text-[#2463EB] dark:text-sky-400 flex items-center justify-center border border-[#D9E8FA] dark:border-[#14235a]">
                        <Compass className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-[#172B4D] dark:text-white uppercase tracking-wider">
                            Explore Industries & Ecosystems
                        </h3>
                        <p className="text-[11px] text-[#7185A3] dark:text-slate-400">
                            {industries.length} Commercial sectors available
                        </p>
                    </div>
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search industry..."
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0a1438] border border-slate-200 dark:border-[#14235a] text-xs font-medium text-[#172B4D] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2463EB] transition-all"
                    />
                </div>
            </div>

            {/* Grid of Industry Pills / Compact Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {filteredIndustries.map((ind) => {
                    const isSelected = ind === selectedIndustry;
                    const meta = INDUSTRY_METADATA[ind] || { icon: Building2 };
                    const Icon = meta.icon;
                    const count = configuredCounts[ind] || 0;

                    return (
                        <button
                            key={ind}
                            type="button"
                            onClick={() => onSelectIndustry(ind)}
                            className={`p-3 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between group cursor-pointer border ${
                                isSelected
                                    ? 'bg-[#2463EB] text-white border-blue-500 shadow-md shadow-[#2463EB]/25 ring-2 ring-blue-300 dark:ring-blue-700/50'
                                    : 'bg-slate-50/80 hover:bg-[#EDF6FF] dark:bg-[#0a1438]/80 dark:hover:bg-[#0f1d52] text-[#172B4D] dark:text-slate-200 border-slate-200/80 dark:border-[#14235a] hover:border-[#2463EB]/40'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                                    isSelected 
                                        ? 'bg-white/20 text-white' 
                                        : 'bg-white dark:bg-[#070e28] text-[#2463EB] dark:text-sky-400 border border-slate-100 dark:border-[#14235a]'
                                }`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                {isSelected ? (
                                    <div className="w-5 h-5 rounded-full bg-white text-[#2463EB] flex items-center justify-center shadow-xs">
                                        <Check className="w-3 h-3 stroke-[3]" />
                                    </div>
                                ) : count > 0 ? (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                        {count}
                                    </span>
                                ) : null}
                            </div>

                            <span className={`text-xs font-bold truncate block ${
                                isSelected ? 'text-white' : 'text-[#172B4D] dark:text-white'
                            }`}>
                                {ind}
                            </span>
                        </button>
                    );
                })}
            </div>

            {filteredIndustries.length === 0 && (
                <div className="py-8 text-center text-xs text-[#7185A3] dark:text-slate-400">
                    No industries match your search "{search}"
                </div>
            )}
        </div>
    );
};

export default IndustryDiscoveryPanel;
