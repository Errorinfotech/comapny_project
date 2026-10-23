import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    ChevronLeft, ChevronRight, Check, ArrowRight,
    Briefcase, Factory, ShoppingBag, UtensilsCrossed,
    GraduationCap, Car, Home, HeartPulse,
    Gamepad2, Compass, Wrench, Sparkles, Building2,
    Loader2, HelpCircle
} from 'lucide-react';

export const BUSINESS_SECTORS = [
  {
    type: "Service Business",
    icon: Briefcase,
    units: 8,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80" // Modern glass corporate tower
  },
  {
    type: "Manufacturing / Industrial",
    icon: Factory,
    units: 10,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" // High-tech industrial automation
  },
  {
    type: "Retail & Shopping",
    icon: ShoppingBag,
    units: 13,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80" // Luxury retail fashion store
  },
  {
    type: "Food & Beverage",
    icon: UtensilsCrossed,
    units: 10,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" // Modern restaurant dining lounge
  },
  {
    type: "Education",
    icon: GraduationCap,
    units: 8,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80" // Modern university campus
  },
  {
    type: "Automobile",
    icon: Car,
    units: 6,
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80" // Luxury automobile showroom
  },
  {
    type: "Home & Lifestyle",
    icon: Home,
    units: 5,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80" // High-end interior architectural design
  },
  {
    type: "Health & Wellness",
    icon: HeartPulse,
    units: 7,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80" // Modern healthcare clinical center
  },
  {
    type: "Entertainment",
    icon: Gamepad2,
    units: 2,
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80" // Cyber entertainment & gaming arena
  },
  {
    type: "Travel",
    icon: Compass,
    units: 2,
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80" // Luxury travel & global tourism
  },
  {
    type: "Repair & Service",
    icon: Wrench,
    units: 6,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80" // Precision technical maintenance & electronics
  },
  {
    type: "Additional Retail & Events",
    icon: Sparkles,
    units: 9,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80" // Grand banquet celebration & event gala
  }
];

