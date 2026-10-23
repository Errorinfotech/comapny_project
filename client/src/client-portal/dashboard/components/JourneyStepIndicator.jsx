import React from 'react';
import { motion } from 'framer-motion';
import { Check, Building2, Briefcase, Layers, ArrowLeft } from 'lucide-react';

/**
 * JourneyStepIndicator
 * 3-step interactive progress indicator synced with the cinematic stage:
 * Stage 1: Business Type (Commercial Sector)
 * Stage 2: Sub-Business (Deliverable Unit)
 * Stage 3: Deliverables (Configuration & Live Portals)
 */
const JourneyStepIndicator = ({
    currentStage = 1,
    selectedType,
    selectedSubtype,
    isConfigured = false,
    onStepClick
}) => {
    const steps = [
        {
            stage: 1,
            label: 'Business Type',
            value: selectedType || 'Explore 12 Sectors',
            icon: Building2
        },
        {
            stage: 2,
            label: 'Sub-Business',
            value: selectedSubtype || (currentStage >= 2 ? 'Select Sub-Unit' : 'Pending Selection'),
            icon: Briefcase
        },
        {
            stage: 3,
            label: 'Deliverables Studio',
            value: isConfigured ? 'Active Production' : (currentStage === 3 ? 'Configuration' : 'Pending Selection'),
            icon: Layers
        }
    ];

    const getProgressWidth = () => {
        if (currentStage === 1) return '0%';
        if (currentStage === 2) return '50%';
        return '100%';
    };

    return (
        <div className="w-full max-w-4xl mx-auto mb-6 px-2">
            <div className="relative flex items-center justify-between">
                {/* Connecting Line Track */}
                <div className="absolute left-6 right-6 top-6 -translate-y-1/2 h-1 bg-slate-200/80 dark:bg-[#14235a] rounded-full z-0 overflow-hidden">
                    <motion.div 
                        className="h-full bg-gradient-to-r from-[#2463EB] to-[#38bdf8] rounded-full"
                        initial={false}
                        animate={{ width: getProgressWidth() }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                </div>

                {/* Step Nodes */}
                {steps.map((step) => {
                    const Icon = step.icon;
                    const isCompleted = currentStage > step.stage;
                    const isCurrent = currentStage === step.stage;
                    const isAccessible = step.stage <= currentStage || (step.stage === 2 && Boolean(selectedType)) || (step.stage === 3 && Boolean(selectedSubtype));

                    return (
                        <div 
                            key={step.stage} 
                            onClick={() => {
                                if (isAccessible && onStepClick) {
                                    onStepClick(step.stage);
                                }
                            }}
                            className={`relative z-10 flex flex-col items-center group ${
                                isAccessible ? 'cursor-pointer' : 'cursor-default opacity-60'
                            }`}
                        >
                            <motion.div
                                whileHover={isAccessible ? { scale: 1.08 } : {}}
                                whileTap={isAccessible ? { scale: 0.95 } : {}}
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                                    isCompleted
                                        ? 'bg-gradient-to-tr from-[#2463EB] to-[#1d4ed8] text-white shadow-[#2463EB]/25'
                                        : isCurrent
                                            ? 'bg-white dark:bg-[#070e28] text-[#2463EB] border-2 border-[#2463EB] ring-4 ring-[#D9EBFF] dark:ring-[#2463EB]/20 shadow-blue-500/20'
                                            : 'bg-white dark:bg-[#0a1438] text-slate-400 border border-slate-200 dark:border-[#14235a]'
                                }`}
                            >
                                {isCompleted ? (
                                    <Check className="w-5 h-5 stroke-[2.5]" />
                                ) : (
                                    <Icon className="w-5 h-5" />
                                )}
                            </motion.div>

                            <div className="mt-2 text-center">
                                <span className={`text-[11px] font-bold uppercase tracking-wider block ${
                                    isCurrent || isCompleted ? 'text-[#172B4D] dark:text-white' : 'text-slate-400'
                                }`}>
                                    {step.label}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 max-w-[120px] truncate block font-medium">
                                    {step.value}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default JourneyStepIndicator;
