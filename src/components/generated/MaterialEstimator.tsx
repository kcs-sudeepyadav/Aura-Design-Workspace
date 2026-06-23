import React, { useState } from 'react';
import { Box, AlertTriangle, Layers, Calculator, FileCheck, Calculator as CalcIcon } from 'lucide-react';
import { useEstimatorEngine } from './useEstimatorEngine';
import { EstimatorRoomsTab } from './EstimatorRoomsTab';
import { EstimatorFinancialsTab } from './EstimatorFinancialsTab';
import { EstimatorManageTab } from './EstimatorManageTab';
import { EstimatorSummaryPanel } from './EstimatorSummaryPanel';
import { EstimatorPrintView } from './EstimatorPrintView';

export const MaterialEstimator: React.FC = () => {
  const engine = useEstimatorEngine();
  const [activeTab, setActiveTab] = useState<'rooms' | 'financials' | 'manage'>('rooms');
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  return (
    <>

      
      {/* 
        Print View 
        We use fixed inset-0 z-[9999] during print to occlude the parent HubPages sidebar and headers.
      */}
      <div className="hidden print:block print:fixed print:inset-0 print:z-[9999] print:bg-white print:w-full print:h-full print:overflow-y-auto">
         <EstimatorPrintView engine={engine} />
      </div>

      <div className="bg-[#020617] min-h-screen text-white flex flex-col h-screen overflow-hidden print:hidden" >
        
        {/* UI Layout (Hidden when printing) */}
        <div className="flex flex-col h-full">
          
          {/* GLOBAL HEADER */}
          <div className="px-8 py-5 flex flex-col md:flex-row md:items-center justify-between border-b border-amber-500/10 bg-[#0f172a] shrink-0">
            <div>
              <h2 className="text-xl font-semibold text-white flex items-center gap-2" >
                <Box size={20} className="text-[#f59e0b]"/> Enterprise Estimator
              </h2>
              <p className="text-white/40 text-[10px] tracking-[0.12em] uppercase mt-1">Multi-Room Advanced Costing Engine</p>
            </div>
          </div>

          {engine.state.hasNegativeDimensions && (
            <div className="bg-red-500/10 border-b border-red-500/20 text-red-400 text-sm py-2 px-8 flex items-center gap-2 shrink-0">
              <AlertTriangle size={16}/> Warning: Negative dimensions detected. Please correct inputs.
            </div>
          )}

          {/* TWO-COLUMN WORKSPACE */}
          <div className="flex-1 flex flex-col xl:flex-row overflow-hidden min-h-0 relative">
            
            {/* LEFT COLUMN: Tabbed Workspace */}
            <div className="flex-1 flex flex-col bg-[#020617] h-full overflow-hidden">
              
              {/* Tabs */}
              <div className="flex px-4 border-b border-amber-500/10 bg-[#0f172a] shrink-0 overflow-x-auto estimator-scroll">
                <button aria-label="Rooms Tab" onClick={() => setActiveTab('rooms')} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'rooms' ? 'border-[#f59e0b] text-[#f59e0b]' : 'border-transparent text-white/50 hover:text-white'}`} >
                  <Layers size={16}/> Rooms & Materials
                </button>
                <button aria-label="Financials Tab" onClick={() => setActiveTab('financials')} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'financials' ? 'border-[#f59e0b] text-[#f59e0b]' : 'border-transparent text-white/50 hover:text-white'}`} >
                  <Calculator size={16}/> Financials & Config
                </button>
                <button aria-label="Manage Tab" onClick={() => setActiveTab('manage')} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'manage' ? 'border-[#f59e0b] text-[#f59e0b]' : 'border-transparent text-white/50 hover:text-white'}`} >
                  <FileCheck size={16}/> Estimate Management
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-5 relative estimator-scroll">
                {activeTab === 'rooms' && <EstimatorRoomsTab engine={engine} />}
                {activeTab === 'financials' && <EstimatorFinancialsTab engine={engine} />}
                {activeTab === 'manage' && <EstimatorManageTab engine={engine} />}
              </div>
            </div>

            {/* RIGHT COLUMN: Desktop Summary Panel */}
            <div className="hidden xl:flex h-full">
              <EstimatorSummaryPanel engine={engine} />
            </div>

            {/* MOBILE FLOATING ACTION BAR (FAB) */}
            <div className="xl:hidden fixed bottom-0 left-0 right-0 bg-[#0f172a] border-t border-amber-500/20 p-4 shadow-2xl z-50">
              <div className="flex justify-between items-center max-w-md mx-auto">
                <div>
                  <p className="text-[10px] text-white/35 tracking-[0.12em] uppercase mb-1" >Total Cost</p>
                  <p className="text-xl font-bold text-white" >₹{engine.state.finalProjectCost.toLocaleString(undefined, {maximumFractionDigits:0})}</p>
                </div>
                <div className="flex gap-2">
                   <button aria-label="Toggle Summary Details" onClick={() => setShowMobileSummary(!showMobileSummary)} className="bg-[#020617] border border-amber-500/10 text-white/70 px-4 py-2 text-xs uppercase tracking-[0.12em] font-semibold flex items-center gap-2">
                    <CalcIcon size={14}/> {showMobileSummary ? 'Hide' : 'Details'}
                  </button>
                  <button aria-label="Generate Proposal Mobile" onClick={() => window.print()} className="bg-[#f59e0b] text-[#020617] px-4 py-2 text-xs uppercase tracking-[0.12em] font-semibold">
                    Export
                  </button>
                </div>
              </div>

              {/* Mobile Expanded Summary */}
              {showMobileSummary && (
                <div className="mt-4 pt-4 border-t border-slate-800 animate-in slide-in-from-bottom-2">
                  <div className="space-y-2 text-sm max-w-md mx-auto" >
                    <div className="flex justify-between"><span className="text-white/60">Materials</span><span className="text-white">₹{engine.state.totalMaterialCost.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-white/60">Labor</span><span className="text-white">₹{engine.state.laborCost.toLocaleString()}</span></div>
                    <div className="flex justify-between text-emerald-400"><span>Profit</span><span>+₹{engine.state.profitAmount.toLocaleString()}</span></div>
                    {engine.state.gstEnabled && (
                      <div className="flex justify-between text-white/40 text-xs"><span>CGST/SGST</span><span>+₹{(engine.state.cgstAmount + engine.state.sgstAmount).toLocaleString()}</span></div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* End Mobile FAB */}

          </div>
        </div>
      </div>
    </>
  );
};
