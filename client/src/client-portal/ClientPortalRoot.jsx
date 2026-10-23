import React, { useState } from 'react';
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
        <div className="min-h-screen bg-gradient-to-tr from-[#e6f1fc] via-[#edf5fd] to-[#f6faff] dark:from-[#060b19] dark:via-[#091126] dark:to-[#060a17] text-slate-900 dark:text-slate-100 transition-colors duration-300">
            {/* Dedicated Standalone Client Header (No Office Sidebar) */}
            <ClientHeader 
                clientBusinessName={user?.businessName || user?.name || "Client Directory"}
                clientSubtype={user?.clientSubtype || "Commercial Portals"}
                isAdmin={user?.role === 'admin'}
                onExitClientPortal={() => setClientSessionActive(false)}
            />

            {/* Main Full-Width Animated Content Canvas */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <ClientDashboard />
            </main>
        </div>
    );
};

export default ClientPortalRoot;
