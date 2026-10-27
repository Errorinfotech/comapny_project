import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Globe, ShieldCheck, ArrowUpRight, Copy, Check, 
    Edit3, Plus, Trash2, Save, X, Sparkles, Layers,
    ExternalLink, CheckCircle2, Clock, ArrowLeft, Building2, Briefcase
} from 'lucide-react';

/**
 * DeliverablesStudio (STAGE 4)
 * Dedicated Digital Workspace: "Configure Client Deliverables"
 * - Clear Back button to return to Stage 3 (Sub-Businesses)
 * - Full context breadcrumb: [Parent Business] > [Sub-Business]
 * - Live Deployments Vault: "Open Portal", "Copy Link", Status indicators
 * - Admin Configuration Studio: Add Client, Edit URLs, Save Deliverables via API, Cancel
 */
const DeliverablesStudio = ({
    selectedType,
    selectedSubtype,
    clients = [],
    isAdmin = false,
    onSaveDeliverables,
    isSaving = false,
    onBackToSubtypes,
    onBackToBusinesses
}) => {
    const [copiedIdx, setCopiedIdx] = useState(null);
    const [isConfigMode, setIsConfigMode] = useState(false);
    const [formRows, setFormRows] = useState([]);
    const [statusMessage, setStatusMessage] = useState(null);

    const handleCopy = (link, idx) => {
        if (!link) return;
        navigator.clipboard.writeText(link);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    const handleOpenEdit = () => {
        if (clients && clients.length > 0) {
            setFormRows(clients.map(c => ({
                businessName: c.businessName || '',
                link: c.link || '',
                userId: c.userId || ''
            })));
        } else {
            setFormRows([{ businessName: '', link: '', userId: '' }]);
        }
        setIsConfigMode(true);
    };

    const handleAddRow = () => {
        setFormRows([...formRows, { businessName: '', link: '', userId: '' }]);
    };

    const handleRemoveRow = (index) => {
        const updated = [...formRows];
        updated.splice(index, 1);
        setFormRows(updated);
    };

    const handleChangeRow = (index, field, value) => {
        const updated = [...formRows];
        updated[index][field] = value;
        setFormRows(updated);
    };

    const handleSave = async () => {
        if (!onSaveDeliverables) return;
        const validClients = formRows.filter(r => r.businessName.trim() || r.link.trim());
        const success = await onSaveDeliverables(validClients);
        if (success) {
            setIsConfigMode(false);
            setStatusMessage("Deliverables saved successfully!");
            setTimeout(() => setStatusMessage(null), 3000);
        }
    };

    return (
        <motion.section
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92, filter: 'blur(4px)' }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="w-full bg-white/95 dark:bg-[#070e28]/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-[#D9E8FA] dark:border-[#14235a] shadow-xl shadow-sky-950/5 relative overflow-hidden"
        >
            {/* Top Navigation & Context Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-100 dark:border-[#14235a]/60">
                <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                    <button
                        type="button"
                        onClick={onBackToSubtypes}
                        className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-slate-50 hover:bg-[#EDF6FF] dark:bg-[#0a1438] dark:hover:bg-[#101f56] text-[#2463EB] dark:text-sky-300 border border-[#D9E8FA] dark:border-[#14235a] text-xs font-bold transition-all cursor-pointer shadow-2xs group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        <span>Back to Sub-Businesses</span>
                    </button>

                    <div className="h-6 w-px bg-slate-200 dark:bg-[#14235a] hidden sm:block" />

                    {/* Breadcrumb Context */}
                    <div className="flex items-center space-x-2 text-xs">
                        <span 
                            onClick={onBackToBusinesses}
                            className="font-medium text-slate-500 hover:text-[#2463EB] cursor-pointer transition-colors"
                        >
                            {selectedType}
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">/</span>
                        <span className="font-extrabold text-[#2463EB] dark:text-sky-300 bg-[#EDF6FF] dark:bg-[#0c1a44] px-2.5 py-1 rounded-xl border border-[#D9E8FA] dark:border-[#14235a]">
                            {selectedSubtype}
                        </span>
                    </div>
                </div>

                <div className="flex items-center space-x-2.5">
                    {statusMessage && (
                        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{statusMessage}</span>
                        </div>
                    )}

                    {isAdmin && !isConfigMode && (
                        <button
                            type="button"
                            onClick={handleOpenEdit}
                            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#EDF6FF] hover:bg-[#D9EBFF] dark:bg-[#0a1438] dark:hover:bg-[#101f56] text-[#2463EB] dark:text-sky-300 border border-[#D9E8FA] dark:border-[#14235a] text-xs font-bold transition-all cursor-pointer shadow-2xs"
                        >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>{clients.length > 0 ? 'Edit Deliverables' : 'Configure Deliverables'}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Workspace Title & Overview */}
            <div className="max-w-2xl mb-7">
                <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#EDF6FF] dark:bg-[#0c1a44] text-[#2463EB] dark:text-sky-300 text-[11px] font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3 h-3" />
                    <span>Stage 3 of 3: Deliverables Studio</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] dark:text-white tracking-tight">
                    Configure Client Deliverables
                </h3>
                <p className="text-xs sm:text-sm text-[#7185A3] dark:text-slate-400 mt-1.5 leading-relaxed">
                    Live production portals and digital solutions running for <span className="font-semibold text-[#2463EB] dark:text-sky-300">{selectedSubtype}</span> under {selectedType}.
                </p>
            </div>

            {/* View Mode: Live Deployments Grid */}
            {!isConfigMode ? (
                <div>
                    {clients.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {clients.map((c, idx) => {
                                const formattedLink = c.link ? (c.link.startsWith('http') ? c.link : `https://${c.link}`) : '#';
                                const isCopied = copiedIdx === idx;

                                return (
                                    <motion.div
                                        key={c._id || idx}
                                        whileHover={{ y: -3, scale: 1.01 }}
                                        className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#0a1438]/80 border border-slate-200/80 dark:border-[#14235a] hover:border-[#2463EB]/50 dark:hover:border-sky-500/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                                    >
                                        <div className="flex items-start justify-between gap-3 mb-4">
                                            <div className="flex items-center space-x-3 truncate">
                                                <div className="w-11 h-11 rounded-2xl bg-white dark:bg-[#070e28] border border-[#D9E8FA] dark:border-[#14235a] text-[#2463EB] dark:text-sky-400 flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-[#2463EB] group-hover:text-white transition-all">
                                                    <Globe className="w-5 h-5" />
                                                </div>
                                                <div className="truncate">
                                                    <div className="flex items-center space-x-1.5">
                                                        <h4 className="text-sm font-bold text-[#172B4D] dark:text-white truncate">
                                                            {c.businessName || `${selectedSubtype} Client Portal`}
                                                        </h4>
                                                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                                                    </div>
                                                    <p className="text-xs text-[#7185A3] dark:text-slate-400 font-mono truncate mt-0.5">
                                                        {c.link || 'URL not specified'}
                                                    </p>
                                                </div>
                                            </div>

                                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 shrink-0">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span>Active Production</span>
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-[#14235a]">
                                            <div className="flex items-center space-x-1.5 text-[11px] text-[#7185A3] dark:text-slate-400 font-medium">
                                                <span>Status:</span>
                                                <span className="text-[#16A879] font-bold">Configured & Live</span>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                {c.link && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopy(c.link, idx)}
                                                        className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#070e28] text-slate-600 dark:text-slate-300 hover:text-[#2463EB] border border-slate-200 dark:border-[#14235a] transition-all cursor-pointer shadow-2xs"
                                                        title="Copy URL"
                                                    >
                                                        {isCopied ? (
                                                            <>
                                                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                                                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="w-3.5 h-3.5" />
                                                                <span>Copy</span>
                                                            </>
                                                        )}
                                                    </button>
                                                )}

                                                <a
                                                    href={formattedLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#2463EB] hover:bg-[#1d4ed8] text-white text-xs font-bold transition-all shadow-sm shadow-[#2463EB]/25 cursor-pointer"
                                                >
                                                    <span>Open Portal</span>
                                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-dashed border-[#D9E8FA] dark:border-[#14235a] p-12 text-center bg-slate-50/50 dark:bg-[#070e28]/50">
                            <div className="w-12 h-12 rounded-2xl bg-[#EDF6FF] dark:bg-[#0a1438] text-[#2463EB] dark:text-sky-400 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h4 className="text-sm font-bold text-[#172B4D] dark:text-white">
                                No live client portal configured yet for {selectedSubtype}
                            </h4>
                            <p className="text-xs text-[#7185A3] dark:text-slate-400 mt-1 max-w-md mx-auto">
                                The enterprise environment for {selectedSubtype} is ready. Add client deployment links below to activate live access.
                            </p>
                            {isAdmin && (
                                <button
                                    type="button"
                                    onClick={handleOpenEdit}
                                    className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#2463EB] to-[#1d4ed8] text-white text-xs font-bold shadow-md shadow-[#2463EB]/25 transition-all cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Configure First Client URL</span>
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                /* Edit Mode: Studio Configuration Drawer / Inline Form */
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-50/90 dark:bg-[#0a1438] border border-[#D9E8FA] dark:border-[#14235a] space-y-5"
                >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 dark:border-[#14235a]">
                        <div>
                            <h4 className="text-sm font-bold text-[#172B4D] dark:text-white">
                                Deliverables Studio: <span className="text-[#2463EB]">{selectedSubtype}</span>
                            </h4>
                            <p className="text-[11px] text-[#7185A3] dark:text-slate-400">
                                Configure production URLs and client entities for this deliverable unit.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddRow}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white dark:bg-[#070e28] hover:bg-[#EDF6FF] dark:hover:bg-[#101f56] text-[#2463EB] dark:text-sky-300 text-xs font-bold border border-slate-200 dark:border-[#14235a] transition-all cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Another Client</span>
                        </button>
                    </div>

                    {/* Client Rows */}
                    <div className="space-y-3">
                        {formRows.map((row, idx) => (
                            <div 
                                key={idx}
                                className="flex flex-col sm:flex-row gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#070e28] border border-slate-200/80 dark:border-[#14235a]"
                            >
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7185A3] dark:text-slate-400 mb-1">
                                        Client / Business Name
                                    </label>
                                    <input
                                        type="text"
                                        value={row.businessName}
                                        onChange={(e) => handleChangeRow(idx, 'businessName', e.target.value)}
                                        placeholder="e.g. Acme Enterprises"
                                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0a1438] border border-slate-200 dark:border-[#14235a] text-xs font-medium text-[#172B4D] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#2463EB]"
                                    />
                                </div>

                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#7185A3] dark:text-slate-400 mb-1">
                                        Production URL (Link)
                                    </label>
                                    <input
                                        type="url"
                                        value={row.link}
                                        onChange={(e) => handleChangeRow(idx, 'link', e.target.value)}
                                        placeholder="https://client-portal.example.com"
                                        className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#0a1438] border border-slate-200 dark:border-[#14235a] text-xs font-medium text-[#172B4D] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#2463EB] font-mono"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleRemoveRow(idx)}
                                    className="self-end sm:self-center sm:mt-5 p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                                    title="Delete client row"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2.5 pt-3 border-t border-slate-200/70 dark:border-[#14235a]">
                        <button
                            type="button"
                            disabled={isSaving}
                            onClick={handleSave}
                            className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2463EB] to-[#1d4ed8] text-white text-xs font-bold shadow-md shadow-[#2463EB]/25 hover:from-[#1d4ed8] hover:to-[#1e40af] transition-all cursor-pointer disabled:opacity-50"
                        >
                            <Save className="w-3.5 h-3.5" />
                            <span>{isSaving ? 'Saving Deliverables...' : 'Save Deliverables'}</span>
                        </button>

                        <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => setIsConfigMode(false)}
                            className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 dark:bg-[#070e28] dark:hover:bg-[#101f56] text-[#172B4D] dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-[#14235a] transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </motion.div>
            )}
        </motion.section>
    );
};

export default DeliverablesStudio;
