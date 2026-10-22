import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, ExternalLink, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Card, Badge, Button } from '@/components/ui';

const ClientPortal = () => {
    const { user } = useAuth();
    const [clientData, setClientData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyLinks = async () => {
            try {
                const { data } = await api.get('/client-links/me');
                setClientData(data);
            } catch (error) {
                console.error("Error fetching client links", error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === 'client') {
            fetchMyLinks();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent" />
            </div>
        );
    }

    const clients = clientData?.clients || [];
    const subtype = user?.clientSubtype || 'Your Business';
    const businessType = clientData?.type || 'Corporate Solutions';

    return (
        <div className="max-w-6xl mx-auto py-4 space-y-8">
            {/* Hero Banner */}
            <div className="relative overflow-hidden glass-card rounded-3xl p-8 border border-indigo-500/20 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-transparent">
                <div className="max-w-2xl relative z-10">
                    <div className="flex items-center space-x-2.5 mb-3">
                        <Badge variant="primary" dot size="sm">Dedicated Client Portal</Badge>
                        <Badge variant="cyan" size="sm">{subtype}</Badge>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        Welcome to {businessType}
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                        Access your project links, live deployments and deliverables tailored specifically for{' '}
                        <span className="font-semibold text-indigo-500 dark:text-indigo-400">{subtype}</span>.
                    </p>
                </div>
            </div>

            {/* Links Grid */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                            Available Workspaces & Services
                        </h2>
                        <p className="text-xs text-slate-400">Click to open your live project or asset</p>
                    </div>
                    <Badge variant="default" size="sm">{clients.length} Active Links</Badge>
                </div>

                {clients.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {clients.map((client, index) => (
                            <motion.div
                                key={client._id || index}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="h-full flex flex-col justify-between group" hover={true}>
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-500 group-hover:scale-105 transition-transform">
                                                <Building2 className="h-5 w-5" />
                                            </div>
                                            <Badge variant="success" size="sm">Online</Badge>
                                        </div>

                                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-500 transition-colors">
                                            {client.businessName}
                                        </h3>

                                        <p className="text-xs text-slate-400 break-all line-clamp-1 mb-4 font-mono">
                                            {client.link}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60">
                                        <a
                                            href={client.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20 transition-all"
                                        >
                                            <span>Open Portal</span>
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </a>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <Card className="text-center py-16">
                        <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">
                            No links configured yet
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                            Your administrator has not yet assigned active project links for {subtype}.
                        </p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default ClientPortal;
