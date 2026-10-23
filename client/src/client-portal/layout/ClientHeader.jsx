import React from 'react';
import { Sun, Moon, LogOut, Building2, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

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
        <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/95 dark:bg-[#060c22]/95 border-b border-[#DCE8F7] dark:border-[#121c44] shadow-xs transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
                
                {/* Brand & Client Identification (Official Logo + Deep Navy Typography) */}
                <div className="flex items-center space-x-3.5">
                    <div className="relative group cursor-pointer" onClick={() => navigate('/client-portal')}>
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-200/90 dark:border-slate-800 flex items-center justify-center p-0.5 group-hover:ring-2 group-hover:ring-[#1E3A8A] transition-all">
                            <img 
                                src="/error.jpeg" 
                                alt="Error Infotech" 
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center space-x-2">
                            <h1 
                                className="text-base sm:text-lg font-black tracking-tight text-[#0f1d40] dark:text-white"
                                style={{ fontFamily: "'Outfit', sans-serif" }}
                            >
                                Error Infotech
                            </h1>
                            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 dark:bg-[#0c1a44] text-[#1E3A8A] dark:text-sky-300 border border-blue-200/70 dark:border-[#14235a]">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Portal</span>
                            </span>
                        </div>
                        <p 
                            className="text-xs text-[#5A6D87] dark:text-slate-400 font-medium truncate max-w-[190px] sm:max-w-xs"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                            {clientBusinessName} <span className="text-slate-300 dark:text-slate-600">&bull;</span> {clientSubtype}
                        </p>
                    </div>
                </div>


                {/* Right Action Controls */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                    {/* Interactive Workspace Toggle Pill (Office / Client) */}
                    {user && user.role !== 'client' && (
                        <div 
                            className="inline-flex items-center p-1 rounded-full bg-[#ebf3fc] dark:bg-[#08112d] border border-sky-200/80 dark:border-[#14235a] shadow-inner select-none relative"
                            title="Switch Workspace: Office or Client Portal"
                        >
                            {/* Office Segment */}
                            <button
                                type="button"
                                onClick={() => navigate(user?.role === 'admin' ? '/admin/office' : '/office')}
                                className="relative z-10 flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 cursor-pointer"
                            >
                                <Building2 className="h-3.5 w-3.5 text-sky-700 dark:text-sky-400" />
                                <span>Office</span>
                            </button>

                            {/* Client Segment (Active on Client Portal) */}
                            <button
                                type="button"
                                onClick={() => navigate('/client-portal')}
                                className="relative z-10 flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition-colors duration-200 cursor-pointer"
                            >
                                <motion.div
                                    layoutId="portalActivePillClient"
                                    className="absolute inset-0 rounded-full bg-gradient-to-b from-[#32509a] to-[#233c74] shadow-sm shadow-[#233c74]/40 -z-10"
                                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                                />
                                <Briefcase className="h-3.5 w-3.5 text-white" />
                                <span>Client</span>
                            </button>
                        </div>
                    )}

                    {/* Dark/Light Theme Button */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="w-9 h-9 rounded-xl text-slate-500 hover:text-[#0f1d40] dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#0a1438] border border-slate-200/70 dark:border-[#14235a] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                        title="Toggle Theme"
                    >
                        <Sun className="w-4 h-4 text-amber-400 hidden dark:block" />
                        <Moon className="w-4 h-4 text-[#0f1d40] block dark:hidden" />
                    </button>

                    {/* Sign Out Button Only */}
                    <button
                        type="button"
                        onClick={() => {
                            if (onExitClientPortal) onExitClientPortal();
                            logout();
                        }}
                        className="w-9 h-9 rounded-xl text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200/70 dark:border-[#14235a] hover:border-rose-200/80 dark:hover:border-rose-900/40 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
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
