import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Briefcase, Check, ArrowLeft, ArrowRight, Loader2,
    Utensils, Hotel, Coffee, Pizza, Cake, Sparkles, ChefHat,
    Factory, Package, Scissors, Cpu, Pill, Armchair, Car, Boxes, Hammer, Sun,
    Calculator, Scale, Ship, Truck, Building2, Landmark, Zap,
    Shirt, ShoppingBag, Footprints, Gem, Smartphone, Laptop, Tv, Plug, Lightbulb, Wrench,
    School, GraduationCap, BookOpen, Languages, Monitor, Music,
    Home, Palette, Layers, Grid3X3, Droplets,
    HeartPulse, Dumbbell, Activity, Flower2, Eye, Microscope,
    Gamepad2, Ticket, Compass, Plane,
    Wind, Droplet, Camera, Store, Building, PartyPopper
} from 'lucide-react';
import { BUSINESS_SECTORS } from './HorizontalBusinessMotionView';

// Dedicated contextual icon for each specific sub-business
const SUBTYPE_ICONS = {
    // Food & Beverage
    "Restaurant": Utensils,
    "Hotel": Hotel,
    "Cafe": Coffee,
    "Fast Food": Utensils,
    "Bakery": Cake,
    "Juice Center": Droplets,
    "Tea Cafe": Coffee,
    "Pizza Outlet": Pizza,
    "Street Food": Store,
    "Cloud Kitchen": ChefHat,

    // Manufacturing / Industrial
    "Industrial & Heavy Manufacturing": Factory,
    "FMCG & Consumer Goods": Package,
    "Textile & Apparel": Scissors,
    "Electrical & Electronics": Cpu,
    "Chemical & Pharma": Pill,
    "Furniture & Wood": Armchair,
    "Automobile": Car,
    "Packaging": Boxes,
    "Building Materials": Hammer,
    "Renewable Energy": Sun,

    // Service Business
    "CA": Calculator,
    "Lawyers": Scale,
    "Consultants": Briefcase,
    "Import & Export": Ship,
    "Logistics & Supply Chain": Truck,
    "Real Estate & Infrastructure": Building2,
    "Finance & Insurance": Landmark,
    "Energy & Solar": Zap,

    // Retail & Shopping
    "Clothing Store": Shirt,
    "Saree Shop": Sparkles,
    "Bag Shop": ShoppingBag,
    "Footwear": Footprints,
    "Furniture": Armchair,
    "Jewellery": Gem,
    "Cosmetics": Sparkles,
    "Gift / Toy / Book": BookOpen,
    "Mobile Store": Smartphone,
    "Electronics": Laptop,
    "Home Appliances": Plug,
    "Lighting / LED": Lightbulb,
    "Hardware": Wrench,

    // Education
    "School": School,
    "College": GraduationCap,
    "Coaching": BookOpen,
    "Spoken English": Languages,
    "Computer Training": Monitor,
    "Play School": Sparkles,
    "Dance / Music / Art": Music,
    "Computer Exam Center": Laptop,

    // Automobile
    "Bike Showroom": Car,
    "Car Showroom": Car,
    "Used Cars": Car,
    "Car Accessories": Wrench,
    "Car Service": Wrench,
    "Bike Service": Wrench,

    // Home & Lifestyle
    "Interior Design": Palette,
    "Modular Kitchen": Home,
    "Curtain & Wallpaper": Layers,
    "Tile Showroom": Grid3X3,
    "Sanitary Ware": Droplets,

    // Health & Wellness
    "Hospital / Clinic": HeartPulse,
    "Gym": Dumbbell,
    "Yoga / Zumba": Activity,
    "Spa / Salon": Flower2,
    "Skin / Eye Clinic": Eye,
    "Physiotherapy": Activity,
    "Diagnostic Lab": Microscope,

    // Entertainment
    "Game Zone": Gamepad2,
    "Amusement Park": Ticket,

    // Travel
    "Travel Agency": Plane,
    "Tour Operator": Compass,

    // Repair & Service
    "Mobile Repair": Smartphone,
    "AC Service": Wind,
    "RO Water": Droplet,
    "Laundry": Shirt,
    "CCTV": Camera,
    "Pet & Hobby": Sparkles,

    // Additional Retail & Events
    "Pet Shop": Sparkles,
    "Department Store": Store,
    "Shopping Mall": Building,
    "Fashion Retail": ShoppingBag,
    "Electronic Retail": Tv,
    "Banquet Hall": PartyPopper,
    "Party Plot": PartyPopper,
    "Event Management": PartyPopper,
    "Photography Studio": Camera
};

