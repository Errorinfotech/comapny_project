import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    FolderOpen,
    Users,
    LogOut,
    Briefcase,
    PlusCircle,
    Search
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
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-20 transition-colors">
            <div className="p-6 flex items-center space-x-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Company Wroks</span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) => `
                            flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                            ${isActive
                                ? 'bg-indigo-600/10 text-indigo-500 font-medium'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-white'}
                        `}
                    >
                        <link.icon className="h-5 w-5" />
                        <span>{link.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center space-x-3 px-4 py-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-white font-bold">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-slate-700 dark:text-white truncate">{user?.username}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 capitalize">{user?.role}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
                >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