const HorizontalBusinessMotionView = ({
    industries = [],
    selectedIndustry,
    onSelectBusiness,
    configuredCounts = {},
    subtypeCounts = {},
    onOpenSupport
}) => {
    const scrollContainerRef = useRef(null);
    const [clickedCard, setClickedCard] = useState(null);
    const [isZoomingOut, setIsZoomingOut] = useState(false);

    const handleScroll = (direction) => {
        if (!scrollContainerRef.current) return;
        const scrollAmount = direction === 'left' ? -340 : 340;
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    const handleWheel = (e) => {
        if (!scrollContainerRef.current) return;
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            scrollContainerRef.current.scrollLeft += e.deltaY;
        }
    };

    const handleCardClick = (type) => {
        if (isZoomingOut) return;
        setClickedCard(type);
        setIsZoomingOut(true);

        setTimeout(() => {
            onSelectBusiness(type);
        }, 420);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isZoomingOut ? { opacity: 0, scale: 0.85, filter: 'blur(6px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.85, filter: 'blur(6px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full relative pt-0 pb-4 select-none overflow-hidden"
        >
            {/* Background Atmosphere: Soft Ambient Glowing Orbs & Trajectory Line (Matches Reference Image) */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gradient-to-br from-blue-300/20 via-sky-200/10 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-tr from-sky-300/15 via-blue-200/5 to-transparent blur-3xl pointer-events-none" />

            {/* Header: Title Banner & Glide Controls */}
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-7 px-2">
                <div className="flex flex-col items-start space-y-2.5 max-w-3xl relative">
                    {/* 1. Top Kicker: EXPLORE • CONNECT • GROW (First / On Top) */}
                    <div className="w-fit">
                        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-white/95 via-[#F3F8FF]/85 to-white/95 dark:from-[#08122f]/95 dark:via-[#0c1c48]/85 dark:to-[#08122f]/95 backdrop-blur-xl border border-[#CBDCF8] dark:border-[#1E3A8A]/70 shadow-xs relative overflow-hidden group select-none">
                            {/* Micro Shimmer Light Sweep Effect */}
                            <motion.div
                                animate={{ x: ['-120%', '220%'] }}
                                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
                                className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-blue-400/20 to-transparent skew-x-12 pointer-events-none"
                            />

                            {/* Live Deep Navy Radar Signal Beacon */}
                            <div className="relative flex items-center justify-center w-2.5 h-2.5 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1E3A8A] opacity-60" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0f1d40] dark:bg-sky-400 ring-2 ring-blue-400/30 shadow-[0_0_6px_rgba(30,58,138,0.4)]" />
                            </div>

                            {/* Tri-Tone Deep Navy Journey: EXPLORE • CONNECT • GROW */}
                            <div 
                                className="flex items-center space-x-2 text-[10.5px] sm:text-[11.5px] font-extrabold tracking-[0.22em] uppercase"
                                style={{ fontFamily: "'Outfit', sans-serif" }}
                            >
                                <span className="text-[#0f1d40] dark:text-white">EXPLORE</span>
                                <span className="text-[#1E3A8A]/40 dark:text-sky-400/40 text-[9px]">&bull;</span>
                                <span className="text-[#1E3A8A] dark:text-sky-300">CONNECT</span>
                                <span className="text-[#1E3A8A]/40 dark:text-sky-400/40 text-[9px]">&bull;</span>
                                <span className="text-[#2563EB] dark:text-sky-400">GROW</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Main Headline (Directly Below Kicker) */}
                    <div className="relative w-fit">
                        <h2 className="text-4xl sm:text-5xl lg:text-[54px] leading-[1.1] tracking-tight flex flex-wrap items-baseline gap-x-3.5">
                            {/* "Select" in Light Geometric Sans (Deep Navy) */}
                            <span 
                                className="font-light text-[#0f1d40] dark:text-white tracking-[-0.02em]"
                                style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
                            >
                                Select
                            </span>

                            {/* "Business Type" in Italic Luxury Serif with Deep Navy Palette */}
                            <span className="relative inline-block">
                                <span 
                                    className="font-bold italic bg-gradient-to-r from-[#09152e] via-[#0f2752] to-[#1e3a8a] dark:from-white dark:via-slate-100 dark:to-sky-300 bg-clip-text text-transparent pr-1 tracking-tight"
                                    style={{ 
                                        fontFamily: "'Playfair Display', Georgia, serif"
                                    }}
                                >
                                    Business Type
                                </span>

                                {/* Animated Curved Underline Swoosh in Deep Navy */}
                                <svg 
                                    className="absolute -bottom-2.5 left-0 w-full h-3.5 overflow-visible pointer-events-none"
                                    viewBox="0 0 280 14" 
                                    fill="none"
                                >
                                    <motion.path 
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 1.2, delay: 0.25, ease: "easeOut" }}
                                        d="M 2 9 C 80 3, 200 2, 278 11" 
                                        stroke="url(#swoosh-grad)" 
                                        strokeWidth="2.8" 
                                        strokeLinecap="round" 
                                    />
                                    <defs>
                                        <linearGradient id="swoosh-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#0f1d40" stopOpacity="0.9" />
                                            <stop offset="65%" stopColor="#1e3a8a" stopOpacity="0.85" />
                                            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.15" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </span>
                        </h2>
                    </div>

                    {/* Subtitle */}
                    <p 
                        className="text-sm sm:text-[15px] text-[#486581] dark:text-slate-400 font-normal pt-1"
                        style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                        Click on any business to view its sub-business options.
                    </p>
                </div>

                {/* Right Action Controls: Client Support + Glide Buttons */}
                <div className="flex items-center space-x-2.5 self-start lg:self-end shrink-0 z-20">
                    {onOpenSupport && (
                        <button
                            type="button"
                            onClick={onOpenSupport}
                            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#070e28] text-slate-700 dark:text-white border border-[#D9E8FA] dark:border-[#14235a] shadow-xs hover:bg-[#EDF6FF] dark:hover:bg-[#101f56] hover:border-[#2463EB]/50 text-xs font-bold transition-all cursor-pointer group"
                        >
                            <HelpCircle className="w-4 h-4 text-[#2463EB] dark:text-sky-400 group-hover:scale-110 transition-transform" />
                            <span>Client Support</span>
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => handleScroll('left')}
                        className="w-10 h-10 rounded-2xl bg-white dark:bg-[#070e28] text-slate-700 dark:text-white border border-[#D9E8FA] dark:border-[#14235a] shadow-sm hover:bg-[#EDF6FF] dark:hover:bg-[#101f56] hover:border-[#2463EB]/50 flex items-center justify-center transition-all cursor-pointer group active:scale-95"
                        title="Scroll Left"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleScroll('right')}
                        className="w-10 h-10 rounded-2xl bg-white dark:bg-[#070e28] text-slate-700 dark:text-white border border-[#D9E8FA] dark:border-[#14235a] shadow-sm hover:bg-[#EDF6FF] dark:hover:bg-[#101f56] hover:border-[#2463EB]/50 flex items-center justify-center transition-all cursor-pointer group active:scale-95"
                        title="Scroll Right"
                    >
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Realistic Picture Cards Horizontal Track Container with Faded Edges */}
            <div className="relative w-full">
                {/* Left Edge Subtle Vignette Fade */}
                <div 
                    className="pointer-events-none absolute left-0 top-0 bottom-6 w-8 sm:w-14 bg-gradient-to-r from-[#e6f1fc]/70 dark:from-[#060b19]/70 to-transparent z-20" 
                    aria-hidden="true"
                />

                {/* Right Edge Subtle Vignette Fade */}
                <div 
                    className="pointer-events-none absolute right-0 top-0 bottom-6 w-8 sm:w-14 bg-gradient-to-l from-[#f6faff]/70 dark:from-[#060a17]/70 to-transparent z-20" 
                    aria-hidden="true"
                />

                {/* Horizontal Motion Track with Subtle CSS Feather Mask */}
                <div
                    ref={scrollContainerRef}
                    onWheel={handleWheel}
                    className="flex items-center space-x-6 overflow-x-auto pb-6 pt-2 px-4 sm:px-6 scroll-smooth no-scrollbar"
                    style={{ 
                        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20px, black calc(100% - 20px), transparent 100%)',
                        maskImage: 'linear-gradient(to right, transparent 0%, black 20px, black calc(100% - 20px), transparent 100%)',
                        scrollbarWidth: 'none', 
                        msOverflowStyle: 'none' 
                    }}
                >
                    {BUSINESS_SECTORS.map((sector, index) => {
                        const isSelected = sector.type === clickedCard;
                        const subtypeCount = subtypeCounts[sector.type] || sector.units;

                        return (
                            <motion.div
                                key={sector.type}
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: index * 0.04 }}
                                whileHover={!isZoomingOut ? { 
                                    y: -12, 
                                    scale: 1.04,
                                    transition: { type: "spring", stiffness: 380, damping: 24 }
                                } : {}}
                                whileTap={!isZoomingOut ? { scale: 0.97 } : {}}
                                onClick={() => handleCardClick(sector.type)}
                                className={`min-w-[280px] sm:min-w-[310px] max-w-[320px] h-[390px] sm:h-[420px] rounded-3xl cursor-pointer relative group overflow-hidden shrink-0 select-none shadow-xl border transition-all duration-500 ${
                                    isSelected
                                        ? 'ring-4 ring-[#2563EB] shadow-[0_0_35px_rgba(37,99,235,0.55)] scale-105 border-blue-400 z-10'
                                        : 'border-white/20 hover:border-sky-300 dark:hover:border-sky-400 hover:shadow-[0_24px_50px_-10px_rgba(15,29,64,0.35)] dark:hover:shadow-[0_24px_50px_-10px_rgba(37,99,235,0.30)]'
                                }`}
                            >
                                {/* Realistic Photographic Background Image with Smooth Depth Zoom */}
                                <img 
                                    src={sector.image} 
                                    alt={sector.type}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-112"
                                />

                                {/* Cinematic Realistic Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 via-35% to-black/10 transition-opacity duration-300 group-hover:via-black/55" />

                                {/* Subtle indicator if selected */}
                                {isSelected && (
                                    <div className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg animate-pulse">
                                        <Check className="w-4 h-4 stroke-[3]" />
                                    </div>
                                )}

                                {/* Card Bottom-Left Corner: Business Name and Sub-Businesses */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col items-start justify-end text-left pointer-events-none">
                                    <h3 
                                        className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-lg group-hover:text-sky-300 transition-colors"
                                        style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}
                                    >
                                        {sector.type}
                                    </h3>
                                    <p 
                                        className="text-sm font-semibold text-white/85 mt-1.5 drop-shadow-md tracking-wide"
                                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    >
                                        {subtypeCount} Sub-Businesses
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

export default HorizontalBusinessMotionView;
