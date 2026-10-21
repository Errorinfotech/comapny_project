import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

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
        return <div className="flex justify-center items-center h-full min-h-[50vh]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div></div>;
    }

    const clients = clientData?.clients || [];
    const subtype = user?.clientSubtype || 'Your Business';
    const businessType = clientData?.type || 'Business Template';

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center space-x-3">
                    <Building2 className="h-8 w-8 text-indigo-500" />
                    <span>My Business Portal</span>
                </h1>
                <p className="text-slate-500 mt-2">
                    Welcome to your personalized client portal. Here you can access all the related tools, templates, and links for <span className="font-bold text-indigo-500">{subtype}</span>.
                </p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 min-h-[400px]"
            >
                {clients.length > 0 ? (
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                            Available Links for <span className="text-indigo-500">{subtype}</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {clients.map((client, index) => (
                                <div key={index} className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-all group">
                                    <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4">
                                        <Building2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-1" title={client.businessName}>
                                        {client.businessName}
                                    </h4>
                                    <p className="text-xs text-slate-500 mb-6 uppercase tracking-widest">
                                        {businessType}
                                    </p>
                                    <a
                                        href={client.link.startsWith('http') ? client.link : `https://${client.link}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-slate-900 hover:bg-indigo-600 hover:text-white text-indigo-600 font-bold py-2.5 px-4 rounded-xl transition-all border border-indigo-100 dark:border-indigo-900 group-hover:border-transparent"
                                    >
                                        <span>Access Project</span>
                                        <LinkIcon className="h-3.5 w-3.5" />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center py-16 h-full">
                        <AlertCircle className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
                        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">No Links Available</h2>
                        <p className="text-slate-500 max-w-md">
                            Your admin hasn't added any project links or templates for your specific business category yet. Please contact support.
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ClientPortal;
