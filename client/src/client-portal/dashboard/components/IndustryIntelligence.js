/**
 * IndustryIntelligence.js
 * Universal dynamic ERP/CRM intelligence engine for Error Infotech Client Portal.
 * Maps any commercial sector and sub-business into specialized enterprise modules,
 * tailor-made feature breakdowns, and compelling sales pitch metrics.
 */

export const getIndustryIntelligence = (type = '', subtype = '') => {
    const s = (subtype || '').trim();
    const t = (type || '').trim();

    // 1. Specialized presets for high-demand verticals
    const presets = {
        'CA': {
            suiteName: 'Error Infotech TaxPro 360™',
            badge: 'Chartered Practice & Audit ERP',
            tagline: 'Complete automated practice management: Client ITR/GST filing tracker, digital dossier vault, automated invoice generation & WhatsApp tax reminder bot.',
            stats: [
                { label: 'Filing Accuracy', val: '99.9%' },
                { label: 'Time Saved per Client', val: '65%' },
                { label: 'GST / TDS Ready', val: '100%' }
            ],
            modules: [
                {
                    title: 'Client Tax & Dossier Vault',
                    icon: 'FolderLock',
                    tag: 'Core Compliance',
                    desc: 'Encrypted cloud locker for PAN, Aadhaar, balance sheets & DSC keys with client-wise access logs.',
                    bullets: ['Audit-ready digital archiving', 'Client self-upload portal', 'End-to-end 256-bit encryption']
                },
                {
                    title: 'Automated Billing & Work-Slip',
                    icon: 'ReceiptText',
                    tag: 'Revenue Engine',
                    desc: 'Generate professional CA retainership invoices, track unbilled consulting hours & automated GST e-way bills.',
                    bullets: ['Retainer auto-invoicing', 'Payment gateway & UPI QR', 'Outstanding balance aging ledger']
                },
                {
                    title: 'WhatsApp Tax Due-Date Bot',
                    icon: 'MessageSquare',
                    tag: 'Client CRM',
                    desc: 'Automated WhatsApp alerts for advance tax deadlines, GSTR-3B filings, and document signature reminders.',
                    bullets: ['Zero manual reminder calls', 'Instant PDF share via WhatsApp', '1-click acknowledgement logs']
                },
                {
                    title: 'Task & Article Staff Tracker',
                    icon: 'UsersCheck',
                    tag: 'Team Operations',
                    desc: 'Assign audit tasks to article assistants with strict deadlines, checklists, and Partner approval hierarchy.',
                    bullets: ['Partner digital sign-off', 'Article timesheet logs', 'Department workload heatmaps']
                },
                {
                    title: 'Executive Financial Analytics',
                    icon: 'BarChart3',
                    tag: 'Firm Intelligence',
                    desc: 'Live dashboard displaying practice cashflows, pending compliance status across 500+ clients, and P&L charts.',
                    bullets: ['Real-time revenue metrics', 'Client churn & profitability', 'Automated monthly MIS reports']
                },
                {
                    title: 'Bank-Grade Cloud Infrastructure',
                    icon: 'ShieldCheck',
                    tag: 'Security & Backup',
                    desc: 'Hosted on high-speed private cloud with automated daily encrypted backups and zero data leakage assurance.',
                    bullets: ['99.98% guaranteed uptime', 'Two-factor biometric login', 'Granular role permissions']
                }
            ]
        },
        'Cafe': {
            suiteName: 'Error Infotech CafeOS™',
            badge: 'Smart Hospitality & Quick-Serve POS',
            tagline: 'Ultra-fast counter billing, table QR ordering, kitchen display system (KDS), dynamic recipe-level inventory, and customer retention loyalty bot.',
            stats: [
                { label: 'Order to Kitchen', val: '< 2 Sec' },
                { label: 'Table Turnaround', val: '+40%' },
                { label: 'Waste Reduction', val: '28%' }
            ],
            modules: [
                {
                    title: 'Lightning POS & Table Billing',
                    icon: 'Zap',
                    tag: 'Front Desk',
                    desc: '3-click touch billing, split bills, table status visualization, dynamic taxes, and discount management.',
                    bullets: ['Touch-friendly fast POS', 'Custom add-ons & modifiers', 'Works 100% offline & syncs online']
                },
                {
                    title: 'Live Kitchen Display (KDS)',
                    icon: 'Flame',
                    tag: 'Kitchen Ops',
                    desc: 'Paperless kitchen order tickets (KOT) sent instantly to kitchen screens with color-coded preparation timers.',
                    bullets: ['Zero lost KOTs', 'Item-wise prep timers', 'Station routing (Beverages vs Snacks)']
                },
                {
                    title: 'Recipe & Ingredient Depletion',
                    icon: 'PackageSearch',
                    tag: 'Smart Inventory',
                    desc: 'Auto-deduct coffee beans, milk, syrups & syrups per order. Instant alerts before running out of stock.',
                    bullets: ['Real-time raw material tracking', 'Low stock WhatsApp alerts', 'Daily food-cost variance reports']
                },
                {
                    title: 'WhatsApp Digital Bills & Loyalty',
                    icon: 'Smartphone',
                    tag: 'Customer CRM',
                    desc: 'Go green by sending PDF receipts directly to WhatsApp. Reward repeat guests with automatic points & birthday coupons.',
                    bullets: ['Save printing paper costs', 'Automated repeat visit campaigns', 'Customer feedback capture']
                },
                {
                    title: 'Multi-Outlet Central Dashboard',
                    icon: 'Store',
                    tag: 'Chain Operations',
                    desc: 'Manage single cafe or 20 franchise branches with centralized menu pricing, sales analytics, and stock transfers.',
                    bullets: ['Franchise royalty tracking', 'Centralized recipe control', 'Inter-branch stock transfers']
                },
                {
                    title: 'Fraud & Cash Drawer Control',
                    icon: 'ShieldAlert',
                    tag: 'Cash Protection',
                    desc: 'Track every cancelled item, cash drawer opening, and staff shift settlement with end-of-day Z-reports.',
                    bullets: ['No bill cancellation without PIN', 'Shift-wise cash reconciliation', 'Cloud audit trail']
                }
            ]
        },
        'Restaurant': {
            suiteName: 'Error Infotech RestoSuite 360™',
            badge: 'Fine Dining & Multi-Cuisine ERP',
            tagline: 'Comprehensive restaurant ecosystem: Captain steward app, floor plan table layout, kitchen dispatch, inventory costing & multi-payment checkout.',
            stats: [
                { label: 'Captain Billing Speed', val: '3x Faster' },
                { label: 'Food Cost Accuracy', val: '99.2%' },
                { label: 'Daily Cover Capacity', val: '+35%' }
            ],
            modules: [
                {
                    title: 'Floor & Table Layout Management',
                    icon: 'LayoutGrid',
                    tag: 'Floor Management',
                    desc: 'Visual AC/Garden/Family floor layouts with real-time occupied, reserved, and billing states.',
                    bullets: ['Dynamic table merging', 'Captain steward assignment', 'Reservation & advance booking calendar']
                },
                {
                    title: 'Captain Mobile Ordering App',
                    icon: 'Smartphone',
                    tag: 'Speed & Service',
                    desc: 'Captains take orders at table side using Android/iOS phones with instant KOT fire to respective kitchen counters.',
                    bullets: ['Zero waiter running back & forth', 'Cooking instructions per dish', 'Upsell suggestions prompt']
                },
                {
                    title: 'Smart Recipe Costing & Stock ERP',
                    icon: 'Boxes',
                    tag: 'Inventory & Purchase',
                    desc: 'Batch cooking depletion, supplier purchase order management, and daily gross profit analysis per recipe.',
                    bullets: ['Vendor payment balance tracker', 'Daily wastage logging', 'Margin analysis per menu item']
                },
                {
                    title: 'WhatsApp Marketing & VIP Club',
                    icon: 'Gift',
                    tag: 'CRM & Retention',
                    desc: 'Build client profiles with dietary preferences, anniversary dates, and automated VIP re-engagement offers.',
                    bullets: ['Personalized festival greetings', 'Automated feedback follow-up', 'Cashback wallet engine']
                },
                {
                    title: 'Aggregator & Delivery Integration',
                    icon: 'Truck',
                    tag: 'Omnichannel Sales',
                    desc: 'Synchronize Swiggy, Zomato and in-house website takeaway orders into a single consolidated kitchen screen.',
                    bullets: ['Consolidated accounting', 'Single menu switch toggling', 'Delivery boy assignment']
                },
                {
                    title: 'Live Executive Financial MIS',
                    icon: 'LineChart',
                    tag: 'Owner Insights',
                    desc: 'Mobile-first executive dashboard showing hourly sales, best-selling dishes, waiter performance, and net margins.',
                    bullets: ['Real-time phone notifications', 'Daily closing Z-report on email', 'Tax GST GSTR-1 export']
                }
            ]
        },
        'Clothing Store': {
            suiteName: 'Error Infotech GarmentPro ERP™',
            badge: 'Apparel, Fashion & Retail POS Suite',
            tagline: 'End-to-end retail ERP for fashion boutiques: Matrix-based size/color/fit barcoding, alteration tracking, fast billing, and wholesale/retail ledgers.',
            stats: [
                { label: 'Barcode Billing Time', val: '1.5 Sec' },
                { label: 'Inventory Shrinkage', val: '-92%' },
                { label: 'Repeat Customer Rate', val: '+45%' }
            ],
            modules: [
                {
                    title: 'Matrix Barcoding (Size & Color)',
                    icon: 'Barcode',
                    tag: 'Inventory Core',
                    desc: 'Unique 1D/2D thermal barcode generation with brand, design number, size (S/M/L/XL), color and MRP.',
                    bullets: ['Thermal sticker printer support', 'Instant stock lookup by scan', 'Dead-stock aging alerts']
                },
                {
                    title: 'High-Speed Retail Billing Counter',
                    icon: 'Receipt',
                    tag: 'Front POS',
                    desc: 'Rapid barcode billing with multiple tender modes (Cash, Card, UPI, Store Credit), exchanges and credit notes.',
                    bullets: ['Instant return & exchange handling', 'Custom festive discount rules', 'Credit ledger for known customers']
                },
                {
                    title: 'Alteration & Fitting Workflow',
                    icon: 'Scissors',
                    tag: 'Bespoke Service',
                    desc: 'Tag garments given for alterations with tailor job slips, expected trial dates, and SMS/WhatsApp readiness notifications.',
                    bullets: ['Tailor assignment & tracking', 'Trial date reminder to client', 'Alteration status monitor']
                },
                {
                    title: 'Customer Loyalty & WhatsApp Catalog',
                    icon: 'Share2',
                    tag: 'Retention CRM',
                    desc: 'Share new arrivals catalogs directly on WhatsApp. Reward buyers with points that redeem on their next shopping trip.',
                    bullets: ['Targeted festive collection broadcast', 'Birthday & anniversary vouchers', 'Customer purchase history']
                },
                {
                    title: 'Supplier Purchase & Mill Ledgers',
                    icon: 'Truck',
                    tag: 'Wholesale & B2B',
                    desc: 'Track fabric/garment inward shipments, vendor payment credit terms, return to vendor (RTV), and purchase GST.',
                    bullets: ['Purchase order comparison', 'Vendor credit limit enforcement', 'Transport bilty & LR tracking']
                },
                {
                    title: 'Multi-Store Branch Sync',
                    icon: 'Network',
                    tag: 'Enterprise Scalability',
                    desc: 'Sync inventory across multiple retail outlets, enable inter-store transfers, and view consolidated sales from home.',
                    bullets: ['Live branch sales comparison', 'Stock transfer with dispatch OTP', 'Central warehouse control']
                }
            ]
        },
        'Hospital / Clinic': {
            suiteName: 'Error Infotech MediCare 360™',
            badge: 'Clinical EHR, OPD & Hospital Management',
            tagline: 'NABH-ready healthcare suite: OPD queue management, digital doctor prescriptions, pharmacy inventory, lab reports dispatch & IPD billing.',
            stats: [
                { label: 'Patient Wait Time', val: '-50%' },
                { label: 'Prescription Speed', val: '30 Sec' },
                { label: 'Audit Compliance', val: '100%' }
            ],
            modules: [
                {
                    title: 'Smart OPD Queue & Token Display',
                    icon: 'Users',
                    tag: 'Reception & Queue',
                    desc: 'Automated token generation, dynamic waiting room TV display, and online WhatsApp doctor appointment booking.',
                    bullets: ['TV queue callout display', 'WhatsApp appointment booking', 'Patient medical history retrieval']
                },
                {
                    title: 'Doctor E-Prescription & EMR',
                    icon: 'Stethoscope',
                    tag: 'Clinical Care',
                    desc: 'Quick medicine dosage templates, diagnosis ICD-10 codes, allergy alerts, and 1-click printable Rx pad.',
                    bullets: ['Specialty clinical templates', 'Drug interaction contra-alerts', 'Direct sync to in-house pharmacy']
                },
                {
                    title: 'In-House Pharmacy & Batch Expiry',
                    icon: 'Pill',
                    tag: 'Medical Inventory',
                    desc: 'Scan barcode, track batch numbers, automatically highlight near-expiry medicines, and manage schedule H drugs.',
                    bullets: ['Near-expiry return to vendor', 'Fast prescription billing', 'Batch-wise stock valuation']
                },
                {
                    title: 'Pathology & Lab Diagnostics Dispatch',
                    icon: 'Microscope',
                    tag: 'Diagnostic Lab',
                    desc: 'Enter test parameters, compare with normal reference ranges, and auto-dispatch signed PDF reports via WhatsApp.',
                    bullets: ['Direct lab equipment sync', 'QR-coded PDF test reports', 'Automated abnormal flags']
                },
                {
                    title: 'IPD Admission & Insurance / TPA Billing',
                    icon: 'BedDouble',
                    tag: 'Hospital In-Patient',
                    desc: 'Bed occupancy tracker, daily nurse chart, doctor visit charges, and complete Ayushman / TPA claim package billing.',
                    bullets: ['Discharge summary generator', 'Mediclaim estimate slips', 'Departmental cost breakdowns']
                },
                {
                    title: 'Healthcare Privacy & Cloud Archiving',
                    icon: 'Lock',
                    tag: 'HIPAA & Compliance',
                    desc: 'Encrypted patient records with role-based doctor/nurse privileges, automated cloud backup, and audit trail.',
                    bullets: ['Restricted medical history access', 'Disaster recovery failover', '10-year record retention ready']
                }
            ]
        },
        'Real Estate & Infrastructure': {
            suiteName: 'Error Infotech InfraBuild ERP™',
            badge: 'Construction, Site & Real Estate CRM',
            tagline: 'Complete builder ecosystem: Site raw material tracking (Cement, Steel), subcontractor labor billing, booking CRM & RERA payment stages.',
            stats: [
                { label: 'Site Material Leakage', val: '-85%' },
                { label: 'Booking Lead Conversion', val: '+38%' },
                { label: 'RERA Milestone Accuracy', val: '100%' }
            ],
            modules: [
                {
                    title: 'Real Estate Sales & Lead Pipeline CRM',
                    icon: 'Building',
                    tag: 'Sales & Booking',
                    desc: 'Capture inquiries from Facebook, 99acres & walk-ins. Interactive unit layout selector with live booked/available flags.',
                    bullets: ['Unit floor plan interactive booking', 'Brokerage commission tracking', 'Lead source ROI attribution']
                },
                {
                    title: 'RERA Milestone & Installment Engine',
                    icon: 'CalendarCheck',
                    tag: 'Billing & Contracts',
                    desc: 'Generate demand letters mapped to construction slabs (Plinth, 1st Slab, Brickwork) with automated payment receipts.',
                    bullets: ['Automated slab demand letters', 'Interest on delayed payments', 'Bank loan disbursement tracking']
                },
                {
                    title: 'Site Material Inward & Stock Depletion',
                    icon: 'Truck',
                    tag: 'Site Operations',
                    desc: 'Monitor cement bags, steel tonnage, sand & bricks delivered per site. Catch discrepancies against purchase orders.',
                    bullets: ['Weighbridge slip verification', 'Site-to-site stock transfers', 'Daily consumption logs vs BOQ']
                },
                {
                    title: 'Subcontractor & Labor Contractor Bills',
                    icon: 'HardHat',
                    tag: 'Labor Management',
                    desc: 'Track measurement sheets (MB records), labor gang attendance, work order rates, and retention money deductions.',
                    bullets: ['Measurement book approval flow', 'TDS & labor cess deductions', 'Piece-rate contractor billing']
                },
                {
                    title: 'Investor & Partner Project Accounting',
                    icon: 'PieChart',
                    tag: 'Financial Control',
                    desc: 'Consolidated balance sheets across multiple ongoing residential/commercial schemes with partner profit shares.',
                    bullets: ['Multi-project cashflow monitor', 'Land owner share distribution', 'Escrow account monitoring']
                },
                {
                    title: 'Executive Drone & Progress Gallery',
                    icon: 'ShieldCheck',
                    tag: 'Cloud Security',
                    desc: 'Centralized cloud portal for site progress photos, municipal sanction blueprints, and legal title documents.',
                    bullets: ['Secure client-facing progress portal', 'Legal approvals repository', 'Role-based contractor access']
                }
            ]
        }
    };

    // Return custom preset if matched
    if (presets[s]) {
        return presets[s];
    }

    // 2. Intelligent Category-Based Generator for all remaining 80+ subtypes!
    let categoryPrefix = 'Business';
    let moduleKeywords = {
        pos: 'Smart Billing & Invoicing Engine',
        inventory: 'Stock & Inventory Management',
        crm: 'Customer Loyalty & WhatsApp CRM',
        team: 'Staff Roles & Daily Operations',
        analytics: 'Real-Time Executive Analytics',
        cloud: 'Secure Cloud & Instant Backup'
    };

    if (t.includes('Retail') || t.includes('Shopping')) {
        categoryPrefix = 'RetailPro';
        moduleKeywords.pos = 'Rapid Barcode POS & Thermal Billing';
        moduleKeywords.inventory = 'SKU, Variant & Stock Alert Engine';
        moduleKeywords.crm = 'WhatsApp Catalog & Member Loyalty';
    } else if (t.includes('Manufacturing') || t.includes('Industrial')) {
        categoryPrefix = 'FactorySuite';
        moduleKeywords.pos = 'Production Orders & B2B GST Invoicing';
        moduleKeywords.inventory = 'Raw Material BOQ & Finished Stock';
        moduleKeywords.crm = 'Dealer / Distributor Network CRM';
    } else if (t.includes('Food') || t.includes('Beverage')) {
        categoryPrefix = 'DineOS';
        moduleKeywords.pos = 'Fast Counter POS & Order Queuing';
        moduleKeywords.inventory = 'Perishables & Daily Kitchen Stock';
        moduleKeywords.crm = 'Digital WhatsApp Bill & Reviews';
    } else if (t.includes('Education')) {
        categoryPrefix = 'EduMaster';
        moduleKeywords.pos = 'Fee Collection & Installment Receipts';
        moduleKeywords.inventory = 'Course Material, Books & Batches';
        moduleKeywords.crm = 'Parent WhatsApp Updates & Attendance';
    } else if (t.includes('Automobile')) {
        categoryPrefix = 'AutoCore';
        moduleKeywords.pos = 'Job-Card Invoicing & Spares Billing';
        moduleKeywords.inventory = 'OEM Spare Parts & Chassis Registry';
        moduleKeywords.crm = 'Service Due Reminder Bot via WhatsApp';
    } else if (t.includes('Health') || t.includes('Wellness')) {
        categoryPrefix = 'CareSync';
        moduleKeywords.pos = 'Appointment Billing & Package Receipts';
        moduleKeywords.inventory = 'Consumables & Equipment Tracking';
        moduleKeywords.crm = 'Client Follow-ups & Digital Membership';
    } else if (t.includes('Repair') || t.includes('Service')) {
        categoryPrefix = 'ServicePro';
        moduleKeywords.pos = 'Job-Sheet Ticket & Repair Invoicing';
        moduleKeywords.inventory = 'Component Spares & Replacement Parts';
        moduleKeywords.crm = 'Instant Status Updates via WhatsApp';
    }

    const cleanSubtype = s || t || 'Enterprise';
    const cleanType = t || 'Commercial Sector';

    return {
        suiteName: `Error Infotech ${categoryPrefix} 360™`,
        badge: `${cleanSubtype} Specialized ERP & CRM`,
        tagline: `Purpose-built enterprise suite for ${cleanSubtype} business operations: Automate daily invoicing, inventory control, WhatsApp communications, and multi-branch accounting under a single unified dashboard.`,
        stats: [
            { label: 'Operational Speed', val: '+45%' },
            { label: 'Billing Accuracy', val: '99.9%' },
            { label: 'Paperless Automation', val: '100%' }
        ],
        modules: [
            {
                title: moduleKeywords.pos,
                icon: 'ReceiptText',
                tag: 'Revenue Engine',
                desc: `Tailored billing workflows built specifically for ${cleanSubtype}. Fast calculation, custom GST rates, UPI QR payments, and instant digital receipts.`,
                bullets: ['1-Click GST tax calculation', 'Multiple payment modes (Cash, UPI, Card)', 'Print or send digital PDF bill']
            },
            {
                title: moduleKeywords.inventory,
                icon: 'Boxes',
                tag: 'Operations',
                desc: `Track supplies, product lines, and consumables for ${cleanSubtype}. Receive automatic alerts before critical items run out of stock.`,
                bullets: ['Low-stock threshold alerts', 'Supplier purchase orders', 'Real-time stock valuation reports']
            },
            {
                title: moduleKeywords.crm,
                icon: 'MessageSquare',
                tag: 'Client Retention',
                desc: `Retain valuable customers with automatic WhatsApp notifications, service/purchase reminders, and personalized promotional offers.`,
                bullets: ['Automated WhatsApp greeting & alerts', 'Customer purchase history records', 'VIP customer reward points']
            },
            {
                title: moduleKeywords.team,
                icon: 'Users',
                tag: 'Staff Management',
                desc: `Manage staff access with strict permission levels. Cashiers, managers, and partners only see the data you authorize.`,
                bullets: ['Granular role-based security', 'Daily staff attendance & shift logs', 'Audit history of all transactions']
            },
            {
                title: moduleKeywords.analytics,
                icon: 'BarChart3',
                tag: 'Executive Insights',
                desc: `Clear visual charts showing daily turnover, profit margins, outstanding client balances, and monthly growth trends.`,
                bullets: ['Live revenue dashboard on phone', 'Top-selling products & services', '1-Click export to Excel & CA format']
            },
            {
                title: moduleKeywords.cloud,
                icon: 'ShieldCheck',
                tag: 'Security & Backup',
                desc: `Hosted on high-speed servers with daily encrypted cloud backup. Your ${cleanSubtype} records remain 100% confidential and safe.`,
                bullets: ['99.98% guaranteed uptime', 'Automatic daily cloud backups', '256-bit bank-grade encryption']
            }
        ]
    };
};
