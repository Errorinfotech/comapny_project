import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, ChevronRight, Check, ArrowRight,
    Briefcase, Factory, ShoppingBag, UtensilsCrossed,
    GraduationCap, Car, Home, HeartPulse,
    Gamepad2, Compass, Wrench, Sparkles, Building2,
    HelpCircle, Globe, Code, Palette, Megaphone,
    ExternalLink, Eye, Folder, FileText, ArrowUpRight
} from 'lucide-react';
import api, { BASE_URL, getStorageUrl } from '../../../api';
import ProjectDetailsModal from '../../../components/ProjectDetailsModal';

export const ALL_BUSINESSES_FILTER = { id: 'all-businesses', label: 'All Businesses', icon: Building2 };

export const SERVICE_FILTERS = [
    { id: 'website', label: 'Website', icon: Globe },
    { id: 'software', label: 'Software', icon: Code },
    { id: 'graphics', label: 'Graphics', icon: Palette },
    { id: 'digital-marketing', label: 'Digital Marketing', icon: Megaphone }
];

export const ALL_FILTERS = [ALL_BUSINESSES_FILTER, ...SERVICE_FILTERS];

export const BUSINESS_SECTORS = [
  {
    type: "Service Business",
    icon: Briefcase,
    units: 8,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
  },
  {
    type: "Manufacturing / Industrial",
    icon: Factory,
    units: 10,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"
  },
  {
    type: "Retail & Shopping",
    icon: ShoppingBag,
    units: 13,
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
  },
  {
    type: "Food & Beverage",
    icon: UtensilsCrossed,
    units: 10,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
  },
  {
    type: "Education",
    icon: GraduationCap,
    units: 8,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
  },
  {
    type: "Automobile",
    icon: Car,
    units: 6,
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80"
  },
  {
    type: "Home & Lifestyle",
    icon: Home,
    units: 5,
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
  },
  {
    type: "Health & Wellness",
    icon: HeartPulse,
    units: 7,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
  },
  {
    type: "Entertainment",
    icon: Gamepad2,
    units: 2,
    image: "https://images.unsplash.com/photo-1511512578044-dfb367046420?auto=format&fit=crop&w=800&q=80"
  },
  {
    type: "Travel",
    icon: Compass,
    units: 2,
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"
  },
  {
    type: "Repair & Service",
    icon: Wrench,
    units: 6,
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
  },
  {
    type: "Additional Retail & Events",
    icon: Sparkles,
    units: 9,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80"
  }
];



const CATEGORY_DEFAULT_IMAGES = {
    website: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    software: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    graphics: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
    'digital-marketing': "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80"
};

