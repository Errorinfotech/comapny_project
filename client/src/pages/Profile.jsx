import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { motion } from 'framer-motion';
import { Shield, Settings, User, Key, Eye, EyeOff, Save, Check } from 'lucide-react';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [activeTab, setActiveTab] = useState('security');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Preferences State synced with document class
    const [preferences, setPreferences] = useState({
        darkMode: document.documentElement.classList.contains('dark'),
        animations: localStorage.getItem('animations') !== 'false'
    });

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Handle initial theme load
    useEffect(() => {
        if (preferences.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', preferences.darkMode);
    }, [preferences.darkMode]);

    useEffect(() => {
        localStorage.setItem('animations', preferences.animations);
    }, [preferences.animations]);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return alert('New passwords do not match');
        }

        setLoading(true);
        try {
            await api.post('/auth/update-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            alert('Security settings updated successfully');
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const togglePreference = (key) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="transition-colors duration-300">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
                <p className="text-slate-500 mt-2">Manage your security and platform preferences.</p>
            </div>

            <div className="flex space-x-1 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl w-fit border border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => setActiveTab('security')}
                    className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'security'
                        ? 'bg-white dark:bg-slate-800 shadow-lg shadow-indigo-500/5 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    <Shield className="h-4 w-4" />
                    <span>Security</span>
                </button>
                <button
                    onClick={() => setActiveTab('preferences')}
                    className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'preferences'
                        ? 'bg-white dark:bg-slate-800 shadow-lg shadow-indigo-500/5 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    <Settings className="h-4 w-4" />
                    <span>Preferences</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors">
                        <div className="h-24 w-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto text-white text-4xl font-bold shadow-lg shadow-indigo-500/40">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.username}</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1.5">{user?.role} Administrator</p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    {activeTab === 'security' ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-8 shadow-sm transition-colors"
                        >
                            <div className="flex items-center space-x-3 text-indigo-600 dark:text-indigo-400">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
                                    <Key className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold">Authentication Key</h3>
                            </div>

                            <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Master Secret (Current)</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            placeholder="••••••••••••"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                                            value={passwords.currentPassword}
                                            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-4 text-slate-400 hover:text-indigo-500"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">New Protocol Key</label>
                                        <input
                                            type="password"
                                            required
                                            placeholder="Enter new key"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                                            value={passwords.newPassword}
                                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Verify Protocol Key</label>
                                        <input
                                            type="password"
                                            required
                                            placeholder="Re-type new key"
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                                            value={passwords.confirmPassword}
                                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-50 group hover:-translate-y-1"
                                >
                                    <Save className="h-5 w-5 group-hover:scale-110 transition-all" />
                                    <span>{loading ? 'Re-protocoling...' : 'Update Authentication Secret'}</span>
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-8 shadow-sm transition-colors"
                        >
                            <div className="flex items-center space-x-3 text-indigo-600 dark:text-indigo-400">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
                                    <Settings className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold">System Preferences</h3>
                            </div>

                            <div className="space-y-4">
                                <div
                                    onClick={() => togglePreference('darkMode')}
                                    className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-indigo-500/50 transition-all"
                                >
                                    <div>
                                        <p className="font-bold text-lg text-slate-900 dark:text-white">Visual Theme</p>
                                        <p className="text-xs font-semibold text-slate-400">{preferences.darkMode ? 'Deep Sea Cyberpunk (Dark)' : 'Ocean Breeze (Light)'}</p>
                                    </div>
                                    <div className={`h-8 w-14 rounded-full p-1 transition-colors duration-300 flex items-center ${preferences.darkMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                        <motion.div
                                            layout
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 700, damping: 30 }}
                                            className={`h-6 w-6 bg-white rounded-full shadow-lg ${!preferences.darkMode ? 'ml-0' : 'ml-auto'}`}
                                        />
                                    </div>
                                </div>

                                <div
                                    onClick={() => togglePreference('animations')}
                                    className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-indigo-500/50 transition-all"
                                >
                                    <div>
                                        <p className="font-bold text-lg text-slate-900 dark:text-white">Motion & Effects</p>
                                        <p className="text-xs font-semibold text-slate-400">Enable smooth transitions and physical orbs.</p>
                                    </div>
                                    <div className={`h-8 w-14 rounded-full p-1 transition-colors duration-300 flex items-center ${preferences.animations ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}>
                                        <motion.div
                                            layout
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 700, damping: 30 }}
                                            className={`h-6 w-6 bg-white rounded-full shadow-lg ${!preferences.animations ? 'ml-0' : 'ml-auto'}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
                                <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest">Preferences applied locally</span>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
