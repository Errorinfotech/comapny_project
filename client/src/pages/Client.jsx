import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Building2, Link as LinkIcon, AlertCircle, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
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
        if (matchingBusiness.clients && matchingBusiness.clients.length > 0) return matchingBusiness.clients;
        if (matchingBusiness.businessName && matchingBusiness.link) return [{ businessName: matchingBusiness.businessName, link: matchingBusiness.link }];
        return [];
    }, [matchingBusiness]);

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center space-x-3">
                    <Building2 className="h-8 w-8 text-indigo-500" />
                    <span>Client Development Directory</span>
                </h1>
                <p className="text-slate-500 mt-2">
                    Filter by Business Type and Sub-Type to find the specific client project.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Dropdown 1: Business Type */}
                    <div>
                        <label className="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-3">Business Type</label>
                        <select
                            value={selectedType}
                            onChange={handleTypeChange}
                            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white"
                        >
                            <option value="">-- Select Business Type --</option>
                            {businessTypes.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Dropdown 2: Sub-Type */}
                    <div>
                        <label className="block text-sm font-bold uppercase tracking-widest text-slate-500 mb-3">Sub-Type</label>
                        <select
                            value={selectedSubtype}
                            onChange={handleSubtypeChange}
                            disabled={!selectedType}
                            className={`w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium text-slate-900 dark:text-white ${!selectedType ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <option value="">-- Select Sub-Type --</option>
                            {availableSubtypes.map((subtype, index) => (
                                <option key={index} value={subtype}>{subtype}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Results Area */}
            {selectedType && selectedSubtype && !loading && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 relative min-h-[300px]"
                >
                    {isAdmin && !isEditing && (
                        <button
                            onClick={handleEditClick}
                            className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 rounded-xl transition-all z-10"
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
                                    className="flex items-center space-x-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-all"
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
                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                                                placeholder="e.g. ABC Company"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Link (URL)</label>
                                            <input
                                                type="url"
                                                value={client.link}
                                                onChange={(e) => handleClientChange(index, 'link', e.target.value)}
                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                                                placeholder="https://..."
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Assign to Client (Optional)</label>
                                            <select
                                                value={client.userId || ''}
                                                onChange={(e) => handleClientChange(index, 'userId', e.target.value)}
                                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
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
                                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-indigo-500/20"
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
                                        Registered Clients for <span className="text-indigo-500">{selectedSubtype}</span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {displayClients.map((client, index) => (
                                            <div key={index} className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-all group">
                                                <div className="h-12 w-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4">
                                                    <Building2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
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
                                                    className="w-full flex items-center justify-center space-x-2 bg-white dark:bg-slate-900 hover:bg-indigo-600 hover:text-white text-indigo-600 font-bold py-2.5 px-4 rounded-xl transition-all border border-indigo-100 dark:border-indigo-900 group-hover:border-transparent"
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
                                        There are no client development links for <span className="font-semibold text-indigo-500">{selectedSubtype}</span> right now.
                                    </p>
                                    {isAdmin && (
                                        <button
                                            onClick={handleEditClick}
                                            className="mt-6 flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
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
