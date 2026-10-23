import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    ExternalLink, ShieldCheck, Activity, Globe, ArrowUpRight, 
    Sparkles, Building2, CheckCircle, Zap, Radio
} from 'lucide-react';

/**
 * ProjectHeroCard
 * Apple/Stripe-level luxury 3D Perspective Tilt Showcase Card with dynamic animations:
 * - Real-time specular cursor light reflection
 * - Animated live activity wave bars
 * - Radar ping status beacon
 * - Gradient title text shimmer
 * - Magnetic high-impact launch trigger
 */
const ProjectHeroCard = ({
    businessName = "SH chartered accountant",
    sector = "Service Business",
    subtype = "CA",
    primaryLink = "https://errorinfotech.in",
    uptime = "99.98%",
    status = "Active Production",
    suiteName = "",
    tagline = "",
    stats = []
}) => {
    const cardRef = useRef(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotX = ((clientY - centerY) / centerY) * -6; // max 6 deg
        const rotY = ((clientX - centerX) / centerX) * 6;

        setRotateX(rotX);
        setRotateY(rotY);

        const glareX = (clientX / rect.width) * 100;
        const glareY = (clientY / rect.height) * 100;
        setGlarePos({ x: glareX, y: glareY, opacity: 0.16 });
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setRotateX(0);
        setRotateY(0);
        setGlarePos(prev => ({ ...prev, opacity: 0 }));
    };

    const formattedLink = primaryLink.startsWith('http') ? primaryLink : `https://${primaryLink}`;

    return (
        <div 
            style={{ perspective: '1200px' }} 
            className="w-full"
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                ref={cardRef}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotateX: rotateX,
                    rotateY: rotateY,
                }}
                transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 24,
                }}
                className="relative overflow-hidden rounded-3xl p-7 sm:p-9 bg-white/95 dark:bg-[#070e28]/95 backdrop-blur-2xl border border-sky-100/90 dark:border-[#14235a] shadow-xl shadow-sky-950/5 group transition-shadow duration-300"
            >
                {/* Moving Specular Glare Overlay */}
                <div
                    className="pointer-events-none absolute inset-0 transition-opacity duration-300 rounded-3xl"
                    style={{
                        background: `radial-gradient(circle 380px at ${glarePos.x}% ${glarePos.y}%, rgba(56, 189, 248, ${glarePos.opacity}), transparent 70%)`,
                    }}
                />

                {/* Animated Luminous Ambient Background Glow */}
                <motion.div 
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.15, 0.25, 0.15],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute right-0 top-0 -translate-y-10 translate-x-10 w-80 h-80 rounded-full bg-gradient-to-br from-blue-600/20 to-sky-400/25 blur-3xl pointer-events-none" 
                />

                <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                    {/* Top Row: Sector Badge & Live Status with Radar Ping */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center space-x-2">
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 border border-sky-200/70 dark:border-[#14235a] shadow-xs">
                                {sector}
                            </span>
                            <motion.span 
                                whileHover={{ scale: 1.05 }}
                                className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#32509a]/10 dark:bg-[#32509a]/30 text-[#32509a] dark:text-sky-300 border border-[#32509a]/25 flex items-center space-x-1.5 shadow-xs cursor-default"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-spin" style={{ animationDuration: '8s' }} />
                                <span>{subtype} Specialized</span>
                            </motion.span>
                        </div>

                        {/* Status Badge with Live Radar Pulse */}
                        <div className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/50 text-xs font-bold shadow-2xs">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                            </span>
                            <span className="tracking-wide">{status}</span>
                        </div>
                    </div>

                    {/* Middle: ERP Suite Title with Dynamic Shimmer & Sales Tagline */}
                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                            <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-600 dark:text-sky-400">
                                Enterprise Product Showcase
                            </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                            {suiteName || `${subtype} Enterprise Suite™`}
                        </h2>

                        <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
                            {tagline || `Customized enterprise CRM and ERP solution engineered by Error Infotech for high-efficiency ${subtype} business operations.`}
                        </p>

                        {/* Verified Client Proof Link Tag with Pulsing Globe */}
                        {businessName && (
                            <motion.div 
                                whileHover={{ scale: 1.01 }}
                                className="mt-4 inline-flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-slate-50/90 dark:bg-[#0a1438]/90 border border-slate-200/80 dark:border-[#14235a] text-xs shadow-2xs"
                            >
                                <span className="text-slate-400 font-medium">Live Deployment:</span>
                                <span className="font-bold text-slate-800 dark:text-slate-100">{businessName}</span>
                                <span className="text-slate-300 dark:text-slate-600">•</span>
                                <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400 shrink-0 animate-spin" style={{ animationDuration: '14s' }} />
                                <span className="font-mono text-blue-700 dark:text-sky-300 truncate max-w-xs">{primaryLink}</span>
                            </motion.div>
                        )}
                    </div>

                    {/* Dynamic Stats Badges with Micro-Interactions */}
                    {stats && stats.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                            {stats.map((st, i) => (
                                <motion.div 
                                    key={i} 
                                    whileHover={{ y: -3, scale: 1.02 }}
                                    transition={{ duration: 0.15 }}
                                    className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#0a1438]/70 border border-slate-200/70 dark:border-[#14235a]/70 hover:border-sky-300 dark:hover:border-sky-500/60 shadow-xs cursor-default"
                                >
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{st.label}</p>
                                    <p className="text-base font-extrabold text-blue-700 dark:text-sky-300 font-mono mt-0.5">{st.val}</p>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Bottom Metrics & High-Impact Launch Trigger */}
                    <div className="pt-6 border-t border-slate-100 dark:border-[#14235a]/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Telemetry Stats with Animated Equalizer Wave Bars */}
                        <div className="flex items-center space-x-6 text-xs">
                            <div className="flex items-center space-x-3">
                                {/* Live Equalizer Waves */}
                                <div className="flex items-end space-x-0.5 h-5">
                                    <span className="w-1 bg-emerald-500 rounded-full live-wave-bar" style={{ animationDelay: '0s' }} />
                                    <span className="w-1 bg-emerald-500 rounded-full live-wave-bar" style={{ animationDelay: '0.2s' }} />
                                    <span className="w-1 bg-emerald-500 rounded-full live-wave-bar" style={{ animationDelay: '0.4s' }} />
                                    <span className="w-1 bg-emerald-500 rounded-full live-wave-bar" style={{ animationDelay: '0.1s' }} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">System Telemetry</p>
                                    <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                                        {uptime} Active
                                    </p>
                                </div>
                            </div>

                            <div className="w-px h-8 bg-slate-200 dark:bg-[#14235a]" />

                            <div className="flex items-center space-x-2">
                                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-sky-400" />
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Security</p>
                                    <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                                        256-Bit TLS
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* High-Impact Launch Button with Spring Physics */}
                        <motion.a
                            href={formattedLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className="inline-flex items-center justify-center space-x-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-b from-[#32509a] to-[#233c74] hover:from-[#2a4484] hover:to-[#1c305c] text-white font-bold text-xs shadow-lg shadow-[#233c74]/25 cursor-pointer relative overflow-hidden group/btn"
                        >
                            {/* Animated Glare across button */}
                            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                            <span className="relative z-10">Launch Live CRM / Client System</span>
                            <ArrowUpRight className="w-4 h-4 relative z-10 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </motion.a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProjectHeroCard;
