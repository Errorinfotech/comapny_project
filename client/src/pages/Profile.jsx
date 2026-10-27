import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Settings,
    User,
    Key,
    Lock,
    Eye,
    EyeOff,
    Save,
    Check,
    ShieldCheck,
    Sparkles,
    Sun,
    Moon,
    Activity,
    CheckCircle2
} from 'lucide-react';

const Profile = () => {
    const { user, setUser } = useAuth();
    const [activeTab, setActiveTab] = useState('security');
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });

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

    // Handle initial theme load & sync
    useEffect(() => {
        if (preferences.darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
        localStorage.setItem('darkMode', preferences.darkMode);
    }, [preferences.darkMode]);

    useEffect(() => {
        localStorage.setItem('animations', preferences.animations);
    }, [preferences.animations]);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setFeedbackMessage({ type: '', text: '' });

        if (passwords.newPassword !== passwords.confirmPassword) {
            setFeedbackMessage({ type: 'error', text: 'New protocol keys do not match' });
            return;
        }

        if (passwords.newPassword.length < 6) {
            setFeedbackMessage({ type: 'error', text: 'New protocol key must be at least 6 characters' });
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/update-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            setFeedbackMessage({ type: 'success', text: 'Authentication credentials updated successfully' });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setFeedbackMessage({ type: 'error', text: err.response?.data?.message || 'Authentication update failed' });
        } finally {
            setLoading(false);
        }
    };

    const togglePreference = (key) => {
        setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Header Title & Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-blue-950/40 text-blue-700 dark:text-sky-300 border border-sky-200/70 dark:border-[#14235a] text-xs font-bold mb-2">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Security & System Controls</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Account Settings
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                        Manage your portal authentication, security credentials, and interface preferences.
                    </p>
                </div>

                {/* Status Indicator */}
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50 text-xs font-bold self-start sm:self-auto shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Session Protected</span>
                </div>
            </div>

            {/* Profile Hero Overview Card (Glassmorphism 3D Look) */}
            <div className="relative overflow-hidden rounded-3xl p-7 bg-white/90 dark:bg-[#070e28]/90 backdrop-blur-xl border border-sky-100/90 dark:border-[#14235a] shadow-lg shadow-sky-950/5">
                {/* Background ambient lighting */}
                <div className="pointer-events-none absolute -right-10 -top-10 w-48 h-48 rounded-full bg-gradient-to-br from-sky-400/20 to-blue-600/10 blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center space-x-5">
                        {/* 3D Glossy Avatar Squircle */}
                        <div className="relative shrink-0">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#1e3a8a] via-[#2563eb] to-[#38bdf8] p-0.5 shadow-xl shadow-[#233c74]/35 flex items-center justify-center border border-white/40 ring-4 ring-sky-500/10">
                                <span className="text-3xl font-black text-white drop-shadow-md">
                                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            </div>
                            <span
                                className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-[#070e28] shadow-xs"
                                title="Account Active"
                            />
                        </div>

                        <div>
                            <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                                    {user?.username || 'Administrator'}
                                </h2>
                                <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/60 dark:to-sky-950/60 text-blue-700 dark:text-sky-300 border border-sky-200/70 dark:border-[#14235a]">
                                    {user?.role || 'Admin'}
                                </span>
                            </div>
                            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
                                Error Infotech Portal Member • Full Access Privileges
                            </p>
                        </div>
                    </div>

                    {/* Quick Metadata Stats */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="px-4 py-2.5 rounded-2xl bg-sky-50/70 dark:bg-[#0a1438] border border-sky-100 dark:border-[#14235a] text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Access Role</p>
                            <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-0.5 capitalize">
                                {user?.role || 'Admin'}
                            </p>
                        </div>
                        <div className="px-4 py-2.5 rounded-2xl bg-sky-50/70 dark:bg-[#0a1438] border border-sky-100 dark:border-[#14235a] text-center">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Encryption</p>
                            <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                                SHA-256 Valid
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Segmented Sliding Tabs Switcher */}
            <div className="flex items-center p-1.5 rounded-2xl bg-white/80 dark:bg-[#08102e]/80 backdrop-blur-md border border-sky-100 dark:border-[#14235a] shadow-xs w-fit">
                <button
                    type="button"
                    onClick={() => {
                        setActiveTab('security');
                        setFeedbackMessage({ type: '', text: '' });
                    }}
                    className={`relative z-10 flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors duration-200 cursor-pointer ${
                        activeTab === 'security'
                            ? 'text-white'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    {activeTab === 'security' && (
                        <motion.div
                            layoutId="activeProfileSettingsTab"
                            className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#32509a] to-[#233c74] shadow-md shadow-[#233c74]/35 -z-10"
                            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        />
                    )}
                    <Shield className="h-4 w-4" />
                    <span>Security & Authentication</span>
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setActiveTab('preferences');
                        setFeedbackMessage({ type: '', text: '' });
                    }}
                    className={`relative z-10 flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors duration-200 cursor-pointer ${
                        activeTab === 'preferences'
                            ? 'text-white'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    {activeTab === 'preferences' && (
                        <motion.div
                            layoutId="activeProfileSettingsTab"
                            className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#32509a] to-[#233c74] shadow-md shadow-[#233c74]/35 -z-10"
                            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        />
                    )}
                    <Settings className="h-4 w-4" />
                    <span>System Preferences</span>
                </button>
            </div>

            {/* Tab Panels */}
            <AnimatePresence mode="wait">
                {activeTab === 'security' ? (
                    <motion.div
                        key="security-panel"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-3xl p-7 sm:p-9 bg-white/90 dark:bg-[#070e28]/90 backdrop-blur-xl border border-sky-100/90 dark:border-[#14235a] shadow-lg shadow-sky-950/5 space-y-7"
                    >
                        {/* Section Header */}
                        <div className="flex items-center space-x-3.5 pb-5 border-b border-sky-100/80 dark:border-[#14235a]">
                            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-[#0a1438] border border-sky-200/70 dark:border-[#14235a] flex items-center justify-center text-sky-700 dark:text-sky-300 shadow-2xs">
                                <Key className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Authentication Credentials
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Update your master security key used to access this corporate portal account.
                                </p>
                            </div>
                        </div>

                        {/* Feedback Banner */}
                        {feedbackMessage.text && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`p-4 rounded-2xl border text-xs font-bold flex items-center space-x-2.5 ${
                                    feedbackMessage.type === 'success'
                                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800/60'
                                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800/60'
                                }`}
                            >
                                {feedbackMessage.type === 'success' ? (
                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                    <Shield className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                                )}
                                <span>{feedbackMessage.text}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handlePasswordUpdate} className="space-y-6">
                            {/* Current Password Field */}
                            <div className="space-y-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                    Current Master Secret
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-sky-600 dark:group-focus-within:text-sky-400 transition-colors">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <input
                                        type={showCurrentPassword ? 'text' : 'password'}
                                        required
                                        placeholder="Enter current password"
                                        className="w-full bg-[#f8fbfe] dark:bg-[#0a1438] border border-sky-100 dark:border-[#14235a] focus:border-sky-300 dark:focus:border-sky-500 rounded-2xl py-3.5 pl-11 pr-12 text-sm font-medium focus:ring-2 focus:ring-sky-200/50 dark:focus:ring-sky-900/40 focus:bg-white dark:focus:bg-[#0e1d52] focus:outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs"
                                        value={passwords.currentPassword}
                                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-4 top-3.5 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                                    >
                                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* New and Confirm Password Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                        New Master Secret
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-sky-600 dark:group-focus-within:text-sky-400 transition-colors">
                                            <Key className="h-4 w-4" />
                                        </div>
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            required
                                            placeholder="Enter new password (min. 6 chars)"
                                            className="w-full bg-[#f8fbfe] dark:bg-[#0a1438] border border-sky-100 dark:border-[#14235a] focus:border-sky-300 dark:focus:border-sky-500 rounded-2xl py-3.5 pl-11 pr-12 text-sm font-medium focus:ring-2 focus:ring-sky-200/50 dark:focus:ring-sky-900/40 focus:bg-white dark:focus:bg-[#0e1d52] focus:outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs"
                                            value={passwords.newPassword}
                                            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-4 top-3.5 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                                        >
                                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                        Verify Master Secret
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-sky-600 dark:group-focus-within:text-sky-400 transition-colors">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            required
                                            placeholder="Re-type new password"
                                            className="w-full bg-[#f8fbfe] dark:bg-[#0a1438] border border-sky-100 dark:border-[#14235a] focus:border-sky-300 dark:focus:border-sky-500 rounded-2xl py-3.5 pl-11 pr-12 text-sm font-medium focus:ring-2 focus:ring-sky-200/50 dark:focus:ring-sky-900/40 focus:bg-white dark:focus:bg-[#0e1d52] focus:outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-2xs"
                                            value={passwords.confirmPassword}
                                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-3.5 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2 flex items-center justify-between flex-wrap gap-4">
                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                    Requires valid session authentication to update.
                                </p>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center space-x-2 bg-gradient-to-b from-[#32509a] to-[#233c74] hover:from-[#3859aa] hover:to-[#264180] text-white font-bold py-3.5 px-7 rounded-2xl shadow-lg shadow-[#233c74]/25 transition-all disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                                >
                                    <Save className="h-4 w-4" />
                                    <span>{loading ? 'Updating Credentials...' : 'Save Security Key'}</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preferences-panel"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="rounded-3xl p-7 sm:p-9 bg-white/90 dark:bg-[#070e28]/90 backdrop-blur-xl border border-sky-100/90 dark:border-[#14235a] shadow-lg shadow-sky-950/5 space-y-6"
                    >
                        {/* Section Header */}
                        <div className="flex items-center space-x-3.5 pb-5 border-b border-sky-100/80 dark:border-[#14235a]">
                            <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-[#0a1438] border border-sky-200/70 dark:border-[#14235a] flex items-center justify-center text-sky-700 dark:text-sky-300 shadow-2xs">
                                <Settings className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Interface & Experience Preferences
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Personalize how Error Infotech Company Portal looks and operates on this device.
                                </p>
                            </div>
                        </div>

                        {/* Interactive Preference Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Theme Toggle Card */}
                            <div
                                onClick={() => togglePreference('darkMode')}
                                className="group relative overflow-hidden rounded-2xl p-5 bg-[#f8fbfe] dark:bg-[#0a1438] border border-sky-100 dark:border-[#14235a] hover:border-sky-300 dark:hover:border-sky-500/50 transition-all cursor-pointer shadow-2xs flex flex-col justify-between"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2.5 rounded-xl bg-white dark:bg-[#070e28] border border-sky-100 dark:border-[#14235a] text-amber-500 dark:text-amber-400 shadow-2xs">
                                            {preferences.darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-900 dark:text-white">Visual Appearance</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                {preferences.darkMode ? 'Dark Theme (Night Blue)' : 'Light Theme (Sky Blue)'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Slider Switch */}
                                    <div
                                        className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 flex items-center ${
                                            preferences.darkMode ? 'bg-gradient-to-r from-[#32509a] to-[#233c74]' : 'bg-slate-300 dark:bg-slate-700'
                                        }`}
                                    >
                                        <motion.div
                                            layout
                                            initial={false}
                                            transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                                            className={`h-5 w-5 bg-white rounded-full shadow-sm ${
                                                !preferences.darkMode ? 'ml-0' : 'ml-auto'
                                            }`}
                                        />
                                    </div>
                                </div>

                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-4 pt-3 border-t border-slate-100 dark:border-[#14235a]">
                                    Click anywhere on card to switch between Light and Dark mode.
                                </p>
                            </div>

                            {/* Motion & Animations Card */}
                            <div
                                onClick={() => togglePreference('animations')}
                                className="group relative overflow-hidden rounded-2xl p-5 bg-[#f8fbfe] dark:bg-[#0a1438] border border-sky-100 dark:border-[#14235a] hover:border-sky-300 dark:hover:border-sky-500/50 transition-all cursor-pointer shadow-2xs flex flex-col justify-between"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2.5 rounded-xl bg-white dark:bg-[#070e28] border border-sky-100 dark:border-[#14235a] text-sky-600 dark:text-sky-400 shadow-2xs">
                                            <Sparkles className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-900 dark:text-white">Motion & Effects</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                                {preferences.animations ? 'Smooth Physics Enabled' : 'Reduced Motion'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Slider Switch */}
                                    <div
                                        className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 flex items-center ${
                                            preferences.animations ? 'bg-gradient-to-r from-[#32509a] to-[#233c74]' : 'bg-slate-300 dark:bg-slate-700'
                                        }`}
                                    >
                                        <motion.div
                                            layout
                                            initial={false}
                                            transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                                            className={`h-5 w-5 bg-white rounded-full shadow-sm ${
                                                !preferences.animations ? 'ml-0' : 'ml-auto'
                                            }`}
                                        />
                                    </div>
                                </div>

                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-4 pt-3 border-t border-slate-100 dark:border-[#14235a]">
                                    Toggle sliding pill animations and interactive transition physics.
                                </p>
                            </div>
                        </div>

                        {/* Note Pill */}
                        <div className="flex items-center space-x-2.5 p-4 bg-sky-50/80 dark:bg-[#0a1438] border border-sky-100 dark:border-[#14235a] rounded-2xl text-xs font-semibold text-sky-800 dark:text-sky-300">
                            <Check className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
                            <span>Preferences automatically save to your browser's local profile cache.</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
