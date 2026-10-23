import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, ChevronRight, Check, ArrowRight,
    Briefcase, Factory, ShoppingBag, UtensilsCrossed,
    GraduationCap, Car, Home, HeartPulse,
    Gamepad2, Compass, Wrench, Sparkles, Building2,
    Loader2
} from 'lucide-react';

export const INDUSTRY_METADATA = {
    "Service Business": {
        icon: Briefcase,
        tagline: "Legal, Advisory, Consultancy & Practice Management",
        accent: "from-blue-600 to-indigo-700"
    },
    "Manufacturing / Industrial": {
        icon: Factory,
        tagline: "Heavy Industry, Production, FMCG & Supply Chain",
        accent: "from-blue-700 to-sky-700"
    },
    "Retail & Shopping": {
        icon: ShoppingBag,
        tagline: "Apparel, Electronics, Jewellers & Omnichannel Stores",
        accent: "from-sky-600 to-blue-700"
    },
    "Food & Beverage": {
        icon: UtensilsCrossed,
        tagline: "Restaurants, Cafes, Cloud Kitchens & Food Outlets",
        accent: "from-blue-600 to-teal-700"
    },
    "Education": {
        icon: GraduationCap,
        tagline: "Academies, Schools, Institutes & EdTech Learning",
        accent: "from-indigo-600 to-blue-800"
    },
    "Automobile": {
        icon: Car,
        tagline: "Vehicle Showrooms, Service Centers & Spare Parts",
        accent: "from-blue-600 to-cyan-700"
    },
    "Home & Lifestyle": {
        icon: Home,
        tagline: "Interior Design, Modular Kitchens & Furnishings",
        accent: "from-blue-700 to-slate-800"
    },
    "Health & Wellness": {
        icon: HeartPulse,
        tagline: "Hospitals, Clinics, Diagnostic Labs & Fitness Studios",
        accent: "from-sky-600 to-blue-800"
    },
    "Entertainment": {
        icon: Gamepad2,
        tagline: "Amusement Parks, Game Zones & Leisure Hubs",
        accent: "from-blue-600 to-indigo-800"
    },
    "Travel": {
        icon: Compass,
        tagline: "Tour Operators, Travel Agencies & Hospitality",
        accent: "from-blue-700 to-sky-800"
    },
    "Repair & Service": {
        icon: Wrench,
        tagline: "Consumer Electronics, AC, Water & Maintenance",
        accent: "from-slate-700 to-blue-800"
    },
    "Additional Retail & Events": {
        icon: Sparkles,
        tagline: "Event Management, Banquet Halls & Studios",
        accent: "from-blue-600 to-blue-900"
    }
};

/**
 * Industry3DCarousel
 * Implements Stage 1 & Stage 2:
 * - 3D Perspective Industry Carousel
 * - Cinematic Card Click Transition:
 *   1. Card glides to center
 *   2. Card scales up with electric blue glow
 *   3. Checkmark confirms selection
 *   4. Surrounding cards slide outward and fade away
 *   5. Seamlessly triggers transition to Stage 3 (Sub-Businesses)
 */