// Desktop Multi-Corner + Perimeter Edge Origins
const DESKTOP_CORNER_ORIGINS = [
    { x: -520, y: -380, rotate: -18 }, // Top-Left Desktop Corner
    { x: 520, y: -380, rotate: 18 },   // Top-Right Desktop Corner
    { x: -520, y: 380, rotate: 16 },   // Bottom-Left Desktop Corner
    { x: 520, y: 380, rotate: -16 },   // Bottom-Right Desktop Corner
    { x: 0, y: -450, rotate: -8 },     // Top Screen Edge
    { x: 0, y: 450, rotate: 8 },       // Bottom Screen Edge
    { x: -580, y: 0, rotate: -12 },    // Far-Left Edge
    { x: 580, y: 0, rotate: 12 }       // Far-Right Edge
];

/**
 * SubBusinessMotionView (STEP 2)
 * Features "Desktop Multi-Corner Fly-in + Center Gather Reveal":
 * Displays unique, tailored contextual icons for each sub-business with modern, clean styling.
 */
const SubBusinessMotionView = ({
    parentBusiness,
    subtypes = [],
    selectedSubtype,
    onSelectSubtype,
    onBackToBusinesses,
    configuredSubtypes = []
}) => {
    const [clickedSub, setClickedSub] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const sectorItem = BUSINESS_SECTORS.find(i => i.type === parentBusiness) || BUSINESS_SECTORS[0];
    const ParentIcon = sectorItem.icon || Briefcase;

    const handleCardClick = (sub) => {
        if (isTransitioning) return;
        setClickedSub(sub);
        setIsTransitioning(true);

        setTimeout(() => {
            onSelectSubtype(sub);
        }, 380);
    };

    return (
        <div className="w-full relative py-2 select-none overflow-hidden">
            {/* Soft Ambient Background Glows */}
            <div className="absolute top-0 right-1/4 -mt-20 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400/12 via-sky-300/6 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 -mb-20 w-96 h-96 rounded-full bg-gradient-to-tr from-sky-400/12 via-blue-300/6 to-transparent blur-3xl pointer-events-none" />

            {/* Top Navigation & Direct Business Title */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto mb-8 sm:mb-10 px-4">
                {/* Back Button & Category Kicker Pill */}
                <div className="flex items-center space-x-3 mb-4">
                    <button
                        type="button"
                        onClick={onBackToBusinesses}
                        className="inline-flex items-center space-x-2 px-4 py-2 rounded-2xl bg-white dark:bg-[#070e28] text-slate-700 dark:text-white border border-[#D9E8FA] dark:border-[#14235a] shadow-xs hover:bg-[#EDF6FF] dark:hover:bg-[#101f56] hover:border-[#2463EB]/50 text-xs font-bold transition-all cursor-pointer group active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4 text-[#2463EB] dark:text-sky-400 group-hover:-translate-x-1 transition-transform" />
                        <span>Back to Businesses</span>
                    </button>

                    <div className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-[#EDF6FF] dark:bg-[#0c1a44] border border-[#D9E8FA] dark:border-[#14235a] text-xs font-extrabold text-[#1E3A8A] dark:text-sky-300">
                        <ParentIcon className="w-3.5 h-3.5 text-[#2463EB]" />
                        <span>{parentBusiness}</span>
                        <span className="text-[10px] text-slate-500 font-bold bg-white dark:bg-[#070e28] px-2 py-0.5 rounded-lg border border-slate-200/80 dark:border-[#14235a]">
                            {subtypes.length} Sectors
                        </span>
                    </div>
                </div>

                {/* Main Headline: Directly stating which business's sub-businesses these are */}
                <div className="relative">
                    <h2 className="text-3xl sm:text-4xl lg:text-[46px] leading-[1.15] font-extrabold tracking-tight flex flex-wrap items-baseline justify-center gap-x-3">
                        <span 
                            className="font-light text-[#0f1d40] dark:text-white tracking-[-0.02em]"
                            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
                        >
                            Sub-Businesses of
                        </span>

                        <span className="relative inline-block">
                            <span 
                                className="font-bold italic bg-gradient-to-r from-[#09152e] via-[#0f2752] to-[#1e3a8a] dark:from-white dark:via-slate-100 dark:to-sky-300 bg-clip-text text-transparent pr-1"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                            >
                                {parentBusiness}
                            </span>

                            {/* Animated Curved Swoosh in Deep Navy */}
                            <svg 
                                className="absolute -bottom-2.5 left-0 w-full h-3.5 overflow-visible pointer-events-none"
                                viewBox="0 0 280 14" 
                                fill="none"
                            >
                                <motion.path 
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                                    d="M 2 9 C 80 3, 200 2, 278 11" 
                                    stroke="url(#sub-swoosh-grad)" 
                                    strokeWidth="2.8" 
                                    strokeLinecap="round" 
                                />
                                <defs>
                                    <linearGradient id="sub-swoosh-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#0f1d40" stopOpacity="0.9" />
                                        <stop offset="65%" stopColor="#1e3a8a" stopOpacity="0.85" />
                                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0.15" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </span>
                    </h2>
                </div>

                <p 
                    className="text-xs sm:text-sm text-[#486581] dark:text-slate-400 font-normal pt-3 max-w-lg"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                    Click any sub-business below to explore and configure its client deliverables.
                </p>
            </div>

            {/* Centered Sub-Business Cards Grid */}
            <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
                    {subtypes.map((sub, idx) => {
                        const isSelected = sub === clickedSub;
                        const isConfigured = configuredSubtypes.includes(sub);

                        // Pick distinct desktop corner origin for each card
                        const origin = DESKTOP_CORNER_ORIGINS[idx % DESKTOP_CORNER_ORIGINS.length];

                        // Lookup specific icon for this sub-business, fallback to parent icon
                        const SpecificIcon = SUBTYPE_ICONS[sub] || ParentIcon;

                        // Index string (e.g. 01, 02...)
                        const indexStr = String(idx + 1).padStart(2, '0');

                        return (
                            <motion.div
                                key={sub}
                                initial={{ 
                                    opacity: 0, 
                                    x: origin.x, 
                                    y: origin.y, 
                                    rotate: origin.rotate,
                                    scale: 0.55,
                                    filter: 'blur(8px)'
                                }}
                                animate={
                                    isTransitioning
                                        ? isSelected
                                            ? { 
                                                opacity: 1, 
                                                scale: 1.05, 
                                                filter: 'blur(0px)',
                                                zIndex: 40 
                                            }
                                            : { 
                                                opacity: 0.2, 
                                                scale: 0.92, 
                                                filter: 'blur(4px)',
                                                transition: { duration: 0.3 } 
                                            }
                                        : { 
                                            opacity: 1, 
                                            x: 0, 
                                            y: 0, 
                                            rotate: 0,
                                            scale: 1, 
                                            filter: 'blur(0px)' 
                                        }
                                }
                                transition={{
                                    duration: 0.65,
                                    delay: 0.04 + (idx * 0.035),
                                    ease: [0.16, 1, 0.3, 1] // Apple fluid curve: smooth acceleration and ultra-soft landing
                                }}
                                whileHover={!isTransitioning ? { 
                                    y: -8, 
                                    scale: 1.03,
                                    transition: { type: "spring", stiffness: 400, damping: 25 }
                                } : {}}
                                whileTap={!isTransitioning ? { scale: 0.98 } : {}}
                                onClick={() => handleCardClick(sub)}
                                className={`h-[185px] rounded-3xl p-5 sm:p-6 flex flex-col justify-between cursor-pointer relative overflow-hidden select-none border transition-all duration-300 group ${
                                    isSelected
                                        ? 'bg-gradient-to-br from-[#2563EB] via-[#1d4ed8] to-[#1E3A8A] text-white border-blue-400 ring-4 ring-blue-500/50 shadow-2xl shadow-blue-600/40'
                                        : 'bg-white/95 dark:bg-[#070e28]/95 backdrop-blur-2xl border-[#D9E8FA] dark:border-[#14235a] shadow-sm hover:border-[#2563EB] dark:hover:border-sky-400 hover:shadow-[0_22px_45px_-10px_rgba(37,99,235,0.32)] dark:hover:shadow-[0_22px_45px_-10px_rgba(37,99,235,0.42)]'
                                }`}
                            >
                                {/* Diagonal Shimmer Light Sweep on Hover */}
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-[220%] transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/40 dark:via-sky-400/15 to-transparent skew-x-12 pointer-events-none" />

                                {/* Ambient Corner Radial Glow matching Deep Navy theme */}
                                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-blue-500/15 via-sky-400/5 to-transparent rounded-bl-full pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100" />

                                {/* Top Row: Specific Sub-Business Icon, Index, and Action Indicator */}
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center space-x-2.5">
                                        {/* Clean Minimalist Icon Badge (No bulky metallic bubble) */}
                                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                                            isSelected
                                                ? 'bg-white/20 text-white shadow-inner'
                                                : 'bg-blue-50 dark:bg-[#0a163a] text-[#2563EB] dark:text-sky-400 border border-blue-200/60 dark:border-[#1E3A8A]/60 shadow-xs group-hover:scale-110 group-hover:bg-[#2563EB] group-hover:text-white group-hover:border-transparent group-hover:shadow-[0_6px_18px_rgba(37,99,235,0.4)]'
                                        }`}>
                                            <SpecificIcon className="w-5 h-5 stroke-[2]" />
                                        </div>

                                        {/* Subtle Clean Index Number */}
                                        <span className={`text-[11px] font-bold tracking-wider font-mono transition-colors ${
                                            isSelected ? 'text-white/60' : 'text-slate-300 dark:text-slate-600 group-hover:text-blue-500/60'
                                        }`}>
                                            #{indexStr}
                                        </span>
                                    </div>

                                    {isSelected ? (
                                        <div className="w-8 h-8 rounded-full bg-white text-[#2563EB] flex items-center justify-center shadow-md animate-pulse">
                                            <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                                        </div>
                                    ) : isConfigured ? (
                                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span>Configured</span>
                                        </span>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-[#0a1438] text-slate-400 border border-slate-200/80 dark:border-[#14235a] group-hover:bg-[#2563EB] group-hover:text-white group-hover:border-transparent group-hover:shadow-md group-hover:scale-110 flex items-center justify-center transition-all duration-300">
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    )}
                                </div>

                                {/* Bottom Row: Sub-Business Title & Interactive Action Status */}
                                <div className="relative z-10">
                                    <h4 
                                        className={`text-[17px] sm:text-[18px] font-black leading-snug line-clamp-2 transition-colors duration-200 ${
                                            isSelected 
                                                ? 'text-white' 
                                                : 'text-[#0f1d40] dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-sky-300'
                                        }`}
                                        style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
                                    >
                                        {sub}
                                    </h4>

                                    <div className="flex items-center space-x-2 mt-2">
                                        <span className="relative flex h-2 w-2 shrink-0">
                                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                                isSelected ? 'bg-white' : 'bg-blue-400 group-hover:opacity-100'
                                            }`} />
                                            <span className={`relative inline-flex rounded-full h-2 w-2 ${
                                                isSelected ? 'bg-white' : 'bg-[#2563EB] dark:bg-sky-400'
                                            }`} />
                                        </span>
                                        <span 
                                            className={`text-[11.5px] font-bold tracking-wide transition-colors ${
                                                isSelected ? 'text-white/85' : 'text-slate-400 dark:text-slate-500 group-hover:text-[#2563EB] dark:group-hover:text-sky-300'
                                            }`}
                                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                        >
                                            {isSelected ? 'Opening Studio...' : 'Configure deliverables'}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SubBusinessMotionView;
