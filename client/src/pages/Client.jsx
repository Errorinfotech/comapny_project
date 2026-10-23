import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Link as LinkIcon, AlertCircle, Edit, Save, X, Plus, Trash2, ChevronDown, Check, Search, Briefcase, Layers3, Sparkles, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const businessData = [
  // 1. Service Business
  { type: "Service Business", subtype: "CA" },
  { type: "Service Business", subtype: "Lawyers" },
  { type: "Service Business", subtype: "Consultants" },
  { type: "Service Business", subtype: "Import & Export" },
  { type: "Service Business", subtype: "Logistics & Supply Chain" },
  { type: "Service Business", subtype: "Real Estate & Infrastructure" },
  { type: "Service Business", subtype: "Finance & Insurance" },
  { type: "Service Business", subtype: "Energy & Solar" },

  // 2. Manufacturing / Industrial
  { type: "Manufacturing / Industrial", subtype: "Industrial & Heavy Manufacturing" },
  { type: "Manufacturing / Industrial", subtype: "FMCG & Consumer Goods" },
  { type: "Manufacturing / Industrial", subtype: "Textile & Apparel" },
  { type: "Manufacturing / Industrial", subtype: "Electrical & Electronics" },
  { type: "Manufacturing / Industrial", subtype: "Chemical & Pharma" },
  { type: "Manufacturing / Industrial", subtype: "Furniture & Wood" },
  { type: "Manufacturing / Industrial", subtype: "Automobile" },
  { type: "Manufacturing / Industrial", subtype: "Packaging" },
  { type: "Manufacturing / Industrial", subtype: "Building Materials" },
  { type: "Manufacturing / Industrial", subtype: "Renewable Energy" },

  // 3. Retail & Shopping
  { type: "Retail & Shopping", subtype: "Clothing Store" },
  { type: "Retail & Shopping", subtype: "Saree Shop" },
  { type: "Retail & Shopping", subtype: "Bag Shop" },
  { type: "Retail & Shopping", subtype: "Footwear" },
  { type: "Retail & Shopping", subtype: "Furniture" },
  { type: "Retail & Shopping", subtype: "Jewellery" },
  { type: "Retail & Shopping", subtype: "Cosmetics" },
  { type: "Retail & Shopping", subtype: "Gift / Toy / Book" },
  { type: "Retail & Shopping", subtype: "Mobile Store" },
  { type: "Retail & Shopping", subtype: "Electronics" },
  { type: "Retail & Shopping", subtype: "Home Appliances" },
  { type: "Retail & Shopping", subtype: "Lighting / LED" },
  { type: "Retail & Shopping", subtype: "Hardware" },

  // 4. Food & Beverage
  { type: "Food & Beverage", subtype: "Hotel" },
  { type: "Food & Beverage", subtype: "Restaurant" },
  { type: "Food & Beverage", subtype: "Cafe" },
  { type: "Food & Beverage", subtype: "Fast Food" },
  { type: "Food & Beverage", subtype: "Bakery" },
  { type: "Food & Beverage", subtype: "Juice Center" },
  { type: "Food & Beverage", subtype: "Tea Cafe" },
  { type: "Food & Beverage", subtype: "Pizza Outlet" },
  { type: "Food & Beverage", subtype: "Street Food" },
  { type: "Food & Beverage", subtype: "Cloud Kitchen" },

  // 5. Education
  { type: "Education", subtype: "Coaching" },
  { type: "Education", subtype: "Spoken English" },
  { type: "Education", subtype: "Computer Training" },
  { type: "Education", subtype: "Play School" },
  { type: "Education", subtype: "Dance / Music / Art" },
  { type: "Education", subtype: "Computer Exam Center" },
  { type: "Education", subtype: "School" },
  { type: "Education", subtype: "College" },

  // 6. Automobile
  { type: "Automobile", subtype: "Bike Showroom" },
  { type: "Automobile", subtype: "Car Showroom" },
  { type: "Automobile", subtype: "Used Cars" },
  { type: "Automobile", subtype: "Car Accessories" },
  { type: "Automobile", subtype: "Car Service" },
  { type: "Automobile", subtype: "Bike Service" },

  // 7. Home & Lifestyle
  { type: "Home & Lifestyle", subtype: "Interior Design" },
  { type: "Home & Lifestyle", subtype: "Modular Kitchen" },
  { type: "Home & Lifestyle", subtype: "Curtain & Wallpaper" },
  { type: "Home & Lifestyle", subtype: "Tile Showroom" },
  { type: "Home & Lifestyle", subtype: "Sanitary Ware" },

  // 8. Health & Wellness
  { type: "Health & Wellness", subtype: "Gym" },
  { type: "Health & Wellness", subtype: "Yoga / Zumba" },
  { type: "Health & Wellness", subtype: "Spa / Salon" },
  { type: "Health & Wellness", subtype: "Skin / Eye Clinic" },
  { type: "Health & Wellness", subtype: "Physiotherapy" },
  { type: "Health & Wellness", subtype: "Diagnostic Lab" },
  { type: "Health & Wellness", subtype: "Hospital / Clinic" },

  // 9. Entertainment
  { type: "Entertainment", subtype: "Game Zone" },
  { type: "Entertainment", subtype: "Amusement Park" },

  // 10. Travel
  { type: "Travel", subtype: "Travel Agency" },
  { type: "Travel", subtype: "Tour Operator" },

  // 11. Repair & Service
  { type: "Repair & Service", subtype: "Mobile Repair" },
  { type: "Repair & Service", subtype: "AC Service" },
  { type: "Repair & Service", subtype: "RO Water" },
  { type: "Repair & Service", subtype: "Laundry" },
  { type: "Repair & Service", subtype: "CCTV" },
  { type: "Repair & Service", subtype: "Pet & Hobby" },

  // 12. Additional Retail & Events
  { type: "Additional Retail & Events", subtype: "Pet Shop" },
  { type: "Additional Retail & Events", subtype: "Department Store" },
  { type: "Additional Retail & Events", subtype: "Shopping Mall" },
  { type: "Additional Retail & Events", subtype: "Fashion Retail" },
  { type: "Additional Retail & Events", subtype: "Electronic Retail" },
  { type: "Additional Retail & Events", subtype: "Banquet Hall" },
  { type: "Additional Retail & Events", subtype: "Party Plot" },
  { type: "Additional Retail & Events", subtype: "Event Management" },
  { type: "Additional Retail & Events", subtype: "Photography Studio" }
];

