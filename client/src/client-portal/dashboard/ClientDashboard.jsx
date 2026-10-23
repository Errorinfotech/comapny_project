import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Building2, Briefcase, Search, ChevronDown, Check, ArrowUpRight, 
    Edit, Plus, Trash2, Save, X, Layers3, Sparkles, HelpCircle, AlertCircle 
} from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import DeliverablesVault from './components/DeliverablesVault';
import SupportModal from './components/SupportModal';

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
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                {label}
            </label>

            <button
                type="button"
                disabled={disabled}
                onClick={() => {
                    if (!disabled) {
                        setIsOpen(!isOpen);
                        setSearch('');
                    }
                }}
                className={`w-full rounded-2xl p-3.5 text-left transition-all duration-200 flex items-center justify-between border cursor-pointer select-none ${
                    disabled
                        ? 'bg-slate-100/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 opacity-60 cursor-not-allowed'
                        : isOpen
                        ? 'bg-white dark:bg-[#070e28] border-sky-400 dark:border-sky-500 ring-2 ring-sky-400/20 shadow-md text-slate-900 dark:text-white'
                        : 'bg-[#f8fbfe] dark:bg-[#0a1438] border-sky-100 dark:border-[#14235a] hover:border-sky-300 dark:hover:border-sky-500 text-slate-900 dark:text-white shadow-2xs'
                }`}
            >
                <div className="flex items-center space-x-2.5 truncate pr-2">
                    {Icon && (
                        <Icon className={`h-4 w-4 shrink-0 ${value ? 'text-blue-600 dark:text-sky-400' : 'text-slate-400'}`} />
                    )}
                    <span className={`text-xs font-semibold truncate ${value ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                        {value || placeholder}
                    </span>
                </div>
                <ChevronDown
                    className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-600 dark:text-sky-400' : ''
                    }`}
                />
            </button>

            <AnimatePresence>
                {isOpen && !disabled && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-full mt-2 z-[100] rounded-2xl bg-white dark:bg-[#070e28] border border-sky-200/90 dark:border-[#14235a] shadow-2xl p-2.5 backdrop-blur-xl"
                    >
                        {options.length > 5 && (
                            <div className="relative mb-2 px-1">
                                <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Type to filter..."
                                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0a1438] border border-sky-100 dark:border-[#14235a] text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
                                    onClick={(e) => e.stopPropagation()}
                                    autoFocus
                                />
                            </div>
                        )}

                        <div className="max-h-56 overflow-y-auto space-y-1 pr-1 overscroll-contain">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt) => (
                                    <div
                                        key={opt}
                                        onClick={() => {
                                            onChange(opt);
                                            setIsOpen(false);
                                            setSearch('');
                                        }}
                                        className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
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
                                    No options found
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ClientDashboard = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    // State for Business Type & Sub-Type
    const [selectedType, setSelectedType] = useState('Service Business');
    const [selectedSubtype, setSelectedSubtype] = useState('CA');
    const [clientLinks, setClientLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Edit Deliverables state (for Admin)
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState([]);
    const [isSupportOpen, setIsSupportOpen] = useState(false);

    // Fetch dynamic client links from backend
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

    // Matching business item for selected subtype
    const matchingBusiness = useMemo(() => {
        if (!selectedSubtype) return null;
        return clientLinks.find(item => item.subtype === selectedSubtype) || null;
    }, [selectedSubtype, clientLinks]);

    // Derived list of clients to show
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

    // Count of configured portals per sector
    const sectorConfiguredMap = useMemo(() => {
        const counts = {};
        clientLinks.forEach(l => {
            if (l.type) counts[l.type] = (counts[l.type] || 0) + 1;
        });
        return counts;
    }, [clientLinks]);

    const handleSelectSector = (sectorType) => {
        setSelectedType(sectorType);
        const match = clientLinks.find(l => l.type === sectorType);
        if (match) {
            setSelectedSubtype(match.subtype);
        } else {
            setSelectedSubtype('');
        }
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
            initialClients = [{ businessName: matchingBusiness.businessName, link: matchingBusiness.link, userId: '' }];
        } else {
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
            alert("Failed to save client deliverables.");
        }
    };

    if (loading && clientLinks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
                <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-slate-400">Loading Client Portal Directory...</p>
            </div>
        );
    }

    const primaryClient = displayClients[0] || {
        businessName: matchingBusiness?.businessName || (selectedSubtype ? `${selectedSubtype} Workspace` : 'Client Workspace'),
        link: matchingBusiness?.link || ''
    };

    return (
        <div className="space-y-7 max-w-6xl mx-auto py-2">
            {/* Sector & Sub-Type Command Center (relative z-30 for perfect dropdown layering) */}
            <div className="relative z-30 bg-white/95 dark:bg-[#070e28]/95 backdrop-blur-2xl p-5 sm:p-6 rounded-3xl border border-sky-100/90 dark:border-[#14235a] shadow-lg shadow-sky-950/5">
                <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100 dark:border-[#14235a]/60">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-sky-400 animate-pulse" />
                        <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            Commercial Business & Sub-Business Navigator
                        </h2>
                    </div>

                    <div className="flex items-center space-x-2">
                        {isAdmin && !isEditing && selectedType && selectedSubtype && (
                            <button
                                type="button"
                                onClick={handleEditClick}
                                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-sky-50 hover:bg-sky-100 dark:bg-[#0a1438] dark:hover:bg-[#101f56] text-blue-700 dark:text-sky-300 border border-sky-200/70 dark:border-[#14235a] transition-all cursor-pointer"
                            >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Edit Deliverables</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => setIsSupportOpen(true)}
                            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-white dark:bg-[#070e28] hover:bg-slate-50 dark:hover:bg-[#0f1d52] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#14235a] transition-all cursor-pointer"
                        >
                            <HelpCircle className="w-3.5 h-3.5 text-blue-600 dark:text-sky-400" />
                            <span>Support</span>
                        </button>
                    </div>
                </div>

                {/* Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CustomSelect
                        label="Commercial Sector (Business Type)"
                        value={selectedType}
                        options={businessTypes}
                        onChange={(val) => {
                            setSelectedType(val);
                            const match = clientLinks.find(l => l.type === val);
                            setSelectedSubtype(match ? match.subtype : '');
                            setIsEditing(false);
                        }}
                        placeholder="-- Select Commercial Sector --"
                        icon={Building2}
                    />

                    <CustomSelect
                        label="Business Sub-Type (Deliverable Unit)"
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

                {/* Quick Sector Pills with Active Counts & Smooth Sliding Indicator */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-[#14235a]/60">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        {businessTypes.map((type) => {
                            const isSelected = selectedType === type;
                            const count = sectorConfiguredMap[type] || 0;
                            return (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => handleSelectSector(type)}
                                    className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center space-x-1.5 ${
                                        isSelected
                                            ? 'text-white'
                                            : 'bg-slate-50 hover:bg-slate-100 dark:bg-[#0a1438] dark:hover:bg-[#101f56] text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-[#14235a]'
                                    }`}
                                >
                                    {isSelected && (
                                        <motion.div
                                            layoutId="activeSectorPill"
                                            transition={{ type: "spring", stiffness: 380, damping: 28 }}
                                            className="absolute inset-0 rounded-xl bg-gradient-to-b from-[#32509a] to-[#233c74] shadow-sm shadow-[#233c74]/35"
                                        />
                                    )}
                                    <span className="relative z-10">{type}</span>
                                    {count > 0 && (
                                        <span className={`relative z-10 text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                                            isSelected ? 'bg-white/20 text-white' : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                        }`}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Admin Inline Editor Mode (When editing links) */}
            {isEditing && (
                <div className="relative z-10 rounded-3xl p-6 sm:p-7 bg-white/95 dark:bg-[#070e28]/95 backdrop-blur-2xl border border-sky-100/90 dark:border-[#14235a] shadow-lg shadow-sky-950/5 space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#14235a]">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                            Configure Client Deliverables: <span className="text-blue-600">{selectedSubtype}</span>
                        </h3>
                        <button
                            type="button"
                            onClick={handleAddClientRow}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-50 hover:bg-sky-100 text-blue-700 transition-all"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Another Client</span>
                        </button>
                    </div>

                    <div className="space-y-3">
                        {editForm.map((client, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0a1438] border border-slate-200/80 dark:border-[#14235a]">
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Business Name</label>
                                    <input
                                        type="text"
                                        value={client.businessName}
                                        onChange={(e) => handleClientChange(idx, 'businessName', e.target.value)}
                                        placeholder="e.g. Business / Client Name"
                                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#070e28] border border-slate-200 dark:border-[#14235a] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Production URL (Link)</label>
                                    <input
                                        type="url"
                                        value={client.link}
                                        onChange={(e) => handleClientChange(idx, 'link', e.target.value)}
                                        placeholder="https://..."
                                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#070e28] border border-slate-200 dark:border-[#14235a] text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveClientRow(idx)}
                                    className="self-end sm:self-center sm:mt-5 p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                    title="Delete row"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center space-x-2.5 pt-3 border-t border-slate-100 dark:border-[#14235a]">
                        <button
                            type="button"
                            onClick={handleSave}
                            className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-b from-[#32509a] to-[#233c74] text-white text-xs font-bold shadow-md shadow-[#233c74]/25 transition-all cursor-pointer"
                        >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Deliverables</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0a1438] text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Ambient Background Glowing Orb for Depth */}
            <motion.div 
                animate={{ 
                    x: [0, 30, 0],
                    y: [0, -25, 0],
                    opacity: [0.15, 0.28, 0.15]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none fixed top-1/4 right-1/10 w-96 h-96 rounded-full bg-gradient-to-br from-blue-600/15 via-sky-400/20 to-transparent blur-3xl -z-10"
            />

            {/* Display Active Sub-Business Deliverables */}
            <AnimatePresence mode="wait">
                {selectedType && selectedSubtype && !isEditing ? (
                    <motion.div 
                        key={`${selectedType}-${selectedSubtype}`}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.28, ease: "easeOut" }}
                        className="relative z-10 space-y-6"
                    >
                        {/* Live Client Deployments & Proofs Vault */}
                        {displayClients.length > 0 ? (
                            <DeliverablesVault 
                                clients={displayClients} 
                                subtype={selectedSubtype}
                            />
                        ) : (
                            <div className="rounded-3xl border border-dashed border-sky-200 dark:border-[#14235a] p-10 text-center bg-white/60 dark:bg-[#070e28]/60">
                                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-[#0a1438] text-blue-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-3">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                    No live portal configured yet for {selectedSubtype}
                                </h3>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-md mx-auto">
                                    Deliverable links for {selectedSubtype} ({selectedType}) will appear here once configured.
                                </p>
                                {isAdmin && (
                                    <button
                                        type="button"
                                        onClick={handleEditClick}
                                        className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-b from-[#32509a] to-[#233c74] text-white text-xs font-bold shadow-md shadow-[#233c74]/25 transition-all cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Configure Client URL</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </motion.div>
                ) : !isEditing && (
                    <div className="rounded-3xl border border-dashed border-sky-200 dark:border-[#14235a] p-10 text-center bg-white/60 dark:bg-[#070e28]/60">
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-[#0a1438] text-blue-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-3">
                            <Layers3 className="w-6 h-6" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            Select Business & Sub-Business
                        </h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-md mx-auto">
                            Choose a commercial sector and sub-type from the navigator above to view active client portals and deliverables.
                        </p>
                    </div>
                )}
            </AnimatePresence>

            {/* Support Modal */}
            <SupportModal
                isOpen={isSupportOpen}
                onClose={() => setIsSupportOpen(false)}
                clientName={primaryClient.businessName}
            />
        </div>
    );
};

export default ClientDashboard;
