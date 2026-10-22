import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';
import robotsBottomSky from '../assets/robots_bottom_sky.png';

const Login = () => {
    const [username, setUsername] = useState('admin');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Strictly enforce light theme default upon sign in
            localStorage.setItem('theme', 'light');
            localStorage.setItem('darkMode', 'false');
            document.documentElement.classList.remove('dark');

            const user = await login(username.trim(), password);
            if (user.role === 'admin') {
                navigate('/admin');
            } else if (user.role === 'client') {
                navigate('/client-portal');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Login error:', err);
            const msg = err.response?.data?.message || (err.message === 'Network Error' ? 'Server સાથે કનેક્ટ નથી થઈ શકતું (Network Error).' : 'Invalid username or password.');
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-[#dceaf7] via-[#e6f1fb] to-[#edf5fd] overflow-hidden select-none">
            
            {/* 🌟 Right-Side Majestic Night Blue Curved Ambient Backdrop */}
            <div className="absolute top-0 right-0 w-[44vw] min-w-[340px] max-w-[640px] h-full bg-gradient-to-b from-[#060c22] via-[#091538] to-[#11245a] rounded-l-[280px] lg:rounded-l-[380px] shadow-[-35px_0_95px_rgba(6,12,34,0.35)] pointer-events-none z-0 overflow-hidden hidden md:block">
                {/* Internal cyber glow accents */}
                <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 left-10 w-72 h-72 rounded-full bg-blue-600/20 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:26px_26px] opacity-15" />
            </div>

            {/* Top-Right Pill Tag */}
            <div className="absolute top-6 right-6 sm:top-8 sm:right-10 z-30 hidden sm:flex items-center space-x-2.5 px-3.5 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-xl text-xs font-semibold">
                <img src="/error.jpeg" alt="Error Infotech" className="w-5 h-5 rounded-full object-contain bg-white shadow-xs" />
                <span className="tracking-wide">Error Infotech Portal</span>
            </div>

            {/* 🤖 Bottom-Anchored Faded Robot Team: Touches the VERY BOTTOM edge of the viewport seamlessly */}
            <div className="absolute bottom-0 left-0 w-full lg:w-[62%] xl:w-[66%] flex items-end justify-center lg:justify-start pointer-events-none z-10 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="w-full max-w-[820px] xl:max-w-[920px] flex items-end"
                >
                    <img 
                        src={robotsBottomSky} 
                        alt="Error Infotech Executive Team"
                        className="w-full h-auto object-contain object-bottom -mb-1 select-none"
                    />
                </motion.div>
            </div>

            {/* Main Content Area: Centered Container with Right-Aligned Login Card */}
            <div className="relative z-20 w-full max-w-7xl px-4 sm:px-8 lg:px-12 flex justify-center lg:justify-end items-center min-h-screen py-8">
                
                {/* Right Side: Glassmorphism Login Card expanded to fit green box */}
                <motion.div 
                    initial={{ opacity: 0, x: 35 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
                    className="w-full max-w-md lg:max-w-[445px] xl:max-w-[465px] bg-white/85 backdrop-blur-2xl rounded-[36px] p-8 sm:p-10 lg:p-11 border border-white/95 shadow-[0_30px_70px_-15px_rgba(6,12,34,0.25)] relative z-20 my-auto lg:mr-8 xl:mr-14 translate-y-2 lg:translate-y-5"
                >
                    {/* Header with Title and Hexagon Shield Icon */}
                    <div className="mb-7 flex items-center justify-between">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                            Login
                        </h2>
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0b132b] to-[#1e3a8a] flex items-center justify-center text-white shadow-md shadow-blue-950/20">
                            <Shield className="w-5 h-5 text-cyan-400" />
                        </div>
                    </div>

                    {/* Error Notice */}
                    {error && (
                        <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username or Email */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Username or Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="w-full rounded-2xl pl-10 pr-4 py-3 text-sm bg-slate-50/70 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 focus:bg-white transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full rounded-2xl pl-10 pr-10 py-3 text-sm bg-slate-50/70 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/30 focus:border-blue-900 focus:bg-white transition-all shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <div className="flex justify-end mt-1.5">
                                <span className="text-xs text-blue-900 hover:underline cursor-pointer font-medium">
                                    Forgot Password?
                                </span>
                            </div>
                        </div>

                        {/* Sign In Button with Night Blue Gradient & Arrow */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#0e1b42] via-[#162a63] to-[#1e3a8a] hover:from-[#080f29] hover:to-[#172e6f] text-white font-semibold text-sm shadow-lg shadow-blue-950/25 active:scale-[0.99] transition-all disabled:opacity-50 mt-2 flex items-center justify-center space-x-2 cursor-pointer"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Signing In...</span>
                                </div>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-5">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-[11px]">
                            <span className="bg-white/90 px-3 text-slate-400 font-medium">
                                Or sign in with:
                            </span>
                        </div>
                    </div>

                    {/* SSO Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setError('Google SSO is active for enterprise domain.')}
                            className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm transition-all cursor-pointer"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                            </svg>
                            <span>Google</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setError('Microsoft Azure SSO is active for enterprise domain.')}
                            className="flex items-center justify-center space-x-2 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm transition-all cursor-pointer"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 23 23">
                                <path fill="#f35325" d="M1 1h10v10H1z" />
                                <path fill="#81bc06" d="M12 1h10v10H12z" />
                                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                                <path fill="#ffba08" d="M12 12h10v10H12z" />
                            </svg>
                            <span>Microsoft</span>
                        </button>
                    </div>

                    {/* Footer Link */}
                    <div className="mt-5 text-center text-xs text-slate-500 font-medium">
                        Don't have an account?{' '}
                        <span className="text-blue-900 font-bold hover:underline cursor-pointer">
                            Contact Admin
                        </span>
                    </div>
                </motion.div>
            </div>
        </main>
    );
};

export default Login;
