import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, User, LogOut, Shield, Building2, Briefcase, Sun, Moon } from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const menuRef = useRef(null);

    // Sync theme on mount
    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark') || 
            localStorage.getItem('theme') === 'dark' || 
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        setIsDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
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

    const isOffice = location.pathname.includes('/office');
    const officePath = user?.role === 'admin' ? '/admin/office' : '/office';
    const clientPath = user?.role === 'admin' ? '/admin/client' : '/client';
    
    // Toggle target path: if in office, go to client, else go to office
    const targetPath = isOffice ? clientPath : officePath;
    const buttonText = isOffice ? 'Client Portal' : 'Office Vault';
    const ButtonIcon = isOffice ? Briefcase : Building2;

    return (
        <header className="h-16 glass-panel sticky top-0 z-20 flex items-center justify-between px-8 transition-colors">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
                <div className="relative group">
                    <Search className={`absolute left-3.5 top-2.5 h-4 w-4 transition-colors ${searchQuery ? 'text-indigo-500' : 'text-slate-400'}`} />
                    <input
                        type="text"
                        placeholder="Search projects, employees..."
                        className="w-full bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-800 dark:text-slate-100"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
            </div>

            {/* Actions & Profile */}
            <div className="flex items-center space-x-3">
                {/* Switcher Button for Office / Client */}
                {user && user.role !== 'client' && (
                    <NavLink
                        to={targetPath}
                        className="hidden sm:inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border border-indigo-500/30 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400"
                    >
                        <ButtonIcon className="h-3.5 w-3.5" />
                        <span>{buttonText}</span>
                    </NavLink>
                )}

                {/* Dark/Light Mode Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                </button>

                {/* Profile Avatar Dropdown */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all ${
                            showProfileMenu
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 ring-2 ring-indigo-500/50'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:scale-105'
                        }`}
                    >
                        <User className="h-4 w-4" />
                    </button>

                    <AnimatePresence>
                        {showProfileMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-2.5 w-56 glass-card rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 overflow-hidden z-50"
                            >
                                <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 mb-1">
                                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{user?.username}</p>
                                    <p className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider mt-0.5">{user?.role} Account</p>
                                </div>
                                <div className="space-y-0.5">
                                    <button
                                        onClick={() => { navigate('/profile'); setShowProfileMenu(false); }}
                                        className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors group"
                                    >
                                        <Shield className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-500" />
                                        <span>Security & Profile</span>
                                    </button>
                                    <button
                                        onClick={() => { logout(); setShowProfileMenu(false); }}
                                        className="w-full flex items-center space-x-2.5 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-medium text-rose-600 dark:text-rose-400 transition-colors group"
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