const Industry3DCarousel = ({ 
    industries = [], 
    selectedIndustry, 
    onConfirmBusiness,
    configuredCounts = {},
    subtypeCounts = {}
}) => {
    const [activeIdx, setActiveIdx] = useState(() => {
        const idx = industries.indexOf(selectedIndustry);
        return idx !== -1 ? idx : 0;
    });

    // Cinematic transition state
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    // Sync active index if selectedIndustry changes from outside
    useEffect(() => {
        const idx = industries.indexOf(selectedIndustry);
        if (idx !== -1 && idx !== activeIdx && !isTransitioning) {
            setActiveIdx(idx);
        }
    }, [selectedIndustry, industries]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isTransitioning) return;
            if (e.key === 'ArrowLeft') {
                handlePrev();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'Enter') {
                handleCardClick(industries[activeIdx]);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeIdx, industries, isTransitioning]);

    const handlePrev = () => {
        if (isTransitioning || industries.length === 0) return;
        setActiveIdx((prev) => (prev - 1 + industries.length) % industries.length);
    };

    const handleNext = () => {
        if (isTransitioning || industries.length === 0) return;
        setActiveIdx((prev) => (prev + 1) % industries.length);
    };

    // Trigger the cinematic transition sequence on card click
    const handleCardClick = (industry) => {
        if (isTransitioning) return;
        const targetIdx = industries.indexOf(industry);
        setActiveIdx(targetIdx);
        setSelectedCard(industry);
        setIsTransitioning(true);

        // Sequence: 
        // 0-450ms: Selected card centers, scales up, glow wraps edge, checkmark appears, surrounding cards slide out
        // At 550ms: Trigger parent stage transition into Sub-Business screen
        setTimeout(() => {
            if (onConfirmBusiness) {
                onConfirmBusiness(industry);
            }
        }, 550);
    };

    // Calculate relative 3D position for a given item index
    const getCardTransform = (index) => {
        const total = industries.length;
        let diff = index - activeIdx;

        // Circular wrap
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;

        const isCenter = diff === 0;

        // During cinematic transition:
        if (isTransitioning) {
            if (isCenter) {
                return {
                    transform: 'translateX(0px) translateZ(100px) rotateY(0deg) scale(1.14)',
                    zIndex: 40,
                    opacity: 1,
                    pointerEvents: 'none',
                    filter: 'drop-shadow(0 0 45px rgba(36,99,235,0.7))'
                };
            } else {
                // Surrounding cards slide outward and fade away
                const slideDirection = diff < 0 ? -1 : 1;
                return {
                    transform: `translateX(${slideDirection * 600}px) translateZ(-200px) rotateY(${slideDirection * 45}deg) scale(0.6)`,
                    zIndex: 5,
                    opacity: 0,
                    pointerEvents: 'none',
                    filter: 'blur(8px)'
                };
            }
        }

        // Normal browsing state:
        if (isCenter) {
            return {
                transform: 'translateX(0px) translateZ(60px) rotateY(0deg) scale(1.06)',
                zIndex: 30,
                opacity: 1,
                pointerEvents: 'auto',
                filter: 'drop-shadow(0 20px 35px rgba(36,99,235,0.25))'
            };
        } else if (diff === -1) {
            return {
                transform: 'translateX(-230px) translateZ(-80px) rotateY(24deg) scale(0.88)',
                zIndex: 20,
                opacity: 0.85,
                pointerEvents: 'auto',
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.06))'
            };
        } else if (diff === 1) {
            return {
                transform: 'translateX(230px) translateZ(-80px) rotateY(-24deg) scale(0.88)',
                zIndex: 20,
                opacity: 0.85,
                pointerEvents: 'auto',
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.06))'
            };
        } else if (diff === -2) {
            return {
                transform: 'translateX(-390px) translateZ(-160px) rotateY(32deg) scale(0.74)',
                zIndex: 10,
                opacity: 0.45,
                pointerEvents: 'auto'
            };
        } else if (diff === 2) {
            return {
                transform: 'translateX(390px) translateZ(-160px) rotateY(-32deg) scale(0.74)',
                zIndex: 10,
                opacity: 0.45,
                pointerEvents: 'auto'
            };
        } else {
            return {
                transform: `translateX(${diff * 200}px) translateZ(-260px) scale(0.5)`,
                zIndex: 1,
                opacity: 0,
                pointerEvents: 'none'
            };
        }
    };

    return (
        <section className="relative w-full py-4 select-none overflow-hidden">
            {/* Fine curved orbital lines & ecosystem nodes background */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center -z-10 opacity-70 dark:opacity-40">
                <div className="w-[720px] h-[360px] rounded-[100%] border border-sky-200/60 dark:border-[#14235a]/50 border-dashed animate-[spin_80s_linear_infinite]" />
                <div className="absolute w-[920px] h-[450px] rounded-[100%] border border-sky-100/50 dark:border-[#101e4a]/40" />
                <div className="absolute w-2 h-2 rounded-full bg-blue-500 top-12 left-1/4 animate-pulse" />
                <div className="absolute w-2.5 h-2.5 rounded-full bg-sky-400 bottom-16 right-1/4 animate-pulse" />
            </div>

            {/* Stage Title & Subtitle */}
            <div className="text-center max-w-2xl mx-auto mb-6 px-4">
                <motion.div 
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EDF6FF] dark:bg-[#0c1a44] border border-[#D9E8FA] dark:border-[#14235a] text-[#2463EB] dark:text-sky-300 text-xs font-bold uppercase tracking-wider mb-2.5 shadow-2xs"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Stage 1 of 3: Business Explorer</span>
                </motion.div>
                
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#172B4D] dark:text-white tracking-tight">
                    Let's Build Your Client Solution
                </h2>
                
                <p className="mt-2 text-sm text-[#7185A3] dark:text-slate-400 max-w-lg mx-auto">
                    Select your client's industry. We'll guide you through the right digital solutions.
                </p>
            </div>

            {/* 3D Visual Carousel Stage */}
            <div className="relative h-[350px] sm:h-[380px] flex items-center justify-center perspective-[1200px]">
                {/* Illuminated Pedestal Light Beneath Center Card */}
                <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-80 sm:w-96 h-12 bg-radial from-[#2463EB]/40 via-sky-400/25 to-transparent blur-xl pointer-events-none rounded-full z-0 transition-all duration-500 ${
                    isTransitioning ? 'scale-125 opacity-100 from-[#2463EB]/70' : 'opacity-70'
                }`} />

                {/* 3D Carousel Cards */}
                <div className="relative w-full max-w-4xl h-full flex items-center justify-center transform-style-3d">
                    {industries.map((industry, idx) => {
                        const isCenter = idx === activeIdx;
                        const meta = INDUSTRY_METADATA[industry] || { icon: Building2, tagline: "Enterprise Digital Architecture" };
                        const Icon = meta.icon;
                        const cardStyle = getCardTransform(idx);
                        const count = configuredCounts[industry] || 0;
                        const subCount = subtypeCounts[industry] || 0;

                        return (
                            <div
                                key={industry}
                                onClick={() => handleCardClick(industry)}
                                style={{
                                    transform: cardStyle.transform,
                                    zIndex: cardStyle.zIndex,
                                    opacity: cardStyle.opacity,
                                    pointerEvents: cardStyle.pointerEvents,
                                    filter: cardStyle.filter,
                                    transition: isTransitioning
                                        ? 'transform 0.48s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.42s ease, filter 0.42s ease'
                                        : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.35s ease, filter 0.35s ease'
                                }}
                                className={`absolute w-[265px] sm:w-[295px] h-[310px] sm:h-[330px] rounded-3xl p-6 flex flex-col justify-between cursor-pointer backdrop-blur-xl border transition-all duration-300 ${
                                    isCenter
                                        ? 'bg-gradient-to-br from-[#2463EB] to-[#1d4ed8] text-white border-blue-400 shadow-2xl ring-2 ring-blue-400/50'
                                        : 'bg-white/95 dark:bg-[#070e28]/95 text-[#172B4D] dark:text-white border-[#D9E8FA] dark:border-[#14235a] hover:border-sky-300 dark:hover:border-sky-500/50'
                                }`}
                            >
                                {/* Glowing Traveling Edge (Only when selected/transitioning) */}
                                {isCenter && isTransitioning && (
                                    <div className="absolute inset-0 rounded-3xl border-2 border-white animate-pulse pointer-events-none" />
                                )}

                                {/* Card Header */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                                            isCenter 
                                                ? 'bg-white/20 text-white shadow-inner shadow-white/20' 
                                                : 'bg-[#EDF6FF] dark:bg-[#0a1438] text-[#2463EB] dark:text-sky-400 border border-[#D9E8FA] dark:border-[#14235a]'
                                        }`}>
                                            <Icon className="w-6 h-6" />
                                        </div>

                                        {isCenter ? (
                                            <motion.div 
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 450, damping: 25 }}
                                                className="w-7 h-7 rounded-full bg-white text-[#2463EB] flex items-center justify-center shadow-md shadow-black/10"
                                            >
                                                <Check className="w-4 h-4 stroke-[3]" />
                                            </motion.div>
                                        ) : count > 0 ? (
                                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                {count} Active
                                            </span>
                                        ) : (
                                            <span className="text-[11px] text-[#7185A3] dark:text-slate-500 font-medium">
                                                {subCount} Units
                                            </span>
                                        )}
                                    </div>

                                    <h3 className={`text-lg sm:text-xl font-extrabold tracking-tight leading-snug line-clamp-2 ${
                                        isCenter ? 'text-white' : 'text-[#172B4D] dark:text-white'
                                    }`}>
                                        {industry}
                                    </h3>

                                    <p className={`mt-2 text-xs leading-relaxed line-clamp-3 ${
                                        isCenter ? 'text-blue-100 font-medium' : 'text-[#7185A3] dark:text-slate-400'
                                    }`}>
                                        {meta.tagline}
                                    </p>
                                </div>

                                {/* Card Footer & Action CTA */}
                                <div className={`pt-4 border-t flex items-center justify-between ${
                                    isCenter ? 'border-white/20' : 'border-slate-100 dark:border-[#14235a]/60'
                                }`}>
                                    <span className={`text-[11px] font-bold uppercase tracking-wider ${
                                        isCenter ? 'text-white/90' : 'text-[#2463EB] dark:text-sky-400'
                                    }`}>
                                        {isCenter 
                                            ? (isTransitioning ? 'Entering Workspace...' : 'Click to Select') 
                                            : 'Click to Select'
                                        }
                                    </span>
                                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-transform group-hover:translate-x-0.5 ${
                                        isCenter ? 'bg-white/15 text-white' : 'bg-slate-50 dark:bg-[#0a1438] text-slate-400'
                                    }`}>
                                        {isTransitioning && isCenter ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                                        ) : (
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Left/Right Floating Navigation Controls (Hidden during transition) */}
                {!isTransitioning && (
                    <>
                        <button
                            type="button"
                            onClick={handlePrev}
                            aria-label="Previous Industry"
                            className="absolute left-2 sm:left-6 z-40 w-11 h-11 rounded-2xl bg-white/90 dark:bg-[#070e28]/90 backdrop-blur-md text-[#172B4D] dark:text-white border border-[#D9E8FA] dark:border-[#14235a] shadow-lg shadow-sky-950/10 hover:bg-[#EDF6FF] dark:hover:bg-[#0e1d52] hover:border-[#2463EB]/50 transition-all flex items-center justify-center cursor-pointer group"
                        >
                            <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-200 group-hover:-translate-x-0.5 transition-transform" />
                        </button>

                        <button
                            type="button"
                            onClick={handleNext}
                            aria-label="Next Industry"
                            className="absolute right-2 sm:right-6 z-40 w-11 h-11 rounded-2xl bg-white/90 dark:bg-[#070e28]/90 backdrop-blur-md text-[#172B4D] dark:text-white border border-[#D9E8FA] dark:border-[#14235a] shadow-lg shadow-sky-950/10 hover:bg-[#EDF6FF] dark:hover:bg-[#0e1d52] hover:border-[#2463EB]/50 transition-all flex items-center justify-center cursor-pointer group"
                        >
                            <ChevronRight className="w-5 h-5 text-slate-700 dark:text-slate-200 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </>
                )}
            </div>

            {/* Position Indicator Dots */}
            {!isTransitioning && (
                <div className="flex items-center justify-center space-x-1.5 mt-5">
                    {industries.map((ind, idx) => (
                        <button
                            key={ind}
                            type="button"
                            onClick={() => {
                                setActiveIdx(idx);
                            }}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                idx === activeIdx 
                                    ? 'w-7 bg-[#2463EB]' 
                                    : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                            }`}
                            title={ind}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default Industry3DCarousel;
