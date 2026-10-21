import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, User, LogOut, Settings, Shield, Building2, Briefcase } from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const menuRef = useRef(null);

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
    const buttonText = isOffice ? 'Client Dev' : 'Office Dev';
    const ButtonIcon = isOffice ? Briefcase : Building2;

    return (
        <header className="h-16 bg-white/70 dark:bg-[#020617]/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 flex items-center justify-between px-8 transition-colors">
            <div className="flex-1">
                <div className="max-w-md relative group">
                    <Search className={`absolute left-4 top-2.5 h-4 w-4 transition-colors ${searchQuery ? 'text-indigo-500' : 'text-slate-400'}`} />
                    <input
                        type="text"
                        placeholder="Search projects, employees..."
                        className="w-full bg-slate-100 dark:bg-slate-900/50 border border-transparent focus:border-indigo-500/50 rounded-full py-2 pl-11 pr-4 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:outline-none transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                {user && user.role !== 'client' && (
                    <NavLink
                        to={targetPath}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold transition-all border bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20 hover:bg-indigo-700`}
                    >
                        <ButtonIcon className="h-4 w-4" />
                        <span>{buttonText}</span>
                    </NavLink>
                )}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className={`h-10 w-10 rounded-2xl flex items-center justify-center transition-all ${showProfileMenu
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/40'
                            : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:scale-105'
                            }`}
                    >
                        <User className="h-6 w-6" />
                    </button>

                    <AnimatePresence>
                        {showProfileMenu && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-[1.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-2 overflow-hidden"
                            >
                                <div className="p-4 border-b border-slate-50 dark:border-slate-800 mb-2">
                                    <p className="text-sm font-bold truncate">{user?.username}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{user?.role} Account</p>
                                </div>
                                <div className="space-y-1">
                                    <button
                                        onClick={() => { navigate('/profile'); setShowProfileMenu(false); }}
                                        className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-all group"
                                    >
                                        <Shield className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
                                        <span>Security Settings</span>
                                    </button>
                                    <button
                                        onClick={() => { navigate('/profile'); setShowProfileMenu(false); }}
                                        className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium transition-all group"
                                    >
                                        <Settings className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
                                        <span>Preferences</span>
                                    </button>
                                    <button
                                        onClick={() => { logout(); setShowProfileMenu(false); }}
                                        className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium text-red-600 transition-all group"
                                    >
                                        <LogOut className="h-4 w-4 text-red-400 group-hover:text-red-600" />
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
