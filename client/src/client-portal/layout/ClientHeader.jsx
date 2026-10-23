import React from 'react';
import { Building2, ShieldCheck, Sun, Moon, LogOut, ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ClientRobotMascot from './ClientRobotMascot';

const ClientHeader = ({ 
    clientBusinessName = "Client Workspace", 
    clientSubtype = "General Deliverables", 
    isAdmin = false,
    onExitClientPortal
}) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const toggleTheme = () => {
        const isDark = document.documentElement.classList.contains('dark');
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/90 dark:bg-[#060c22]/90 border-b border-sky-100/90 dark:border-[#121c44] transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                {/* Brand & Client Identification */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#32509a] to-[#38bdf8] p-0.5 shadow-md shadow-blue-600/20">
                            <div className="w-full h-full bg-[#070e28] rounded-[14px] flex items-center justify-center text-white font-black text-sm tracking-tighter">
                                EI
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    Error Infotech
                                </h1>
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 border border-sky-200/60 dark:border-[#14235a]">
                                    Client Portal
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 font-medium truncate max-w-[200px] sm:max-w-xs">
                                {clientBusinessName} <span className="text-slate-300 dark:text-slate-600">•</span> {clientSubtype}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Center / Mascot */}
                <div className="hidden lg:flex items-center">
                    <ClientRobotMascot statusText="Portal System Active" />
                </div>

                {/* Right Actions */}
                <div className="flex items-center space-x-2.5 sm:space-x-3">
                    {/* Admin Back to Office Switch */}
                    {isAdmin && (
                        <button
                            type="button"
                            onClick={() => navigate('/office')}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-[#0a1438] dark:hover:bg-[#122055] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#14235a] transition-all cursor-pointer"
                            title="Return to Internal Office Workspace"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Back to Office</span>
                        </button>
                    )}

                    {/* Dark/Light Theme Button */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0a1438] border border-transparent hover:border-slate-200 dark:hover:border-[#14235a] transition-all cursor-pointer"
                        title="Toggle Theme"
                    >
                        <Sun className="w-4 h-4 text-amber-400 hidden dark:block" />
                        <Moon className="w-4 h-4 text-slate-600 block dark:hidden" />
                    </button>

                    {/* Verified Security Badge */}
                    <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/40 text-[11px] font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span>SSL Encrypted</span>
                    </div>

                    {/* Logout Button */}
                    <button
                        type="button"
                        onClick={() => {
                            if (onExitClientPortal) onExitClientPortal();
                            logout();
                        }}
                        className="p-2 rounded-xl text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-transparent hover:border-rose-200/60 dark:hover:border-rose-900/40 transition-all cursor-pointer"
                        title="Sign Out of Client Portal"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default ClientHeader;
