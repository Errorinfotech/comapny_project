import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';

/**
 * ConfirmDeleteModal
 * Enterprise-grade, reusable confirmation modal for dangerous deletion actions.
 * 
 * @param {boolean} isOpen - Controls visibility
 * @param {function} onClose - Closes the modal without action
 * @param {function} onConfirm - Callback to execute the deletion (can be async)
 * @param {string} title - Heading for the modal (e.g. "Delete Project?")
 * @param {string} itemName - Name of the item being deleted (e.g. "Royal Kitchenware")
 * @param {string} message - Warning text explaining the impact
 * @param {string} confirmText - Button label (default: "Delete Permanently")
 * @param {string} cancelText - Cancel button label (default: "Cancel")
 * @param {boolean} loading - Optional external loading state
 */
export function ConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirm Deletion',
    itemName = '',
    message = 'Are you sure you want to delete this? This action cannot be undone and will permanently remove all associated data.',
    confirmText = 'Delete Permanently',
    cancelText = 'Cancel',
    loading = false
}) {
    const [internalLoading, setInternalLoading] = useState(false);

    const isBusy = loading || internalLoading;

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen && !isBusy) {
                onClose?.();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, isBusy, onClose]);

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleConfirm = async () => {
        if (isBusy) return;
        try {
            setInternalLoading(true);
            await onConfirm?.();
        } catch (err) {
            console.error('Error during deletion:', err);
        } finally {
            setInternalLoading(false);
        }
    };

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => {
                            if (!isBusy) onClose?.();
                        }}
                        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
                    />

                    {/* Modal Window */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 16 }}
                        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-full max-w-md bg-white dark:bg-[#0b132e] border border-red-200/80 dark:border-red-900/40 rounded-[2rem] shadow-2xl shadow-red-950/30 overflow-hidden z-10 p-6 sm:p-7 select-none"
                    >
                        {/* Background Ambient Danger Glow */}
                        <div className="absolute -top-16 -right-16 w-48 h-48 bg-red-500/10 dark:bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

                        {/* Top Close Button */}
                        <button
                            type="button"
                            onClick={() => {
                                if (!isBusy) onClose?.();
                            }}
                            disabled={isBusy}
                            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors disabled:opacity-50 cursor-pointer"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="flex flex-col items-center text-center space-y-4">
                            {/* Glowing Danger Icon */}
                            <div className="relative">
                                <div className="absolute inset-0 rounded-2xl bg-red-500/25 blur-lg animate-pulse" />
                                <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 flex items-center justify-center text-white shadow-xl shadow-red-600/30">
                                    <Trash2 className="h-8 w-8 stroke-[2.2]" />
                                </div>
                            </div>

                            {/* Headings */}
                            <div className="space-y-1.5 max-w-sm">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                    {title}
                                </h3>

                                {itemName && (
                                    <div className="inline-block px-3 py-1 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200/80 dark:border-red-900/50 text-red-700 dark:text-rose-300 font-bold text-xs truncate max-w-xs mt-1">
                                        "{itemName}"
                                    </div>
                                )}

                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed pt-1">
                                    {message}
                                </p>
                            </div>

                            {/* Security Notice Pill */}
                            <div className="w-full flex items-center space-x-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 text-[11px] font-semibold text-left">
                                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                                <span>Caution: This action is irreversible.</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="w-full flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!isBusy) onClose?.();
                                    }}
                                    disabled={isBusy}
                                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    {cancelText}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleConfirm}
                                    disabled={isBusy}
                                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 transition-all disabled:opacity-60 flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                                >
                                    {isBusy ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Deleting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-3.5 w-3.5" />
                                            <span>{confirmText}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}

export default ConfirmDeleteModal;
