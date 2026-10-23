import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import JourneyStepIndicator from './components/JourneyStepIndicator';
import Industry3DCarousel from './components/Industry3DCarousel';
import IndustryDiscoveryPanel from './components/IndustryDiscoveryPanel';
import SubBusinessSelector from './components/SubBusinessSelector';
import DeliverablesStudio from './components/DeliverablesStudio';
import SupportModal from './components/SupportModal';

export const businessData = [
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

/**
 * ClientDashboard
 * Implements the continuous 3-stage user journey:
 * Stage 1: Business Cards (3D Carousel & Explorer)
 * Stage 2: Sub-Business Cards (Staggered cards + Back button)
 * Stage 3: Configuration Studio (Deliverables + Admin Studio + API save)
 */
const ClientDashboard = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    // Journey Stage: 1 = Business Explorer, 2 = Sub-Business Selection, 3 = Deliverables Studio
    const [currentStage, setCurrentStage] = useState(1);

    // Selected Business & Sub-Type state
    const [selectedType, setSelectedType] = useState('Service Business');
    const [selectedSubtype, setSelectedSubtype] = useState('CA');

    const [clientLinks, setClientLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
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
            if (l.type && (l.clients?.length > 0 || l.link)) {
                counts[l.type] = (counts[l.type] || 0) + 1;
            }
        });
        return counts;
    }, [clientLinks]);

    // Subtype counts per industry
    const subtypeCountsMap = useMemo(() => {
        const counts = {};
        businessData.forEach(item => {
            counts[item.type] = (counts[item.type] || 0) + 1;
        });
        return counts;
    }, []);

    // Configured subtypes for the current selected industry
    const configuredSubtypesList = useMemo(() => {
        return clientLinks
            .filter(l => l.type === selectedType && (l.clients?.length > 0 || l.link))
            .map(l => l.subtype);
    }, [clientLinks, selectedType]);

    // --- Journey Stage Transitions ---

    // Transition from Stage 1 to Stage 2: User clicked a business card
    const handleConfirmBusiness = (industry) => {
        setSelectedType(industry);
        // Find existing configured subtype or pick the first available
        const match = clientLinks.find(l => l.type === industry && (l.clients?.length > 0 || l.link));
        if (match) {
            setSelectedSubtype(match.subtype);
        } else {
            const firstSub = businessData.find(item => item.type === industry);
            setSelectedSubtype(firstSub ? firstSub.subtype : '');
        }
        setCurrentStage(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Transition from Stage 2 to Stage 3: User clicked a sub-business card
    const handleConfirmSubtype = (subtype) => {
        setSelectedSubtype(subtype);
        setCurrentStage(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Back to Stage 1 (Business Explorer)
    const handleBackToBusinesses = () => {
        setCurrentStage(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Back to Stage 2 (Sub-Business Selection)
    const handleBackToSubtypes = () => {
        setCurrentStage(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Jump via Journey Step Indicator
    const handleStepClick = (stepStage) => {
        if (stepStage === 1) {
            handleBackToBusinesses();
        } else if (stepStage === 2 && selectedType) {
            handleBackToSubtypes();
        } else if (stepStage === 3 && selectedSubtype) {
            setCurrentStage(3);
        }
    };

    // Real API save deliverables
    const handleSaveDeliverables = async (clientsToSave) => {
        setIsSaving(true);
        try {
            await api.post('/client-links', {
                type: selectedType,
                subtype: selectedSubtype,
                clients: clientsToSave
            });
            await fetchLinks();
            return true;
        } catch (error) {
            console.error("Error saving link", error);
            alert("Failed to save client deliverables. Please try again.");
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    if (loading && clientLinks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
                <div className="w-10 h-10 border-3 border-[#2463EB] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-slate-400">Loading Business Journey Explorer...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto py-2">
            {/* Top Bar with Guided Journey Step Indicator & Support Trigger */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                    <JourneyStepIndicator
                        currentStage={currentStage}
                        selectedType={selectedType}
                        selectedSubtype={selectedSubtype}
                        isConfigured={displayClients.length > 0}
                        onStepClick={handleStepClick}
                    />
                </div>

                <div className="flex items-center justify-end space-x-2 self-end md:self-auto mb-6 md:mb-8">
                    <button
                        type="button"
                        onClick={() => setIsSupportOpen(true)}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-[#070e28] hover:bg-slate-50 dark:hover:bg-[#0f1d52] text-[#172B4D] dark:text-slate-200 border border-[#D9E8FA] dark:border-[#14235a] shadow-xs transition-all cursor-pointer"
                    >
                        <HelpCircle className="w-3.5 h-3.5 text-[#2463EB] dark:text-sky-400" />
                        <span>Client Support</span>
                    </button>
                </div>
            </div>

            {/* Continuous Cinematic Journey Stage Switcher */}
            <AnimatePresence mode="wait">
                {currentStage === 1 && (
                    <motion.div
                        key="stage-1"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.3 } }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-8"
                    >
                        {/* 1. Main Hero Stage — Interactive 3D Industry Carousel */}
                        <Industry3DCarousel
                            industries={businessTypes}
                            selectedIndustry={selectedType}
                            onConfirmBusiness={handleConfirmBusiness}
                            configuredCounts={sectorConfiguredMap}
                            subtypeCounts={subtypeCountsMap}
                        />

                        {/* 2. Industry Discovery Panel (Quick Search & 2-Way Sync) */}
                        <IndustryDiscoveryPanel
                            industries={businessTypes}
                            selectedIndustry={selectedType}
                            onSelectIndustry={(ind) => handleConfirmBusiness(ind)}
                            configuredCounts={sectorConfiguredMap}
                        />
                    </motion.div>
                )}

                {currentStage === 2 && (
                    <motion.div
                        key="stage-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, transition: { duration: 0.3 } }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* 3. Sub-Business Selection Screen */}
                        <SubBusinessSelector
                            parentBusiness={selectedType}
                            subtypes={availableSubtypes}
                            selectedSubtype={selectedSubtype}
                            onConfirmSubtype={handleConfirmSubtype}
                            onBackToBusinesses={handleBackToBusinesses}
                            configuredSubtypes={configuredSubtypesList}
                        />
                    </motion.div>
                )}

                {currentStage === 3 && (
                    <motion.div
                        key="stage-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, transition: { duration: 0.3 } }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* 4. Client Deliverables Configuration Studio */}
                        <DeliverablesStudio
                            selectedType={selectedType}
                            selectedSubtype={selectedSubtype}
                            clients={displayClients}
                            isAdmin={isAdmin}
                            onSaveDeliverables={handleSaveDeliverables}
                            isSaving={isSaving}
                            onBackToSubtypes={handleBackToSubtypes}
                            onBackToBusinesses={handleBackToBusinesses}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Support Modal */}
            <SupportModal
                isOpen={isSupportOpen}
                onClose={() => setIsSupportOpen(false)}
                clientName={displayClients[0]?.businessName || selectedSubtype || "Client Workspace"}
            />
        </div>
    );
};

export default ClientDashboard;