const CustomSelect = ({ label, value, options, onChange, placeholder, disabled, icon: Icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = useMemo(() => {
        if (!search.trim()) return options;
        return options.filter((opt) => opt.toLowerCase().includes(search.toLowerCase()));
    }, [options, search]);

    return (
        <div className={`relative w-full ${isOpen ? 'z-50' : 'z-10'}`} ref={dropdownRef}>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                {label}
            </label>

            {/* Trigger Pill */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => {
                    if (!disabled) {
                        setIsOpen(!isOpen);
                        setSearch('');
                    }
                }}
                className={`w-full rounded-2xl p-4 text-left transition-all duration-200 flex items-center justify-between border cursor-pointer select-none ${
                    disabled
                        ? 'bg-slate-100/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60 cursor-not-allowed'
                        : isOpen
                        ? 'bg-white dark:bg-[#070e28] border-sky-400 dark:border-sky-500 ring-2 ring-sky-400/20 shadow-md text-slate-900 dark:text-white'
                        : 'bg-[#f8fbfe] dark:bg-[#0a1438] border-sky-100 dark:border-[#14235a] hover:border-sky-300 dark:hover:border-sky-500 text-slate-900 dark:text-white shadow-2xs'
                }`}
            >
                <div className="flex items-center space-x-3 truncate pr-2">
                    {Icon && (
                        <Icon className={`h-4 w-4 shrink-0 ${value ? 'text-blue-600 dark:text-sky-400' : 'text-slate-400'}`} />
                    )}
                    <span className={`text-sm font-semibold truncate ${value ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                        {value || placeholder}
                    </span>
                </div>
                <ChevronDown
                    className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-600 dark:text-sky-400' : ''
                    }`}
                />
            </button>

            {/* Dropdown Menu Popover with Custom Scrollbar */}
            <AnimatePresence>
                {isOpen && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-full mt-2 z-[100] rounded-2xl bg-white dark:bg-[#070e28] border border-sky-200/90 dark:border-[#14235a] shadow-2xl p-2.5 backdrop-blur-xl"
                    >
                        {/* Instant Search Filter for long lists */}
                        {options.length > 5 && (
                            <div className="relative mb-2 px-1">
                                <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Type to filter options..."
                                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0a1438] border border-sky-100 dark:border-[#14235a] text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                                    onClick={(e) => e.stopPropagation()}
                                    autoFocus
                                />
                            </div>
                        )}

                        {/* Options List with Smooth Mouse Scroll */}
                        <div className="max-h-60 overflow-y-auto space-y-1 pr-1 overscroll-contain">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt) => (
                                    <div
                                        key={opt}
                                        onClick={() => {
                                            onChange(opt);
                                            setIsOpen(false);
                                            setSearch('');
                                        }}
                                        className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                                            value === opt
                                                ? 'bg-sky-50 dark:bg-[#0d1c4e] text-blue-700 dark:text-sky-300 font-bold'
                                                : 'text-slate-700 dark:text-slate-200 hover:bg-sky-50/80 dark:hover:bg-white/5 hover:text-blue-700 dark:hover:text-sky-300'
                                        }`}
                                    >
                                        <span className="truncate pr-2">{opt}</span>
                                        {value === opt && (
                                            <Check className="h-4 w-4 text-blue-600 dark:text-sky-400 shrink-0" />
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="p-3 text-center text-xs text-slate-400">
                                    No matching options found
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Client = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const [selectedType, setSelectedType] = useState('');
    const [selectedSubtype, setSelectedSubtype] = useState('');
    const [clientLinks, setClientLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    // editForm is now an array of clients
    const [editForm, setEditForm] = useState([]);
    
    // Admin user assignment
    const [clientUsers, setClientUsers] = useState([]);

    // Fetch client users
    useEffect(() => {
        const fetchUsers = async () => {
            if (!isAdmin) return;
            try {
                const { data } = await api.get('/admin/employees');
                setClientUsers(data.filter(u => u.role === 'client'));
            } catch (error) {
                console.error("Error fetching users", error);
            }
        };
        fetchUsers();
    }, [isAdmin]);

    // Fetch dynamic links from the backend
    const fetchLinks = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/client-links');
            setClientLinks(data);
        } catch (error) {
            console.error("Error fetching client links", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    // Extract unique Business Types
    const businessTypes = useMemo(() => {
        const types = new Set(businessData.map(item => item.type));
        return Array.from(types);
    }, []);

    // Filter subtypes based on selected Business Type
    const availableSubtypes = useMemo(() => {
        if (!selectedType) return [];
        return businessData.filter(item => item.type === selectedType).map(item => item.subtype);
    }, [selectedType]);

    // Find the matching business based on type and subtype
    const matchingBusiness = useMemo(() => {
        if (!selectedType || !selectedSubtype) return null;
        return clientLinks.find(item => item.subtype === selectedSubtype) || null;
    }, [selectedType, selectedSubtype, clientLinks]);

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
        setSelectedSubtype(''); // Reset subtype when type changes
        setIsEditing(false);
    };

    const handleSubtypeChange = (e) => {
        setSelectedSubtype(e.target.value);
        setIsEditing(false);
    };

    const handleEditClick = () => {
        let initialClients = [];
        if (matchingBusiness?.clients && matchingBusiness.clients.length > 0) {
            initialClients = matchingBusiness.clients.map(c => ({
                businessName: c.businessName || '',
                link: c.link || '',
                userId: c.userId || ''
            }));
        } else if (matchingBusiness?.businessName) {
            // Migration fallback
            initialClients = [{ businessName: matchingBusiness.businessName, link: matchingBusiness.link, userId: '' }];
        } else {
            // Start with one empty slot
            initialClients = [{ businessName: '', link: '', userId: '' }];
        }
        setEditForm(initialClients);
        setIsEditing(true);
    };

    const handleAddClientRow = () => {
        setEditForm([...editForm, { businessName: '', link: '', userId: '' }]);
    };

    const handleRemoveClientRow = (index) => {
        const newForm = [...editForm];
        newForm.splice(index, 1);
        setEditForm(newForm);
    };

    const handleClientChange = (index, field, value) => {
        const newForm = [...editForm];
        newForm[index][field] = value;
        setEditForm(newForm);
    };

    const handleSave = async () => {
        // Filter out empty rows
        const validClients = editForm.filter(c => c.businessName.trim() !== '' && c.link.trim() !== '')
            .map(c => ({
                businessName: c.businessName,
                link: c.link,
                userId: c.userId ? c.userId : null
            }));
        
        try {
            await api.post('/client-links', {
                type: selectedType,
                subtype: selectedSubtype,
                clients: validClients
            });
            setIsEditing(false);
            fetchLinks();
        } catch (error) {
            console.error("Error saving link", error);
            alert("Failed to save link.");
        }
    };

    // Derived list of clients to show (migrating old single data as well)
    const displayClients = useMemo(() => {
        if (!matchingBusiness) return [];
        if (matchingBusiness.clients && matchingBusiness.clients.length > 0) {
            return matchingBusiness.clients.filter(c => c.businessName || c.link);
        }
        if (matchingBusiness.businessName && matchingBusiness.link) {
            return [{ businessName: matchingBusiness.businessName, link: matchingBusiness.link, userId: matchingBusiness.userId || '' }];
        }
        return [];
    }, [matchingBusiness]);

    // Active portals under the currently selected sector
    const activeSubtypesForSector = useMemo(() => {
        if (!selectedType) return [];
        return clientLinks.filter(l => l.type === selectedType);
    }, [selectedType, clientLinks]);

    // Count of configured portals per sector
    const sectorConfiguredMap = useMemo(() => {
        const counts = {};
        clientLinks.forEach(l => {
            if (l.type) counts[l.type] = (counts[l.type] || 0) + 1;
        });
        return counts;
    }, [clientLinks]);

    // Statistics for the top KPI Glass Cards
    const stats = useMemo(() => {
        const totalTypes = businessTypes.length;
        const totalSubtypes = businessData.length;
        const configuredCount = clientLinks.length;
        const totalLiveLinks = clientLinks.reduce((acc, curr) => {
            if (curr.clients && curr.clients.length > 0) {
                return acc + curr.clients.filter(c => c.link).length;
            }
            return acc + (curr.link ? 1 : 0);
        }, 0);

        return [
            {
                name: 'Commercial Sectors',
                value: totalTypes,
                subtext: 'Active Industry Verticals',
                badgeText: `${totalTypes} Verticals`,
                icon: Building2,
                iconStyle: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
                badgeStyle: 'bg-blue-50/80 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-900/50',
                hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-700/60'
            },
            {
                name: 'Business Sub-Types',
                value: totalSubtypes,
                subtext: 'Classified Deliverable Units',
                badgeText: `${totalSubtypes} Sub-Types`,
                icon: Briefcase,
                iconStyle: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
                badgeStyle: 'bg-emerald-50/80 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-900/50',
                hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700/60'
            },
            {
                name: 'Active Client Portals',
                value: configuredCount,
                subtext: 'Configured Enterprise Hubs',
                badgeText: `${configuredCount} Active ${configuredCount === 1 ? 'Hub' : 'Hubs'}`,
                icon: Layers3,
                iconStyle: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
                badgeStyle: 'bg-indigo-50/80 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200/60 dark:border-indigo-900/50',
                hoverBorder: 'hover:border-indigo-300 dark:hover:border-indigo-700/60'
            },
            {
                name: 'Live Deliverables',
                value: totalLiveLinks,
                subtext: 'Encrypted Gateway Links',
                badgeText: `${totalLiveLinks} Verified ${totalLiveLinks === 1 ? 'Link' : 'Links'}`,
                icon: Sparkles,
                iconStyle: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
                badgeStyle: 'bg-amber-50/80 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-900/50',
                hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-700/60'
            }
        ];
    }, [businessTypes, clientLinks]);

    // Group businessData by Sector for directory overview
    const sectorSummaries = useMemo(() => {
        const map = {};
        businessData.forEach(item => {
            if (!map[item.type]) {
                map[item.type] = {
                    type: item.type,
                    subtypes: [],
                    configuredHubs: 0
                };
            }
            map[item.type].subtypes.push(item.subtype);
        });
        clientLinks.forEach(link => {
            if (map[link.type]) {
                map[link.type].configuredHubs += 1;
            }
        });
        return Object.values(map);
    }, [clientLinks]);

    const selectorRef = useRef(null);

    const handleSelectSector = (sectorType) => {
        setSelectedType(sectorType);
        // If this sector has an active portal (like CA in Service Business), auto-load it!
        const match = clientLinks.find(l => l.type === sectorType);
        if (match) {
            setSelectedSubtype(match.subtype);
        } else {
            setSelectedSubtype('');
        }
        setIsEditing(false);
    };

    return (
        <div className="max-w-6xl mx-auto py-4 space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-sky-50 dark:bg-blue-950/40 text-blue-700 dark:text-sky-300 border border-sky-200/70 dark:border-[#14235a] text-xs font-bold mb-1.5">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Client Deliverables Engine</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-3">
                        <Building2 className="h-7 w-7 text-blue-600 dark:text-sky-400 shrink-0" />
                        <span>Client Development Directory</span>
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Configure, provision, and verify live client portal gateways across enterprise commercial sectors.
                    </p>
                </div>

                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-sky-50 dark:bg-blue-950/40 text-blue-700 dark:text-sky-300 border border-sky-200/60 dark:border-[#14235a] text-xs font-bold self-start sm:self-auto shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>System Gateway Online</span>
                </div>
            </div>

            {/* Precision Telemetry KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -3 }}
                        transition={{ delay: index * 0.05, duration: 0.25, ease: "easeOut" }}
                        className={`group relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md ${stat.hoverBorder} transition-all duration-200 cursor-pointer select-none`}
                    >
                        {/* Top Row: Icon + Status Tag */}
                        <div className="flex items-center justify-between">
                            <div className={`w-11 h-11 rounded-xl ${stat.iconStyle} flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}>
                                <stat.icon className="h-5 w-5" />
                            </div>

                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${stat.badgeStyle}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                                {stat.badgeText}
                            </span>
                        </div>

                        {/* Metric Counter */}
                        <div className="mt-4">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                {stat.value}
                            </span>
                        </div>

                        {/* Title & Subtext */}
                        <div className="mt-1">
                            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
                                {stat.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {stat.subtext}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Dropdown Selector Card (relative z-30 ensures popups stay strictly on top) */}
            <div
                ref={selectorRef}
                className="relative z-30 bg-white dark:bg-[#070e28] p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80 dark:border-[#14235a]"
            >
                <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100 dark:border-[#14235a]/60">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-sky-400" />
                        <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            Sector & Sub-Type Selector
                        </h2>
                    </div>
                    {selectedType && (
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedType('');
                                setSelectedSubtype('');
                                setIsEditing(false);
                            }}
                            className="text-xs font-semibold text-rose-500 hover:text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                        >
                            Reset Selection
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Dropdown 1: Business Type */}
                    <CustomSelect
                        label="Commercial Sector (Business Type)"
                        value={selectedType}
                        options={businessTypes}
                        onChange={(val) => {
                            setSelectedType(val);
                            // If this sector has an active portal, auto-select it!
                            const match = clientLinks.find(l => l.type === val);
                            setSelectedSubtype(match ? match.subtype : '');
                            setIsEditing(false);
                        }}
                        placeholder="-- Select Commercial Sector --"
                        icon={Building2}
                    />

                    {/* Dropdown 2: Sub-Type */}
                    <CustomSelect
                        label="Business Sub-Type"
                        value={selectedSubtype}
                        options={availableSubtypes}
                        onChange={(val) => {
                            setSelectedSubtype(val);
                            setIsEditing(false);
                        }}
                        disabled={!selectedType}
                        placeholder={selectedType ? "-- Select Business Sub-Type --" : "Select Commercial Sector first"}
                        icon={Briefcase}
                    />
                </div>

                {/* Direct Gateway Jump for Configured Subtypes in Selected Sector */}
                {activeSubtypesForSector.length > 0 && (
                    <div className="mt-4 p-3 rounded-xl bg-blue-50/70 dark:bg-[#0a1438] border border-blue-200/60 dark:border-[#14235a] flex flex-wrap items-center justify-between gap-2.5">
                        <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                Configured Hub in {selectedType}:
                            </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            {activeSubtypesForSector.map((linkItem) => {
                                const isActive = selectedSubtype === linkItem.subtype;
                                const clientName = linkItem.clients?.[0]?.businessName || linkItem.businessName || 'Client Portal';
                                return (
                                    <button
                                        key={linkItem._id || linkItem.subtype}
                                        type="button"
                                        onClick={() => {
                                            setSelectedSubtype(linkItem.subtype);
                                            setIsEditing(false);
                                        }}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 shadow-2xs ${
                                            isActive
                                                ? 'bg-gradient-to-b from-[#32509a] to-[#233c74] text-white shadow-[#233c74]/30 ring-2 ring-sky-400/40'
                                                : 'bg-white dark:bg-[#0d1c4e] text-blue-700 dark:text-sky-300 border border-blue-200 dark:border-[#14235a] hover:bg-blue-50'
                                        }`}
                                    >
                                        <span>{linkItem.subtype}: {clientName}</span>
                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Quick Industry Filter Bar */}
                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-[#14235a]/70">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                        Quick Filter by Sector:
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                        {businessTypes.map((type) => {
                            const isSelected = selectedType === type;
                            const hasData = sectorConfiguredMap[type] > 0;
                            return (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => handleSelectSector(type)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                                        isSelected
                                            ? 'bg-gradient-to-b from-[#32509a] to-[#233c74] text-white shadow-sm shadow-[#233c74]/35 scale-102'
                                            : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#0a1438] dark:hover:bg-[#101f56] text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-[#14235a]'
                                    }`}
                                >
                                    <span>{type}</span>
                                    {hasData && (
                                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                            isSelected ? 'bg-white/20 text-white' : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                        }`}>
                                            {sectorConfiguredMap[type]}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Commercial Ecosystem Directory & Active Portals (Shown when no subtype is selected) */}
            {(!selectedType || !selectedSubtype) && (
                <div className="relative z-10 space-y-8">
                    {/* Active Portals Section */}
                    {clientLinks.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                                        <Layers3 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        <span>Active Client Portals</span>
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Direct management and fast access to live client deliverables.
                                    </p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50">
                                    {clientLinks.length} Configured
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {clientLinks.map((item, idx) => {
                                    const linksCount = item.clients ? item.clients.length : (item.link ? 1 : 0);
                                    return (
                                        <div
                                            key={item._id || idx}
                                            className="rounded-2xl p-5 bg-white dark:bg-[#070e28] border border-slate-200/80 dark:border-[#14235a] shadow-xs hover:border-sky-300 dark:hover:border-sky-500 transition-all flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="flex items-center justify-between mb-2.5">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-50 dark:bg-[#0a1438] text-blue-700 dark:text-sky-300 border border-sky-200/60 dark:border-[#14235a]">
                                                        {item.type || 'Commercial'}
                                                    </span>
                                                    <span className="text-[11px] font-semibold text-slate-400">
                                                        {linksCount} {linksCount === 1 ? 'Portal' : 'Portals'}
                                                    </span>
                                                </div>

                                                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                                                    {item.subtype}
                                                </h3>

                                                <div className="space-y-1.5">
                                                    {item.clients && item.clients.length > 0 ? (
                                                        item.clients.slice(0, 3).map((c, cIdx) => (
                                                            <div
                                                                key={cIdx}
                                                                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0a1438]/80 border border-slate-100 dark:border-slate-800 text-xs font-medium flex items-center justify-between"
                                                            >
                                                                <span className="truncate pr-2 text-slate-700 dark:text-slate-300">
                                                                    {c.businessName || 'Client Portal'}
                                                                </span>
                                                                {c.link && (
                                                                    <a
                                                                        href={c.link.startsWith('http') ? c.link : `https://${c.link}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 font-semibold text-[11px]"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <span>Open</span>
                                                                        <ArrowUpRight className="h-3 w-3" />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        item.businessName && (
                                                            <div className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0a1438]/80 border border-slate-100 dark:border-slate-800 text-xs font-medium flex items-center justify-between">
                                                                <span className="truncate pr-2 text-slate-700 dark:text-slate-300">
                                                                    {item.businessName}
                                                                </span>
                                                                {item.link && (
                                                                    <a
                                                                        href={item.link.startsWith('http') ? item.link : `https://${item.link}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 font-semibold text-[11px]"
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    >
                                                                        <span>Open</span>
                                                                        <ArrowUpRight className="h-3 w-3" />
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedType(item.type);
                                                    setSelectedSubtype(item.subtype);
                                                    setIsEditing(false);
                                                }}
                                                className="mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold text-center bg-sky-50 hover:bg-sky-100 dark:bg-[#0a1438] dark:hover:bg-[#101f56] text-blue-700 dark:text-sky-300 border border-sky-200/70 dark:border-[#14235a] transition-all cursor-pointer flex items-center justify-center space-x-1.5"
                                            >
                                                <Edit className="h-3.5 w-3.5" />
                                                <span>Configure Sector Deliverables</span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Commercial Sectors Catalog (Grid showing all 11 verticals) */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                                    <Building2 className="h-4 w-4 text-blue-600 dark:text-sky-400" />
                                    <span>Commercial Verticals Catalog</span>
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Select any commercial vertical to configure sub-types and live portal gateways.
                                </p>
                            </div>
                            <span className="text-xs font-semibold text-slate-400">
                                {businessTypes.length} Verticals Available
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sectorSummaries.map((sector) => {
                                const isSelected = selectedType === sector.type;
                                return (
                                    <div
                                        key={sector.type}
                                        onClick={() => handleSelectSector(sector.type)}
                                        className={`rounded-2xl p-4 transition-all duration-200 cursor-pointer border flex flex-col justify-between ${
                                            isSelected
                                                ? 'bg-sky-50/80 dark:bg-[#0c1945] border-blue-500 dark:border-sky-400 shadow-sm ring-1 ring-sky-400/30'
                                                : 'bg-white dark:bg-[#070e28] border-slate-200/70 dark:border-[#14235a] hover:border-sky-300 dark:hover:border-sky-500/80 hover:shadow-xs'
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate pr-2">
                                                    {sector.type}
                                                </h3>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#0a1438] text-slate-600 dark:text-slate-300 shrink-0">
                                                    {sector.subtypes.length} Sub-Types
                                                </span>
                                            </div>

                                            <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
                                                {sector.subtypes.slice(0, 4).join(', ')}
                                                {sector.subtypes.length > 4 ? ` +${sector.subtypes.length - 4} more` : ''}
                                            </p>
                                        </div>

                                        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-[#14235a]/60 flex items-center justify-between text-xs">
                                            <span className={`text-[10.5px] font-semibold ${
                                                sector.configuredHubs > 0
                                                    ? 'text-emerald-600 dark:text-emerald-400'
                                                    : 'text-slate-400'
                                            }`}>
                                                {sector.configuredHubs > 0
                                                    ? `● ${sector.configuredHubs} Active ${sector.configuredHubs === 1 ? 'Hub' : 'Hubs'}`
                                                    : '○ Ready to provision'}
                                            </span>

                                            <span className="text-[11px] font-bold text-blue-600 dark:text-sky-400 inline-flex items-center gap-0.5">
                                                <span>Configure</span>
                                                <ArrowUpRight className="h-3 w-3" />
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Results Area */}
            {selectedType && selectedSubtype && !loading && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/90 dark:bg-[#070e28]/90 backdrop-blur-xl p-8 rounded-3xl shadow-lg shadow-sky-950/5 border border-sky-100/90 dark:border-[#14235a] relative min-h-[300px]"
                >
                    {isAdmin && !isEditing && (
                        <button
                            onClick={handleEditClick}
                            className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-700 rounded-xl transition-all z-10"
                            title="Edit Links"
                        >
                            <Edit className="h-5 w-5" />
                        </button>
                    )}

                    {isEditing ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Edit Client Links ({selectedSubtype})</h3>
                                <button
                                    onClick={handleAddClientRow}
                                    className="flex items-center space-x-2 text-sm font-bold text-blue-700 bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-xl transition-all"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Add Another Client</span>
                                </button>
                            </div>
                            
                            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                {editForm.map((client, index) => (
                                    <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700/50 relative group">
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Business Name</label>
                                            <input
                                                type="text"
                                                value={client.businessName}
                                                onChange={(e) => handleClientChange(index, 'businessName', e.target.value)}
                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
                                                placeholder="e.g. ABC Company"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Link (URL)</label>
                                            <input
                                                type="url"
                                                value={client.link}
                                                onChange={(e) => handleClientChange(index, 'link', e.target.value)}
                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Assign to Client (Optional)</label>
                                            <select
                                                value={client.userId || ''}
                                                onChange={(e) => handleClientChange(index, 'userId', e.target.value)}
                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 outline-none transition-all font-medium"
                                            >
                                                <option value="">-- No User Assigned --</option>
                                                {clientUsers.filter(u => u.clientSubtype === selectedSubtype).map(u => (
                                                    <option key={u._id} value={u._id}>@{u.username}</option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        <button 
                                            onClick={() => handleRemoveClientRow(index)}
                                            className="md:mt-7 self-end md:self-auto p-3 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                            title="Remove this link"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                ))}
                                {editForm.length === 0 && (
                                    <p className="text-slate-500 text-center py-4">No clients added yet. Click "Add Another Client" to start.</p>
                                )}
                            </div>

                            <div className="flex space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={handleSave}
                                    className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-blue-600/20"
                                >
                                    <Save className="h-4 w-4" />
                                    <span>Save All Links</span>
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="flex items-center space-x-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-8 py-3 rounded-xl font-bold transition-all"
                                >
                                    <X className="h-4 w-4" />
                                    <span>Cancel</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {displayClients.length > 0 ? (
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                        Registered Clients for <span className="text-blue-600">{selectedSubtype}</span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {displayClients.map((client, index) => (
                                            <div key={index} className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-all group">
                                                <div className="h-12 w-12 bg-sky-100 dark:bg-blue-950/30 rounded-xl flex items-center justify-center mb-4">
                                                    <Building2 className="h-6 w-6 text-blue-700 dark:text-sky-400" />
                                                </div>
                                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 line-clamp-1" title={client.businessName}>
                                                    {client.businessName}
                                                </h4>
                                                <p className="text-xs text-slate-500 mb-6">
                                                    {selectedType}
                                                </p>
                                                <a
                                                    href={client.link.startsWith('http') ? client.link : `https://${client.link}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-slate-900 hover:bg-blue-700 hover:text-white text-blue-700 font-bold py-2.5 px-4 rounded-xl transition-all border border-sky-100 dark:border-blue-950 group-hover:border-transparent"
                                                >
                                                    <span>View Project</span>
                                                    <LinkIcon className="h-3.5 w-3.5" />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center py-12 h-full">
                                    <AlertCircle className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
                                    <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">No Clients Yet</h2>
                                    <p className="text-slate-500 max-w-md">
                                        There are no client development links for <span className="font-semibold text-blue-600">{selectedSubtype}</span> right now.
                                    </p>
                                    {isAdmin && (
                                        <button
                                            onClick={handleEditClick}
                                            className="mt-6 flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
                                        >
                                            <Plus className="h-5 w-5" />
                                            <span>Add First Client Link</span>
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default Client;
