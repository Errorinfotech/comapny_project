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
    Shield,
    Sparkles
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const adminSections = [
        {
            title: 'Overview',
            items: [
                { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
                { name: 'All Projects', path: '/admin/projects', icon: FolderOpen },
            ]
        },
        {
            title: 'Organization',
            items: [
                { name: 'Departments', path: '/admin/departments', icon: Briefcase },
                { name: 'Employees', path: '/admin/employees', icon: Users },
            ]
        }
    ];

    const employeeSections = [
        {
            title: 'Workspace',
            items: [
                { name: 'My Workspace', path: '/dashboard', icon: LayoutDashboard },
                { name: 'Upload Project', path: '/upload', icon: PlusCircle },
                { name: 'Search Vault', path: '/search', icon: Search },
            ]
        }
    ];

    const sections = user?.role === 'admin' ? adminSections : employeeSections;

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 border-r border-[#121c42] flex flex-col z-30 transition-all duration-300 bg-[#060d24] text-white select-none">
            {/* Company Logo & Brand Header - Level matched with Navbar (h-16) */}
            <div className="h-16 px-5 flex items-center space-x-3 border-b border-[#121c42]/80 shrink-0">
                <div className="relative shrink-0">
                    <img
                        src="/error.jpeg"
                        alt="Error Infotech"
                        className="w-9 h-9 rounded-full object-contain bg-white p-0.5 shadow-md border border-white/20 hover:scale-105 transition-transform"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#060d24]" title="System Online" />
                </div>
                <div className="min-w-0 flex-1">
                    <span className="text-sm font-extrabold text-white tracking-tight truncate block leading-tight">
                        Error Infotech
                    </span>
                    <span className="text-[9.5px] text-cyan-400 uppercase tracking-widest font-bold block mt-0.5">
                        COMPANY PORTAL
                    </span>
                </div>
            </div>

            {/* Navigation Sections */}
            <nav className="flex-1 px-3.5 py-5 space-y-6 overflow-y-auto">
                {sections.map((section) => (
                    <div key={section.title} className="space-y-1">
                        <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {section.title}
                        </div>
                        {section.items.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/admin' || item.path === '/dashboard'}
                                className={({ isActive }) => `
                                    group relative flex items-center space-x-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200
                                    ${isActive
                                        ? 'bg-gradient-to-b from-[#32509a] to-[#233c74] text-white shadow-md shadow-[#233c74]/35'
                                        : 'text-slate-300 hover:text-white hover:bg-white/5'}
                                `}
                            >
                                <item.icon className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                                <span className="truncate">{item.name}</span>
                            </NavLink>
                        ))}
                    </div>
                ))}
            </nav>

            {/* User Profile Footer */}
            <div className="p-3 border-t border-[#121c42]/80 bg-[#060d24]">
                <div className="p-3 rounded-2xl bg-[#091333] border border-[#14214f] shadow-sm">
                    <div className="flex items-center space-x-3 mb-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#2563eb] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white truncate leading-tight">
                                {user?.username}
                            </p>
                            <span className="inline-block mt-0.5 text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#182859] text-blue-200">
                                {user?.role || 'user'}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="flex items-center space-x-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 transition-colors w-full pt-2 border-t border-[#14214f] cursor-pointer"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Log Out</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
