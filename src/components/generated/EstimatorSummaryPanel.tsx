import React from 'react';
import { Calculator, Box, FileText } from 'lucide-react';

export const EstimatorSummaryPanel: React.FC<{ engine: any }> = ({ engine }) => {
  const { state } = engine;
  const { 
    totalWallArea, totalCeilingArea, totalNetArea, 
    totalMaterialCost, laborCost, consumablesCost, subtotal, 
    profitAmount, discountAmount, gstEnabled, cgstRate, sgstRate, 
    cgstAmount, sgstAmount, finalProjectCost, discountType, shoppingList 
  } = state;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full xl:w-[450px] bg-[#0f172a] border-l border-amber-500/10 p-8 flex flex-col shrink-0 h-full overflow-y-auto">
      <h3 className="text-white font-semibold mb-8 flex items-center gap-2" >
        <Calculator size={16} className="text-[#f59e0b]"/> Live Estimate Summary
      </h3>
      
      <div className="flex-1 space-y-8">
        
        {/* Area Aggregation */}
        <div>
          <h4 className="text-[10px] text-white/35 tracking-[0.12em] uppercase border-b border-amber-500/10 pb-2 mb-4" >Area Aggregation</h4>
          <div className="space-y-3" >
            <div className="flex justify-between text-sm"><span className="text-white/60">Total Wall Area</span><span className="text-white">{totalWallArea.toFixed(0)} sqft</span></div>
            <div className="flex justify-between text-sm"><span className="text-white/60">Total Ceiling Area</span><span className="text-white">{totalCeilingArea.toFixed(0)} sqft</span></div>
            <div className="flex justify-between text-sm font-semibold pt-2 border-t border-slate-800"><span className="text-[#f59e0b]">Net Paintable Area</span><span className="text-[#f59e0b] flex items-center gap-1"><Box size={14}/> {totalNetArea.toFixed(0)} sqft</span></div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div>
          <h4 className="text-[10px] text-white/35 tracking-[0.12em] uppercase border-b border-amber-500/10 pb-2 mb-4" >Cost Breakdown</h4>
          <div className="space-y-3" >
            <div className="flex justify-between text-sm"><span className="text-white/60">Material Procurement</span><span className="text-white font-medium">₹{totalMaterialCost.toLocaleString(undefined, {maximumFractionDigits:0})}</span></div>
            <div className="flex justify-between text-sm"><span className="text-white/60">Labor & Execution</span><span className="text-white font-medium">₹{laborCost.toLocaleString(undefined, {maximumFractionDigits:0})}</span></div>
            <div className="flex justify-between text-sm"><span className="text-white/60">Prep & Consumables</span><span className="text-white font-medium">₹{consumablesCost.toLocaleString(undefined, {maximumFractionDigits:0})}</span></div>
            
            <div className="flex justify-between text-sm font-medium pt-3 border-t border-slate-800"><span className="text-white/80">Subtotal</span><span className="text-white">₹{subtotal.toLocaleString(undefined, {maximumFractionDigits:0})}</span></div>
            
            <div className="flex justify-between text-sm text-emerald-400"><span className="">Commercial Margin</span><span className="">+ ₹{profitAmount.toLocaleString(undefined, {maximumFractionDigits:0})}</span></div>
            {discountAmount > 0 && (
               <div className="flex justify-between text-sm text-red-400"><span className="">Discount {discountType === 'percent' ? '(%)' : ''}</span><span className="">- ₹{discountAmount.toLocaleString(undefined, {maximumFractionDigits:0})}</span></div>
            )}
            
            {gstEnabled && (
              <>
                <div className="flex justify-between text-xs text-white/40"><span className="">CGST ({cgstRate}%)</span><span className="">+ ₹{cgstAmount.toLocaleString(undefined, {maximumFractionDigits:0})}</span></div>
                <div className="flex justify-between text-xs text-white/40"><span className="">SGST ({sgstRate}%)</span><span className="">+ ₹{sgstAmount.toLocaleString(undefined, {maximumFractionDigits:0})}</span></div>
              </>
            )}
          </div>
        </div>

        {/* Bill of Materials */}
        {shoppingList && shoppingList.length > 0 && (
          <div>
            <h4 className="text-[10px] text-white/35 tracking-[0.12em] uppercase border-b border-amber-500/10 pb-2 mb-4" >Bill of Materials</h4>
            <div className="space-y-2 text-xs" >
              {shoppingList.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-800/50 last:border-0">
                   <div className="flex flex-col">
                     <span className="text-white/80">{item.name}</span>
                     <span className="text-[9px] text-white/30 uppercase tracking-widest">{item.category}</span>
                   </div>
                   <span className="text-[#f59e0b] font-medium text-right">{item.procurementQty.toLocaleString(undefined, {maximumFractionDigits:2})} <span className="text-white/40 text-[10px] ml-1">{item.unit}</span></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-8 border-t border-amber-500/10 shrink-0">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-[10px] text-white/35 tracking-[0.12em] uppercase mb-1" >Final Estimated Total</p>
            <p className="text-3xl font-bold text-white tracking-tight" >₹{finalProjectCost.toLocaleString(undefined, {maximumFractionDigits:0})}</p>
          </div>
        </div>
        <button aria-label="Generate Proposal" onClick={handlePrint} className="w-full bg-[#f59e0b] text-[#020617] px-8 py-4 text-xs tracking-[0.12em] uppercase font-semibold hover:bg-[#fbbf24] transition-colors flex justify-center items-center gap-2 shadow-md shadow-amber-500/20" >
          <FileText size={16} /> Generate Proposal
        </button>
      </div>
    </div>
  );
};
