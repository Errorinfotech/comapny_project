import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, ArrowUpRight, Copy, Check, Globe, ShieldCheck } from 'lucide-react';

const DeliverablesVault = ({ clients = [], subtype = '' }) => {
    const [copiedIdx, setCopiedIdx] = useState(null);

    const handleCopy = (link, idx) => {
        navigator.clipboard.writeText(link);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 2000);
    };

    if (!clients || clients.length === 0) {
        return null;
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="rounded-3xl p-6 sm:p-7 bg-white/95 dark:bg-[#070e28]/95 backdrop-blur-2xl border border-sky-100/90 dark:border-[#14235a] shadow-lg shadow-sky-950/5"
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                        <Link2 className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                        <span>Live Client Deployments & Proofs</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Verified active enterprise portals running in production for {subtype}
                    </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 dark:bg-blue-950/40 text-blue-700 dark:text-sky-300 border border-sky-200/60 dark:border-[#14235a] self-start sm:self-auto shadow-xs">
                    {clients.length} Active {clients.length === 1 ? 'Deployment' : 'Deployments'}
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clients.map((c, idx) => {
                    const formattedLink = c.link ? (c.link.startsWith('http') ? c.link : `https://${c.link}`) : '#';
                    const isCopied = copiedIdx === idx;
                    return (
                        <motion.div
                            key={c._id || idx}
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.25, delay: idx * 0.05 }}
                            whileHover={{ y: -4, scale: 1.01 }}
                            className="p-4 rounded-2xl bg-slate-50/70 dark:bg-[#0a1438]/80 border border-slate-200/70 dark:border-[#14235a] flex items-center justify-between gap-3 group hover:border-sky-300 dark:hover:border-sky-500/70 shadow-xs hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex items-center space-x-3 truncate">
                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#070e28] border border-sky-100 dark:border-[#14235a] flex items-center justify-center shrink-0 text-blue-600 dark:text-sky-400 group-hover:scale-108 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
                                    <Globe className="w-4 h-4" />
                                </div>
                                <div className="truncate">
                                    <div className="flex items-center space-x-1.5">
                                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                            {c.businessName || 'Production Portal'}
                                        </h4>
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                    </div>
                                    <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                                        {c.link || 'URL not specified'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-1.5 shrink-0">
                                {c.link && (
                                    <>
                                        <motion.button
                                            type="button"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleCopy(c.link, idx)}
                                            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-[#070e28] border border-transparent hover:border-slate-200 dark:hover:border-[#14235a] transition-all cursor-pointer shadow-xs"
                                            title="Copy Link to Clipboard"
                                        >
                                            <AnimatePresence mode="wait">
                                                {isCopied ? (
                                                    <motion.span
                                                        key="check"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        exit={{ scale: 0 }}
                                                    >
                                                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                                                    </motion.span>
                                                ) : (
                                                    <motion.span
                                                        key="copy"
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        exit={{ scale: 0 }}
                                                    >
                                                        <Copy className="w-3.5 h-3.5" />
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </motion.button>

                                        <motion.a
                                            href={formattedLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
                                        >
                                            <span>Open</span>
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </motion.a>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default DeliverablesVault;
