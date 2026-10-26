import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, User, LogOut, Shield, Building2, Briefcase, Sun, Moon, Command } from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const menuRef = useRef(null);
    const searchInputRef = useRef(null);

    // Sync theme on mount (default to light mode)
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const isDark = savedTheme === 'dark';
        
        setIsDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
            if (!savedTheme) {
                localStorage.setItem('theme', 'light');
            }
        }
    }, []);

    // Global keyboard shortcut: Ctrl+K or Cmd+K to focus search
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const toggleTheme = () => {
        const nextDark = !isDarkMode;
        setIsDarkMode(nextDark);
        if (nextDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            const searchPath = user?.role === 'admin' ? '/admin/search' : '/search';
            navigate(`${searchPath}?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const isOffice = location.pathname.includes('/office') || location.pathname.startsWith('/admin') || location.pathname === '/dashboard' || location.pathname === '/upload';
    const isClient = location.pathname.includes('/client');
    const officePath = user?.role === 'admin' ? '/admin/office' : '/office';
    const clientPath = '/client-portal';

    return (
        <header className="h-16 sticky top-0 z-40 flex items-center justify-between px-6 sm:px-8 border-b border-sky-100/80 dark:border-[#121c42] bg-white dark:bg-[#060d24] transition-colors">
            {/* Left: Brand Identity + Search */}
            <div className="flex items-center space-x-4 sm:space-x-6 flex-1 max-w-2xl">
                <div
                    className="flex items-center space-x-2.5 cursor-pointer group select-none shrink-0"
                    onClick={() => navigate(officePath)}
                    title="Go to Office Structure"
                >
                    <div className="relative shrink-0">
                        <img
                            src="/error.jpeg"
                            alt="Error Infotech"
                            className="w-9 h-9 rounded-full object-contain bg-white p-0.5 shadow-md border border-slate-200 dark:border-white/20 group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#060d24]" title="System Online" />
                    </div>
                    <div className="hidden md:block">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight truncate block leading-tight">
                            Error Infotech
                        </span>
                        <span className="text-[9.5px] text-blue-600 dark:text-cyan-400 uppercase tracking-widest font-bold block mt-0.5">
                            COMPANY PORTAL
                        </span>
                    </div>
                </div>

                {/* Spotlight Search Bar */}
                <div className="flex-1 max-w-md">
                    <div className="relative group">
                        <Search className={`absolute left-4 top-2.5 h-4 w-4 transition-colors ${searchQuery ? 'text-sky-700 dark:text-sky-400' : 'text-slate-400 group-focus-within:text-sky-700 dark:group-focus-within:text-sky-400'}`} />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search projects, employees..."
                            className="w-full bg-[#edf4fb] dark:bg-[#0a1438] border border-sky-100/80 dark:border-[#14235a] focus:border-sky-300 dark:focus:border-sky-500 rounded-2xl py-2 pl-11 pr-16 text-xs font-medium focus:ring-2 focus:ring-sky-200/50 dark:focus:ring-sky-900/40 focus:bg-white dark:focus:bg-[#0e1d52] focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100 shadow-2xs"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                        <div className="absolute right-2.5 top-2 hidden sm:flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-white/90 dark:bg-[#0a1438] border border-sky-200/60 dark:border-[#14235a] text-[10px] font-semibold text-slate-400 dark:text-slate-400 pointer-events-none shadow-2xs">
                            <kbd>Ctrl</kbd>
                            <span>+</span>
                            <kbd>K</kbd>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions & Profile */}
            <div className="flex items-center space-x-3">
                {/* Interactive Workspace Toggle Pill */}
                {user && user.role !== 'client' && (
                    <div 
                        className="hidden sm:inline-flex items-center p-1 rounded-full bg-[#ebf3fc] dark:bg-[#08112d] border border-sky-200/80 dark:border-[#14235a] shadow-inner select-none relative"
                        title="Switch Workspace: Office or Client Portal"
                    >
                        {/* Office Segment */}
                        <button
                            type="button"
                            onClick={() => navigate(officePath)}
                            className={`relative z-10 flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                                isOffice
                                    ? 'text-white'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            {isOffice && (
                                <motion.div
                                    layoutId="portalActivePill"
                                    className="absolute inset-0 rounded-full bg-gradient-to-b from-[#32509a] to-[#233c74] shadow-sm shadow-[#233c74]/40 -z-10"
                                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                                />
                            )}
                            <Building2 className={`h-3.5 w-3.5 transition-colors ${isOffice ? 'text-white' : 'text-sky-700 dark:text-sky-400'}`} />
                            <span>Office</span>
                        </button>

                        {/* Client Segment */}
                        <button
                            type="button"
                            onClick={() => navigate(clientPath)}
                            className={`relative z-10 flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                                isClient
                                    ? 'text-white'
                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            {isClient && (
                                <motion.div
                                    layoutId="portalActivePill"
                                    className="absolute inset-0 rounded-full bg-gradient-to-b from-[#32509a] to-[#233c74] shadow-sm shadow-[#233c74]/40 -z-10"
                                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                                />
                            )}
                            <Briefcase className={`h-3.5 w-3.5 transition-colors ${isClient ? 'text-white' : 'text-sky-700 dark:text-sky-400'}`} />
                            <span>Client</span>
                        </button>
                    </div>
                )}

                {/* Dark/Light Mode Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-xl text-slate-600 hover:text-sky-950 dark:text-slate-300 dark:hover:text-white hover:bg-sky-50 dark:hover:bg-[#0a1438] transition-colors cursor-pointer border border-transparent hover:border-sky-200/60 dark:hover:border-[#14235a]"
                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                </button>

                {/* Creative Profile Badge Trigger (No dropdown arrow) */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className={`group flex items-center space-x-3 pl-2 pr-3.5 py-1.5 rounded-2xl transition-all duration-200 cursor-pointer border ${
                            showProfileMenu
                                ? 'bg-sky-50 dark:bg-[#0d1c4e] border-sky-300 dark:border-sky-500 shadow-sm ring-2 ring-sky-400/20'
                                : 'bg-gradient-to-r from-sky-50/70 via-white to-sky-50/40 dark:from-[#0a1438] dark:via-[#08102e] dark:to-[#0a1438] border-sky-200/70 dark:border-[#14235a] hover:border-sky-300 dark:hover:border-sky-500 hover:shadow-sm'
                        }`}
                        title="Account & Profile Settings"
                    >
                        <div className="relative shrink-0">
                            <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-sky-400 to-blue-600 shadow-xs group-hover:scale-105 transition-transform">
                                <img
                                    src="/error.jpeg"
                                    alt="Error Infotech"
                                    className="w-full h-full rounded-full object-contain bg-white"
                                />
                            </div>
                            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-xs" />
                        </div>

                        <div className="text-left hidden sm:block">
                            <div className="flex items-center space-x-1.5">
                                <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight tracking-tight">
                                    {user?.username || 'admin'}
                                </p>
                                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-sky-100 dark:bg-sky-950/90 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60 uppercase">
                                    {user?.role || 'Admin'}
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-400 dark:text-slate-400 font-medium leading-tight mt-0.5">
                                Error Infotech
                            </p>
                        </div>
                    </button>

                    <AnimatePresence>
                        {showProfileMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-2.5 w-60 bg-white dark:bg-[#070e28] rounded-2xl shadow-2xl shadow-slate-900/25 dark:shadow-black/70 border border-slate-200 dark:border-[#14235a] p-2 overflow-hidden z-[100]"
                            >
                                <div className="p-3 border-b border-sky-100/80 dark:border-[#14235a] mb-1 flex items-center space-x-3">
                                    <img
                                        src="/error.jpeg"
                                        alt="Error Infotech"
                                        className="w-8 h-8 rounded-lg object-contain bg-white border border-slate-200 p-0.5 shrink-0"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{user?.username}</p>
                                        <p className="text-[10px] font-semibold text-sky-700 dark:text-sky-400 uppercase tracking-wider mt-0.5">
                                            {user?.role} • Error Infotech
                                        </p>
                                    </div>
                                </div>
                                <div className="space-y-0.5">
                                    <button
                                        onClick={() => { navigate('/profile'); setShowProfileMenu(false); }}
                                        className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-sky-50 dark:hover:bg-[#0d1c4e] text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors group cursor-pointer"
                                    >
                                        <Shield className="h-3.5 w-3.5 text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400" />
                                        <span>Security & Profile</span>
                                    </button>
                                    <button
                                        onClick={() => { logout(); setShowProfileMenu(false); }}
                                        className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium text-rose-600 dark:text-rose-400 transition-colors group cursor-pointer"
                                    >
                                        <LogOut className="h-3.5 w-3.5 text-rose-400" />
                                        <span>Log Out</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
