import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, ShieldCheck, Sparkles, Building2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ClientRobotMascot from '../layout/ClientRobotMascot';

const ClientLoginGateway = ({ onLoginSuccess, onBypassLogin }) => {
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(username, password);
            if (onLoginSuccess) onLoginSuccess();
            else if (onBypassLogin) onBypassLogin();
        } catch (err) {
            console.error("Login failed", err);
            setError(err.response?.data?.message || 'Invalid client portal credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-tr from-[#e6f1fc] via-[#edf5fd] to-[#f6faff] dark:from-[#060b19] dark:via-[#091126] dark:to-[#060a17] transition-colors">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-400/10 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="relative z-10 w-full max-w-md rounded-3xl p-8 sm:p-9 bg-white/90 dark:bg-[#070e28]/90 backdrop-blur-2xl border border-sky-100/90 dark:border-[#14235a] shadow-2xl shadow-sky-950/10"
            >
                {/* Robot Mascot Header */}
                <div className="flex flex-col items-center text-center mb-6">
                    <ClientRobotMascot statusText="Welcome to Client Gateway" className="mb-2" />
                    
                    <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-sky-50 dark:bg-blue-950/50 text-blue-700 dark:text-sky-300 border border-sky-200/60 dark:border-[#14235a] text-[10.5px] font-bold uppercase tracking-wider mt-2 mb-1.5">
                        <Sparkles className="w-3 h-3 text-sky-500" />
                        <span>Client Secure Portal</span>
                    </div>

                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Client Workspace Access
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs">
                        Sign in to view your live deliverables, milestones, and dedicated client services.
                    </p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-300 font-medium text-center"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                            Client Username / ID
                        </label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your client username..."
                                className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 dark:bg-[#0a1438] border border-slate-200 dark:border-[#14235a] text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                            Access Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-50 dark:bg-[#0a1438] border border-slate-200 dark:border-[#14235a] text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-b from-[#32509a] to-[#233c74] hover:from-[#2a4484] hover:to-[#1c305c] text-white font-bold text-xs shadow-lg shadow-[#233c74]/25 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
                    >
                        {loading ? (
                            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Sign In to Client Portal</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Direct 1-Click Access Button */}
                {(onBypassLogin || onLoginSuccess) && (
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-[#14235a]/60">
                        <button
                            type="button"
                            onClick={() => {
                                if (onLoginSuccess) onLoginSuccess();
                                else if (onBypassLogin) onBypassLogin();
                            }}
                            className="w-full py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-[#0a1438] dark:hover:bg-[#101f56] text-blue-700 dark:text-sky-300 border border-sky-200/70 dark:border-[#14235a] text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-2xs"
                        >
                            <span>Instant Access: CA Workspace (SH chartered accountant)</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                <div className="mt-6 flex items-center justify-center space-x-2 text-[11px] text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Protected by Error Infotech Enterprise Security</span>
                </div>
            </motion.div>
        </div>
    );
};

export default ClientLoginGateway;
