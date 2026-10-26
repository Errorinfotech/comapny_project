import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ClientHeader from './layout/ClientHeader';
import ClientDashboard from './dashboard/ClientDashboard';
import ClientLoginGateway from './auth/ClientLoginGateway';

/**
 * ClientPortalRoot
 * Standalone Master Container for Error Infotech Client Portal.
 * Operates independently from the internal Office Workspace.
 */
const ClientPortalRoot = () => {
    const { user, loading } = useAuth();
    // Always start with login page first when entering Client Portal tab
    const [clientSessionActive, setClientSessionActive] = useState(false);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#060b19]">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // If client session is not active, always show the Client Login Gateway first
    if (!clientSessionActive) {
        return (
            <ClientLoginGateway 
                onLoginSuccess={() => setClientSessionActive(true)}
                onBypassLogin={() => setClientSessionActive(true)} 
            />
        );
    }

    return (
        <div 
            className="min-h-screen relative overflow-hidden bg-[#f8fbff] dark:bg-[#060b19] text-slate-900 dark:text-slate-100 transition-colors duration-300"
            style={{ overscrollBehaviorX: 'none' }}
        >
            {/* 🌐 Animated Digital Network Node Backdrop */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                {/* 1. Fluid Ambient Aurora Mesh Orbs (Living color dynamic glow under the network) */}
                {/* Cyan Glow Orb - Top Left */}
                <motion.div 
                    animate={{
                        x: [-35, 35, -20, -35],
                        y: [-25, 25, -10, -25],
                        scale: [1, 1.22, 0.96, 1],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -top-24 -left-20 w-[580px] h-[580px] rounded-full blur-[110px] bg-sky-400/25 dark:bg-sky-500/15 will-change-transform"
                />

                {/* Indigo Glow Orb - Center Right */}
                <motion.div 
                    animate={{
                        x: [35, -40, 20, 35],
                        y: [30, -30, 15, 30],
                        scale: [1.15, 0.95, 1.18, 1.15],
                    }}
                    transition={{
                        duration: 22,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/4 -right-24 w-[620px] h-[620px] rounded-full blur-[130px] bg-indigo-500/20 dark:bg-indigo-600/15 will-change-transform"
                />

                {/* Electric Azure Orb - Bottom Center / Left */}
                <motion.div 
                    animate={{
                        x: [-30, 35, -15, -30],
                        y: [20, -25, 10, 20],
                        scale: [0.95, 1.18, 1, 0.95],
                    }}
                    transition={{
                        duration: 16,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -bottom-28 left-1/3 w-[540px] h-[540px] rounded-full blur-[115px] bg-blue-500/20 dark:bg-blue-600/12 will-change-transform"
                />

                {/* 2. Natural Organic Breathing Network Layer (Clean, light & elegant parallax) */}
                <motion.div 
                    animate={{
                        x: [-12, 12, -7, -12],
                        y: [-8, 9, -5, -8],
                        scale: [1.02, 1.05, 1.03, 1.02],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -inset-8 bg-cover bg-center opacity-22 dark:opacity-12 mix-blend-multiply dark:mix-blend-screen dark:invert will-change-transform"
                    style={{
                        backgroundImage: "url('/network_bg.png')",
                    }}
                />

                {/* 3. Soft Diffused Caustic Sheen Wave (Gentle sweep of light across network nodes) */}
                <motion.div 
                    animate={{
                        x: ['-100%', '160%'],
                        opacity: [0, 0.4, 0]
                    }}
                    transition={{
                        duration: 11,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 1.5
                    }}
                    className="absolute inset-y-0 w-2/3 -skew-x-12 pointer-events-none will-change-transform"
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(56, 189, 248, 0.14) 40%, rgba(99, 102, 241, 0.14) 60%, transparent 100%)',
                    }}
                />

                {/* 4. Top Ambient Studio Spotlight */}
                <motion.div 
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.25, 0.42, 0.25],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1100px] h-[420px] rounded-full blur-3xl will-change-transform"
                    style={{
                        background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.18) 0%, rgba(14, 165, 233, 0.08) 50%, transparent 75%)'
                    }}
                />
            </div>

            {/* Dedicated Standalone Client Header (No Office Sidebar) */}
            <div className="relative z-20">
                <ClientHeader 
                    clientBusinessName={user?.businessName || user?.name || "Client Directory"}
                    clientSubtype={user?.clientSubtype || "Commercial Portals"}
                    isAdmin={user?.role === 'admin'}
                    onExitClientPortal={() => setClientSessionActive(false)}
                />
            </div>

            {/* Main Full-Width Animated Content Canvas */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-8">
                <ClientDashboard />
            </main>
        </div>
    );
};

export default ClientPortalRoot;
