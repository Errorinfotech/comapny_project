import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * ClientRobotMascot
 * Luxury Apple/Pixar style 3D Corporate Executive Robot Mascot.
 * Features smooth floating levitation, blinking LED optical visor,
 * and gentle interactive reaction on hover/pointer.
 */
const ClientRobotMascot = ({ statusText = "Ready to assist", className = "" }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div 
            className={`relative flex items-center select-none ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Soft Ambient Radial Floor Glow */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-sky-400/25 dark:bg-sky-500/20 rounded-full blur-md" />

            {/* Floating Robot Container */}
            <motion.div
                animate={{
                    y: isHovered ? [-2, -8, -2] : [0, -6, 0],
                    rotate: isHovered ? [0, 2, -2, 0] : [0, 1, -1, 0],
                }}
                transition={{
                    duration: isHovered ? 2 : 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center filter drop-shadow-xl"
            >
                <svg
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                >
                    <defs>
                        {/* Body Gloss Gradient */}
                        <linearGradient id="robotBodyGrad" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="60%" stopColor="#f0f6fc" />
                            <stop offset="100%" stopColor="#dbeafe" />
                        </linearGradient>

                        {/* Visor Glass Gradient */}
                        <linearGradient id="robotVisorGrad" x1="30" y1="40" x2="90" y2="65" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#070e28" />
                            <stop offset="100%" stopColor="#1e3a8a" />
                        </linearGradient>

                        {/* Royal Blue Ear/Joint Accents */}
                        <linearGradient id="robotAccentGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#32509a" />
                        </linearGradient>

                        {/* Specular Highlight */}
                        <linearGradient id="specularGleam" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Antenna Base & Ball */}
                    <path d="M60 22 L60 12" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="60" cy="10" r="5" fill="url(#robotAccentGrad)" />
                    <circle cx="60" cy="10" r="2" fill="#38bdf8">
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                    </circle>

                    {/* Left & Right Ear Pods */}
                    <rect x="22" y="44" width="8" height="16" rx="4" fill="url(#robotAccentGrad)" />
                    <rect x="90" y="44" width="8" height="16" rx="4" fill="url(#robotAccentGrad)" />

                    {/* Robot Head Outer Shell (Glossy White Squircle) */}
                    <rect x="28" y="24" width="64" height="54" rx="20" fill="url(#robotBodyGrad)" stroke="#cbd5e1" strokeWidth="1.5" />
                    {/* Head Top Sheen */}
                    <path d="M38 27 Q 60 25, 82 27" stroke="url(#specularGleam)" strokeWidth="3" strokeLinecap="round" />

                    {/* Dark Glossy Visor Screen */}
                    <rect x="36" y="38" width="48" height="26" rx="12" fill="url(#robotVisorGrad)" stroke="#1e293b" strokeWidth="1.5" />

                    {/* Blue LED Eyes (Friendly, Curved) */}
                    <g>
                        {/* Left Eye */}
                        <ellipse cx="50" cy="50" rx="5" ry={isHovered ? "6" : "5"} fill="#38bdf8" />
                        <ellipse cx="49" cy="48" rx="2" ry="2" fill="#ffffff" />

                        {/* Right Eye */}
                        <ellipse cx="70" cy="50" rx="5" ry={isHovered ? "6" : "5"} fill="#38bdf8" />
                        <ellipse cx="69" cy="48" rx="2" ry="2" fill="#ffffff" />

                        {/* Gentle Smile / Voice Wave */}
                        <path d="M56 56 Q 60 59, 64 56" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.85" />
                    </g>

                    {/* Neck Link */}
                    <rect x="52" y="78" width="16" height="6" rx="3" fill="#94a3b8" />

                    {/* Torso Shell */}
                    <path d="M40 84 Q 60 81, 80 84 L 84 104 Q 60 108, 36 104 Z" fill="url(#robotBodyGrad)" stroke="#cbd5e1" strokeWidth="1.5" />

                    {/* Executive Tie / Brand Emblem on Chest */}
                    <path d="M57 85 L63 85 L61 98 L60 101 L59 98 Z" fill="url(#robotAccentGrad)" />
                    <circle cx="60" cy="88" r="1.5" fill="#ffffff" />
                </svg>
            </motion.div>

            {/* Speech / Status Bubble */}
            <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="hidden md:flex flex-col ml-3 px-3.5 py-1.5 rounded-2xl bg-white/95 dark:bg-[#070e28]/95 backdrop-blur-md border border-sky-100 dark:border-[#14235a] shadow-md shadow-sky-950/5 pointer-events-none"
            >
                <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                        Error Bot AI
                    </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-400">
                    {statusText}
                </span>
            </motion.div>
        </div>
    );
};

export default ClientRobotMascot;
