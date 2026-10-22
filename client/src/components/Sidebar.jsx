import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Badge } from '@/components/ui';
import {
    LayoutDashboard,
    FolderOpen,
    Users,
    LogOut,
    Briefcase,
    PlusCircle,
    Search,
    Shield
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const adminLinks = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Departments', path: '/admin/departments', icon: Briefcase },
        { name: 'Employees', path: '/admin/employees', icon: Users },
        { name: 'All Projects', path: '/admin/projects', icon: FolderOpen },
    ];

    const employeeLinks = [
        { name: 'My Workspace', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Search', path: '/search', icon: Search },
        { name: 'Upload Project', path: '/upload', icon: PlusCircle },
    ];

    const links = user?.role === 'admin' ? adminLinks : employeeLinks;

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 glass-panel border-r border-slate-200 dark:border-slate-800/80 flex flex-col z-30 transition-all duration-300">
            {/* Logo / Brand Header */}
            <div className="p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                        <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <span className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight block">DevVault</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold block">Company Portal</span>
                    </div>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
                <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Menu
                </div>

                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => `
                            group relative flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                            ${isActive
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 font-semibold'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-indigo-600 dark:hover:text-white'}
                        `}
                    >
                        <link.icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                        <span>{link.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Profile Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
                <div className="flex items-center space-x-3 p-2 rounded-xl mb-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                            {user?.username}
                        </p>
                        <div className="mt-0.5">
                            <Badge variant={user?.role === 'admin' ? 'primary' : 'default'} size="sm">
                                {user?.role || 'user'}
                            </Badge>
                        </div>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center justify-center space-x-2 w-full px-3 py-2 text-xs font-semibold rounded-lg text-slate-500 dark:text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-all duration-200"
                >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Log Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