const HorizontalBusinessMotionView = ({
    industries = [],
    selectedIndustry,
    onSelectBusiness,
    configuredCounts = {},
    subtypeCounts = {},
    onOpenSupport,
    activeServiceFilter = 'website',
    onServiceFilterChange
}) => {
    const [localServiceFilter, setLocalServiceFilter] = useState(activeServiceFilter);
    const [dbProjects, setDbProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [clickedCard, setClickedCard] = useState(null);
    const [isZoomingOut, setIsZoomingOut] = useState(false);
    const [detailsProject, setDetailsProject] = useState(null);

    const carouselRef = useRef(null);
    const lastWheelTime = useRef(0);

    const currentServiceFilter = activeServiceFilter !== undefined ? activeServiceFilter : localServiceFilter;

    // Fetch projects dynamically from /api/projects/portal
    useEffect(() => {
        let isMounted = true;
        const fetchProjects = async () => {
            try {
                setLoadingProjects(true);
                const { data } = await api.get('/projects/portal');
                if (isMounted) {
                    setDbProjects(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Failed to fetch portal projects", err);
            } finally {
                if (isMounted) setLoadingProjects(false);
            }
        };
        fetchProjects();
        return () => { isMounted = false; };
    }, []);

    // Filter projects dynamically based on current selected service filter
    const activeCards = useMemo(() => {
        // 1. "All Businesses" filter: displays all Commercial Business Sectors
        if (currentServiceFilter === 'all-businesses') {
            return BUSINESS_SECTORS.map((sector) => ({
                _id: sector.type,
                title: sector.type,
                type: sector.type,
                units: subtypeCounts[sector.type] || sector.units,
                image: sector.image,
                isBusinessSector: true
            }));
        }

        // 2. Service Project Filters: website, software, graphics, digital-marketing
        const all = dbProjects || [];
        let matched = [];

        if (currentServiceFilter === 'website') {
            matched = all.filter(p => {
                if (p.clientCategory) return p.clientCategory === 'website';
                const dept = (p.department?.name || '').toLowerCase();
                const title = (p.title || '').toLowerCase();
                const desc = (p.description || '').toLowerCase();
                return dept.includes('web') || dept.includes('developer') || dept.includes('frontend') ||
                       title.includes('web') || title.includes('kitchenware') || title.includes('qr') || title.includes('site') ||
                       desc.includes('website') || desc.includes('web') || desc.includes('store');
            });
        } else if (currentServiceFilter === 'software') {
            matched = all.filter(p => {
                if (p.clientCategory) return p.clientCategory === 'software';
                const dept = (p.department?.name || '').toLowerCase();
                const title = (p.title || '').toLowerCase();
                const desc = (p.description || '').toLowerCase();
                return dept.includes('software') || dept.includes('developer') || dept.includes('backend') ||
                       title.includes('admin') || title.includes('drive') || title.includes('game') || title.includes('panel') ||
                       desc.includes('admin') || desc.includes('system') || desc.includes('software');
            });
        } else if (currentServiceFilter === 'graphics') {
            matched = all.filter(p => {
                if (p.clientCategory) return p.clientCategory === 'graphics';
                const dept = (p.department?.name || '').toLowerCase();
                const title = (p.title || '').toLowerCase();
                const desc = (p.description || '').toLowerCase();
                return dept.includes('graphic') || dept.includes('design') || dept.includes('ui') ||
                       title.includes('design') || title.includes('graphic') || title.includes('logo') ||
                       desc.includes('design') || desc.includes('graphic') || desc.includes('brand');
            });
        } else if (currentServiceFilter === 'digital-marketing') {
            matched = all.filter(p => {
                if (p.clientCategory) return p.clientCategory === 'digital-marketing';
                const dept = (p.department?.name || '').toLowerCase();
                const title = (p.title || '').toLowerCase();
                const desc = (p.description || '').toLowerCase();
                return dept.includes('marketing') || dept.includes('digital') || dept.includes('seo') ||
                       title.includes('marketing') || title.includes('seo') || title.includes('social') ||
                       desc.includes('marketing') || desc.includes('campaign') || desc.includes('social');
            });
        }

        return matched;
    }, [dbProjects, currentServiceFilter, subtypeCounts]);

    const total = activeCards.length;

    // Reset center card when switching category
    const handleFilterClick = (filterId) => {
        setLocalServiceFilter(filterId);
        setActiveIndex(0);
        if (onServiceFilterChange) {
            onServiceFilterChange(filterId);
        }
    };

    const goToPrev = useCallback(() => {
        if (isZoomingOut || total === 0) return;
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
    }, [isZoomingOut, total]);

    const goToNext = useCallback(() => {
        if (isZoomingOut || total === 0) return;
        setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
    }, [isZoomingOut, total]);

    // Keyboard navigation (ArrowLeft & ArrowRight)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (total === 0) return;
            if (e.key === 'ArrowLeft') {
                goToPrev();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            } else if (e.key === 'Enter') {
                const currentCard = activeCards[activeIndex];
                if (currentCard) handleCardClick(currentCard, activeIndex);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToPrev, goToNext, activeIndex, activeCards, total]);

    // Non-passive wheel event listener: explicitly block browser history swipe-back gestures!
    useEffect(() => {
        const stage = carouselRef.current;
        if (!stage) return;

        const handleWheelEvent = (e) => {
            const absX = Math.abs(e.deltaX);
            const absY = Math.abs(e.deltaY);

            // Any horizontal gesture over the carousel MUST be prevented from reaching browser history
            if (absX > 4 || absX > absY) {
                if (e.cancelable) {
                    e.preventDefault();
                }
            }

            const now = Date.now();
            if (now - lastWheelTime.current < 220) return; // Smooth throttle

            if (absX > 15) {
                if (e.cancelable) e.preventDefault();
                if (e.deltaX > 0) goToNext();
                else goToPrev();
                lastWheelTime.current = now;
            } else if (absY > 25) {
                if (e.cancelable) e.preventDefault();
                if (e.deltaY > 0) goToNext();
                else goToPrev();
                lastWheelTime.current = now;
            }
        };

        stage.addEventListener('wheel', handleWheelEvent, { passive: false });
        return () => {
            stage.removeEventListener('wheel', handleWheelEvent);
        };
    }, [goToNext, goToPrev]);

    // Swipe / Drag handler
    const handleDragEnd = (_, info) => {
        const threshold = 40;
        if (info.offset.x < -threshold) {
            goToNext();
        } else if (info.offset.x > threshold) {
            goToPrev();
        }
    };

    const handleCardClick = (card, index) => {
        if (isZoomingOut) return;

        // If clicking a side card, bring it to center first
        if (index !== undefined && index !== activeIndex) {
            setActiveIndex(index);
            return;
        }

        // If clicking a business sector card from "All Businesses", navigate to its sub-businesses!
        if (card.isBusinessSector || currentServiceFilter === 'all-businesses') {
            setClickedCard(card.type || card.title);
            setIsZoomingOut(true);

            setTimeout(() => {
                if (onSelectBusiness) {
                    onSelectBusiness(card.type || card.title);
                }
            }, 380);
            return;
        }

        // Clicking the active center project card opens the Project Details Modal
        setClickedCard(card._id || card.title);
        setDetailsProject(card);
    };

    const currentFilterObj = ALL_FILTERS.find(f => f.id === currentServiceFilter);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={isZoomingOut ? { opacity: 0, scale: 0.85, filter: 'blur(6px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.85, filter: 'blur(6px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full relative pt-0 pb-4 select-none overflow-hidden"
        >
            {/* Background Atmosphere: Soft Ambient Glowing Orbs */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gradient-to-br from-blue-300/20 via-sky-200/10 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-tr from-sky-300/15 via-blue-200/5 to-transparent blur-3xl pointer-events-none" />

            {/* Header: Title Banner & Filter Controls */}
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-5 px-2">
                <div className="flex flex-col items-start space-y-2.5 max-w-3xl relative">
                    {/* 1. Top Kicker: EXPLORE • CONNECT • GROW */}
                    <div className="w-fit">
                        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-white/95 via-[#F3F8FF]/85 to-white/95 dark:from-[#08122f]/95 dark:via-[#0c1c48]/85 dark:to-[#08122f]/95 backdrop-blur-xl border border-[#CBDCF8] dark:border-[#1E3A8A]/70 shadow-xs relative overflow-hidden group select-none">
                            <motion.div
                                animate={{ x: ['-120%', '220%'] }}
                                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
                                className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-blue-400/20 to-transparent skew-x-12 pointer-events-none"
                            />

                            <div className="relative flex items-center justify-center w-2.5 h-2.5 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1E3A8A] opacity-60" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0f1d40] dark:bg-sky-400 ring-2 ring-blue-400/30 shadow-[0_0_6px_rgba(30,58,138,0.4)]" />
                            </div>

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

                    {/* 2. Main Headline */}
                    <div className="relative w-fit">
                        <h2 className="text-4xl sm:text-5xl lg:text-[54px] leading-[1.1] tracking-tight flex flex-wrap items-baseline gap-x-3.5">
                            <span 
                                className="font-light text-[#0f1d40] dark:text-white tracking-[-0.02em]"
                                style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
                            >
                                {currentServiceFilter === 'all-businesses' ? 'Select' : 'Featured'}
                            </span>

                            <span className="relative inline-block">
                                <span 
                                    className="font-bold italic bg-gradient-to-r from-[#09152e] via-[#0f2752] to-[#1e3a8a] dark:from-white dark:via-slate-100 dark:to-sky-300 bg-clip-text text-transparent pr-1 tracking-tight"
                                    style={{ 
                                        fontFamily: "'Playfair Display', Georgia, serif"
                                    }}
                                >
                                    {currentServiceFilter === 'all-businesses' ? 'Business Type' : (currentFilterObj?.label || 'Projects')}
                                </span>

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
                                        stroke="url(#swoosh-grad-dyn)" 
                                        strokeWidth="2.8" 
                                        strokeLinecap="round" 
                                    />
                                    <defs>
                                        <linearGradient id="swoosh-grad-dyn" x1="0%" y1="0%" x2="100%" y2="0%">
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
                        {currentServiceFilter === 'all-businesses'
                            ? 'Swipe or click any card to center, then click to view its sub-business options.'
                            : 'Swipe or click any card to center, then click to view project details & live demo.'}
                    </p>
                </div>

                {/* Right Action Controls: All Businesses on top + Service Filters below + Client Support & Prev/Next */}
                <div className="flex flex-col items-start lg:items-end space-y-2.5 self-start lg:self-start lg:pt-1 shrink-0 z-20">
                    {/* Top Row: Standalone "All Businesses" Pill (Green Box area) */}
                    <button
                        type="button"
                        onClick={() => handleFilterClick('all-businesses')}
                        className={`inline-flex items-center space-x-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border select-none ${
                            currentServiceFilter === 'all-businesses'
                                ? 'bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white border-blue-600 shadow-md shadow-blue-500/20'
                                : 'bg-white/95 dark:bg-[#070e28]/95 backdrop-blur-xl border-[#CBDCF8] dark:border-[#1E3A8A]/60 text-slate-700 dark:text-slate-300 hover:text-[#1E3A8A] dark:hover:text-white hover:bg-[#EDF6FF] dark:hover:bg-[#101f56]/60 shadow-xs'
                        }`}
                    >
                        <Building2 className={`w-3.5 h-3.5 ${currentServiceFilter === 'all-businesses' ? 'text-white' : 'text-[#2563EB] dark:text-sky-400'}`} />
                        <span>All Businesses</span>
                    </button>

                    {/* Service Category Filter Pills: Website, Software, Graphics, Digital Marketing */}
                    <div className="inline-flex flex-wrap items-center p-1 rounded-2xl bg-white/95 dark:bg-[#070e28]/95 backdrop-blur-xl border border-[#CBDCF8] dark:border-[#1E3A8A]/60 shadow-xs gap-1 select-none">
                        {SERVICE_FILTERS.map((item) => {
                            const IconComponent = item.icon;
                            const isSelected = currentServiceFilter === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleFilterClick(item.id)}
                                    className={`relative flex items-center space-x-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                        isSelected
                                            ? 'text-white shadow-xs'
                                            : 'text-slate-600 dark:text-slate-300 hover:text-[#1E3A8A] dark:hover:text-white hover:bg-[#EDF6FF] dark:hover:bg-[#101f56]/60'
                                    }`}
                                >
                                    {isSelected && (
                                        <motion.div
                                            layoutId="activeServiceFilterPill"
                                            className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] shadow-sm shadow-blue-500/25 -z-10"
                                            transition={{ type: "spring", stiffness: 450, damping: 35 }}
                                        />
                                    )}
                                    <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#2563EB] dark:text-sky-400'}`} />
                                    <span>{item.label}</span>
                                </button>
                            );
                        })}
                    </div>


                </div>
            </div>

            {/* 3D Coverflow Carousel Stage / Empty State */}
            {total === 0 ? (
                <div className="relative w-full h-[360px] sm:h-[420px] flex flex-col items-center justify-center p-8 text-center rounded-3xl border border-dashed border-sky-200/80 dark:border-[#192b68] bg-white/50 dark:bg-[#08102a]/50 backdrop-blur-md my-4 shadow-sm">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/20 border border-blue-300/30 flex items-center justify-center mb-4 text-[#1E3A8A] dark:text-sky-400">
                        <Folder className="w-8 h-8 opacity-70" />
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-2">
                        No Projects in {currentFilterObj?.label || 'This Category'} Yet
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                        There are currently no projects published in this category. As soon as Admin publishes projects, they will automatically appear here dynamically.
                    </p>
                </div>
            ) : (
                <div 
                    ref={carouselRef}
                    className="relative w-full h-[430px] sm:h-[470px] flex items-center justify-center overflow-hidden py-4 cursor-grab active:cursor-grabbing select-none"
                    style={{ 
                        perspective: '1100px',
                        overscrollBehaviorX: 'none',
                        touchAction: 'pan-y'
                    }}
                >
                {/* Drag interaction wrapper */}
                <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                    className="relative w-full h-full flex items-center justify-center"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {activeCards.map((project, index) => {
                        const offset = index - activeIndex;
                        const isCenter = offset === 0;
                        const isSelected = (project._id || project.title) === clickedCard;

                        // Only render cards within reasonable distance to keep performance smooth
                        if (Math.abs(offset) > 4) return null;

                        // Calculate Coverflow 3D Transform values
                        let translateX = 0;
                        let rotateY = 0;
                        let scale = 1;
                        let zIndex = 30;
                        let opacity = 1;

                        if (offset === 0) {
                            translateX = 0;
                            rotateY = 0;
                            scale = 1.05;
                            zIndex = 30;
                            opacity = 1;
                        } else if (offset < 0) {
                            // Left side cards
                            const distance = Math.abs(offset);
                            translateX = -170 - (distance - 1) * 125;
                            rotateY = Math.min(48, 38 + distance * 4);
                            scale = Math.max(0.68, 0.88 - distance * 0.08);
                            zIndex = 30 - distance;
                            opacity = Math.max(0.35, 1 - distance * 0.22);
                        } else {
                            // Right side cards
                            const distance = Math.abs(offset);
                            translateX = 170 + (distance - 1) * 125;
                            rotateY = -Math.min(48, 38 + distance * 4);
                            scale = Math.max(0.68, 0.88 - distance * 0.08);
                            zIndex = 30 - distance;
                            opacity = Math.max(0.35, 1 - distance * 0.22);
                        }

                        const isBusiness = Boolean(project.isBusinessSector || currentServiceFilter === 'all-businesses');

                        // Get image URL: thumbnail or fallback category photography
                        const defaultImg = CATEGORY_DEFAULT_IMAGES[currentServiceFilter] || CATEGORY_DEFAULT_IMAGES.website;
                        const imageUrl = isBusiness
                            ? (project.image || defaultImg)
                            : (project.thumbnail ? getStorageUrl(project.thumbnail) : defaultImg);

                        const deptLabel = isBusiness
                            ? 'Commercial Sector'
                            : (project.department?.name || project.category || 'Error Infotech');

                        return (
                            <motion.div
                                key={project._id || project.title || project.type}
                                initial={false}
                                animate={{
                                    x: translateX,
                                    rotateY: rotateY,
                                    scale: scale,
                                    opacity: opacity,
                                    zIndex: zIndex,
                                }}
                                transition={{
                                    type: "spring",
                                    stiffness: 280,
                                    damping: 28,
                                    mass: 0.75
                                }}
                                whileHover={isCenter && !isZoomingOut ? { 
                                    scale: 1.08,
                                    y: -6,
                                    transition: { duration: 0.25 }
                                } : {}}
                                onClick={() => handleCardClick(project, index)}
                                className={`absolute w-[265px] sm:w-[305px] h-[375px] sm:h-[415px] rounded-3xl cursor-pointer overflow-hidden select-none border transition-shadow duration-300 ${
                                    isCenter
                                        ? 'border-white/30 shadow-[0_22px_55px_rgba(0,0,0,0.45)]'
                                        : 'border-white/10 shadow-lg'
                                }`}
                                style={{
                                    transformStyle: 'preserve-3d',
                                    WebkitBoxReflect: isCenter 
                                        ? 'below 6px linear-gradient(to bottom, transparent 75%, rgba(0, 0, 0, 0.25))' 
                                        : 'none'
                                }}
                            >
                                {/* Photographic Background Image */}
                                <img 
                                    src={imageUrl} 
                                    alt={project.title || project.type}
                                    loading="lazy"
                                    onError={(e) => {
                                        if (e.target.src !== defaultImg) {
                                            e.target.src = defaultImg;
                                        }
                                    }}
                                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${
                                        isCenter ? 'group-hover:scale-108' : 'scale-100'
                                    }`}
                                />

                                {/* Dark Gradient Overlay */}
                                <div className={`absolute inset-0 transition-colors duration-300 ${
                                    isCenter 
                                        ? 'bg-gradient-to-t from-black/95 via-black/40 to-black/15' 
                                        : 'bg-black/60 hover:bg-black/45'
                                }`} />

                                {/* Top Floating Badges */}
                                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-20 pointer-events-none">
                                    {isBusiness ? null : (
                                        <div />
                                    )}

                                    {isBusiness ? null : project.liveUrl ? (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="pointer-events-auto inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 transition-all hover:scale-105 active:scale-95 shadow-sm"
                                            title="Open Live Preview"
                                        >
                                            <span>Live</span>
                                            <ArrowUpRight className="w-3.5 h-3.5 text-white/90" />
                                        </a>
                                    ) : null}
                                </div>

                                {/* Card Bottom Details */}
                                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10 flex flex-col items-start justify-end text-left pointer-events-none">
                                    <h3 
                                        className={`font-black text-white tracking-tight leading-tight drop-shadow-lg transition-colors line-clamp-1 ${
                                            isCenter ? 'text-2xl sm:text-3xl text-white' : 'text-xl sm:text-2xl text-white/85'
                                        }`}
                                        style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}
                                    >
                                        {project.title || project.type}
                                    </h3>
                                    <p className="text-xs text-white/80 drop-shadow-md line-clamp-2 mt-1 leading-relaxed">
                                        {isBusiness
                                            ? `${project.units} Sub-Businesses available for deliverables & live deployment.`
                                            : (project.description || 'Enterprise project repository and client showcase deployment.')}
                                    </p>
                                    
                                    {isCenter && (
                                        <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-white/20 w-full justify-between">
                                            <span className="text-[11px] font-bold text-sky-300">
                                                {isBusiness
                                                    ? `${project.units} Sub-Categories`
                                                    : (project.files?.length ? `${project.files.length} Files` : 'Project Showcase')}
                                            </span>
                                            <span className="inline-flex items-center space-x-1 text-[11px] font-extrabold text-white bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                                                <span>{isBusiness ? 'Explore' : 'Details'}</span>
                                                <ArrowRight className="w-3 h-3" />
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Floating Quick Navigation Arrows on Left and Right of Carousel */}
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/85 dark:bg-[#070e28]/85 backdrop-blur-md text-slate-800 dark:text-white border border-white/60 dark:border-white/10 shadow-xl hover:scale-110 active:scale-95 flex items-center justify-center transition-all cursor-pointer hover:bg-white dark:hover:bg-[#101f56]"
                    title="Previous"
                >
                    <ChevronLeft className="w-6 h-6 -translate-x-0.5" />
                </button>
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); goToNext(); }}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/85 dark:bg-[#070e28]/85 backdrop-blur-md text-slate-800 dark:text-white border border-white/60 dark:border-white/10 shadow-xl hover:scale-110 active:scale-95 flex items-center justify-center transition-all cursor-pointer hover:bg-white dark:hover:bg-[#101f56]"
                    title="Next"
                >
                    <ChevronRight className="w-6 h-6 translate-x-0.5" />
                </button>
            </div>
            )}

            {/* View-Only Project Details Modal */}
            <ProjectDetailsModal
                project={detailsProject}
                isOpen={Boolean(detailsProject)}
                onClose={() => setDetailsProject(null)}
            />
        </motion.div>
    );
};

export default HorizontalBusinessMotionView;
