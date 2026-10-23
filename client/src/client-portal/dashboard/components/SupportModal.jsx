import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, HelpCircle, CheckCircle, Mail, Phone } from 'lucide-react';

const SupportModal = ({ isOpen, onClose, clientName = "SH chartered accountant" }) => {
    const [subject, setSubject] = useState('');
    const [details, setDetails] = useState('');
    const [priority, setPriority] = useState('normal');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!subject.trim()) return;
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setSubject('');
            setDetails('');
            onClose();
        }, 1800);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="relative z-10 w-full max-w-lg rounded-3xl bg-white dark:bg-[#070e28] border border-sky-100 dark:border-[#14235a] shadow-2xl p-6 sm:p-7 overflow-hidden"
                >
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#14235a]/60">
                        <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-[#14235a] flex items-center justify-center text-blue-600 dark:text-sky-400">
                                <HelpCircle className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                    Direct Change Request
                                </h3>
                                <p className="text-xs text-slate-400">Error Infotech Engineering Support</p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#0a1438] transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {submitted ? (
                        <div className="py-12 text-center space-y-3">
                            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Ticket Created Successfully</h4>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                Your account manager and assigned engineers at Error Infotech have received your request.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                    Subject / Feature Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="e.g. Update company profile details or new page requirement"
                                    className="w-full rounded-xl p-3 bg-slate-50 dark:bg-[#0a1438] border border-slate-200 dark:border-[#14235a] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                        Priority
                                    </label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full rounded-xl p-3 bg-slate-50 dark:bg-[#0a1438] border border-slate-200 dark:border-[#14235a] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="normal">Normal Priority</option>
                                        <option value="urgent">Urgent / Blocker</option>
                                        <option value="enhancement">Design Enhancement</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                        Originating Client
                                    </label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={clientName}
                                        className="w-full rounded-xl p-3 bg-slate-100 dark:bg-[#08102e] border border-slate-200 dark:border-[#14235a] text-xs font-bold text-slate-600 dark:text-slate-300 cursor-not-allowed truncate"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                    Description & Specifications
                                </label>
                                <textarea
                                    rows="3"
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    placeholder="Please describe the requested change or report the issue in detail..."
                                    className="w-full rounded-xl p-3 bg-slate-50 dark:bg-[#0a1438] border border-slate-200 dark:border-[#14235a] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-[#14235a]/60 flex items-center justify-between">
                                <div className="text-[11px] text-slate-400">
                                    SLA Response: <span className="font-semibold text-slate-600 dark:text-slate-300">&lt; 4 Hours</span>
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#0a1438] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-gradient-to-b from-[#32509a] to-[#233c74] hover:from-[#284282] hover:to-[#1b2f5b] text-white text-xs font-bold shadow-md shadow-[#233c74]/20 transition-all cursor-pointer"
                                    >
                                        <Send className="w-3.5 h-3.5" />
                                        <span>Submit Ticket</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SupportModal;
