import React from 'react';
import { Hammer, TrendingUp, Settings, RefreshCw } from 'lucide-react';
import { parseNum } from './useEstimatorEngine';

export const EstimatorFinancialsTab: React.FC<{ engine: any }> = ({ engine }) => {
  const { state, actions } = engine;
  const { 
    laborType, laborRate, laborLumpSum, profitMargin, 
    discountType, discountValue, gstEnabled, cgstRate, sgstRate,
    paintQuality, config
  } = state;
  const { 
    setLaborType, setLaborRate, setLaborLumpSum, setProfitMargin, 
    setDiscountType, setDiscountValue, setGstEnabled, setCgstRate, setSgstRate, setPaintQuality, 
    setConfig, cascadePricing 
  } = actions;

  return (
    <div className="space-y-5 animate-in fade-in pb-24">
      
      {/* Labor Setup */}
      <div className="bg-[#0f172a] border border-amber-500/10 p-5 shadow-sm">
        <h3 className="text-white font-semibold mb-5 flex items-center gap-2" >
          <Hammer size={16} className="text-[#f59e0b]"/> Labor & Execution Setup
        </h3>
        <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
          <div>
            <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >Labor Calculation Type</label>
            <div className="flex bg-[#020617] p-1 border border-slate-800">
              <button aria-label="Square Foot Labor" onClick={() => setLaborType('sqft')} className={`flex-1 py-2 text-xs font-medium transition-colors ${laborType === 'sqft' ? 'bg-[#f59e0b] text-[#020617]' : 'text-white/40 hover:text-white'}`}>Per Square Foot</button>
              <button aria-label="Lump Sum Labor" onClick={() => setLaborType('lumpsum')} className={`flex-1 py-2 text-xs font-medium transition-colors ${laborType === 'lumpsum' ? 'bg-[#f59e0b] text-[#020617]' : 'text-white/40 hover:text-white'}`}>Lump Sum / Contract</button>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >{laborType === 'sqft' ? 'Labor Rate (₹ / sqft)' : 'Total Fixed Labor Cost (₹)'}</label>
            <input aria-label="Labor Rate Input" type="number" min="0" value={laborType === 'sqft' ? laborRate : laborLumpSum} onChange={e => laborType === 'sqft' ? setLaborRate(parseNum(e.target.value).toString()) : setLaborLumpSum(parseNum(e.target.value).toString())} className="w-full bg-[#020617] border border-slate-800 text-white py-2.5 px-4 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors"  />
          </div>
        </div>
      </div>

      {/* Margins & Taxes */}
      <div className="bg-[#0f172a] border border-amber-500/10 p-5 shadow-sm">
        <h3 className="text-white font-semibold mb-5 flex items-center gap-2" >
          <TrendingUp size={16} className="text-[#f59e0b]"/> Commercials (Margins & Taxes)
        </h3>
        <div className="grid sm:grid-cols-3 gap-5 max-w-4xl">
          <div>
            <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >Profit Margin (%)</label>
            <input aria-label="Profit Margin" type="number" min="0" value={profitMargin} onChange={e => setProfitMargin(parseNum(e.target.value).toString())} className="w-full bg-[#020617] border border-slate-800 py-2.5 px-4 text-sm focus:outline-none focus:border-[#f59e0b]/40 text-emerald-400 font-medium transition-colors"  />
          </div>
          <div>
            <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >Discount Details</label>
            <div className="flex">
              <select aria-label="Discount Type" value={discountType} onChange={e=>setDiscountType(e.target.value as 'flat'|'percent')} className="bg-[#020617] border border-slate-800 border-r-0 py-2.5 pl-3 pr-1 text-sm focus:outline-none text-white/80 cursor-pointer" >
                <option value="flat">₹ Flat</option>
                <option value="percent">% Pct</option>
              </select>
              <input aria-label="Discount Value" type="number" min="0" max={discountType === 'percent' ? 100 : undefined} placeholder="Value" value={discountValue} onChange={e => {
                let val = parseNum(e.target.value);
                if (discountType === 'percent' && val > 100) val = 100;
                setDiscountValue(val.toString());
              }} className="flex-1 w-full bg-[#020617] border border-slate-800 py-2.5 px-4 text-sm focus:outline-none focus:border-[#f59e0b]/40 text-red-300 transition-colors"  />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase mb-2 flex items-center gap-2" >
              <input aria-label="Apply GST Checkbox" type="checkbox" checked={gstEnabled} onChange={e => setGstEnabled(e.target.checked)} className="accent-[#f59e0b] w-3 h-3 cursor-pointer" /> Apply Taxes (GST)
            </label>
            <div className={`grid grid-cols-2 gap-2 transition-opacity ${gstEnabled ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
               <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/40" >CGST</span>
                 <input aria-label="CGST Rate" type="number" min="0" max="100" value={cgstRate} onChange={e=>setCgstRate(parseNum(e.target.value).toString())} className="w-full bg-[#020617] border border-slate-800 py-2.5 pl-12 pr-2 text-sm focus:outline-none focus:border-[#f59e0b]/40 text-white"  />
                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40">%</span>
               </div>
               <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-white/40" >SGST</span>
                 <input aria-label="SGST Rate" type="number" min="0" max="100" value={sgstRate} onChange={e=>setSgstRate(parseNum(e.target.value).toString())} className="w-full bg-[#020617] border border-slate-800 py-2.5 pl-12 pr-2 text-sm focus:outline-none focus:border-[#f59e0b]/40 text-white"  />
                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40">%</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Defaults */}
      <div className="bg-[#0f172a] border border-amber-500/10 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2" >
              <Settings size={16} className="text-[#f59e0b]"/> Global Engine Defaults
            </h3>
            <p className="text-[10px] text-white/40 mt-1 uppercase tracking-[0.12em]" >These base rates power the "Apply System" presets in the Rooms tab.</p>
          </div>
          <button aria-label="Cascade Pricing & Coverages to existing items" title="Click to force-update all materials currently added in your rooms with these new global rates and coverages." onClick={cascadePricing} className="px-5 py-2.5 border border-amber-500/10 text-emerald-400 text-xs hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-colors flex items-center gap-2 uppercase tracking-[0.12em]" >
            <RefreshCw size={13}/> Cascade Updates to Rooms
          </button>
        </div>
        
        <div className="mb-8">
          <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-3" >Default Paint Quality Applied by Presets</label>
          <div className="flex bg-[#020617] p-1 border border-slate-800 w-max">
            <button aria-label="Economy Paint" onClick={() => setPaintQuality('Economy')} className={`px-8 py-2 text-xs font-medium transition-colors ${paintQuality === 'Economy' ? 'bg-[#f59e0b] text-[#020617]' : 'text-white/40 hover:text-white'}`}>Economy</button>
            <button aria-label="Premium Paint" onClick={() => setPaintQuality('Premium')} className={`px-8 py-2 text-xs font-medium transition-colors ${paintQuality === 'Premium' ? 'bg-[#f59e0b] text-[#020617]' : 'text-white/40 hover:text-white'}`}>Premium</button>
            <button aria-label="Luxury Paint" onClick={() => setPaintQuality('Luxury')} className={`px-8 py-2 text-xs font-medium transition-colors ${paintQuality === 'Luxury' ? 'bg-[#f59e0b] text-[#020617]' : 'text-white/40 hover:text-white'}`}>Luxury</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-x-10 gap-y-8">
          <div>
            <h4 className="text-[10px] text-[#f59e0b] uppercase tracking-[0.12em] border-b border-amber-500/10 pb-2 mb-3" >Base Coverages</h4>
            <div className="space-y-3">
              <label className="flex justify-between items-center text-sm text-white/80" >Paint (sqft/L) <input type="number" aria-label="Paint Coverage" min="0" value={config.paintCoverage} onChange={e=>setConfig({...config, paintCoverage: parseNum(e.target.value)})} className="bg-[#020617] border border-slate-800 p-1.5 w-20 text-center focus:border-[#f59e0b]/40 outline-none transition-colors" /></label>
              <label className="flex justify-between items-center text-sm text-white/80" >Primer (sqft/L) <input type="number" aria-label="Primer Coverage" min="0" value={config.primerCoverage} onChange={e=>setConfig({...config, primerCoverage: parseNum(e.target.value)})} className="bg-[#020617] border border-slate-800 p-1.5 w-20 text-center focus:border-[#f59e0b]/40 outline-none transition-colors" /></label>
              <label className="flex justify-between items-center text-sm text-white/80" >Putty (sqft/Kg) <input type="number" aria-label="Putty Coverage" min="0" value={config.puttyCoverage} onChange={e=>setConfig({...config, puttyCoverage: parseNum(e.target.value)})} className="bg-[#020617] border border-slate-800 p-1.5 w-20 text-center focus:border-[#f59e0b]/40 outline-none transition-colors" /></label>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] text-[#f59e0b] uppercase tracking-[0.12em] border-b border-amber-500/10 pb-2 mb-3" >Paint Pricing (₹/L)</h4>
            <div className="space-y-3">
              <label className="flex justify-between items-center text-sm text-white/80" >Economy <input type="number" aria-label="Economy Paint Price" min="0" value={config.economyPaintPrice} onChange={e=>setConfig({...config, economyPaintPrice: parseNum(e.target.value)})} className="bg-[#020617] border border-slate-800 p-1.5 w-20 text-center focus:border-[#f59e0b]/40 outline-none transition-colors" /></label>
              <label className="flex justify-between items-center text-sm text-white/80" >Premium <input type="number" aria-label="Premium Paint Price" min="0" value={config.premiumPaintPrice} onChange={e=>setConfig({...config, premiumPaintPrice: parseNum(e.target.value)})} className="bg-[#020617] border border-slate-800 p-1.5 w-20 text-center focus:border-[#f59e0b]/40 outline-none transition-colors" /></label>
              <label className="flex justify-between items-center text-sm text-white/80" >Luxury <input type="number" aria-label="Luxury Paint Price" min="0" value={config.luxuryPaintPrice} onChange={e=>setConfig({...config, luxuryPaintPrice: parseNum(e.target.value)})} className="bg-[#020617] border border-slate-800 p-1.5 w-20 text-center focus:border-[#f59e0b]/40 outline-none transition-colors" /></label>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] text-[#f59e0b] uppercase tracking-[0.12em] border-b border-amber-500/10 pb-2 mb-3" >Prep & Allowances</h4>
            <div className="space-y-3">
              <label className="flex justify-between items-center text-sm text-white/80" >Primer (₹/L) <input type="number" aria-label="Primer Price" min="0" value={config.primerPrice} onChange={e=>setConfig({...config, primerPrice: parseNum(e.target.value)})} className="bg-[#020617] border border-slate-800 p-1.5 w-20 text-center focus:border-[#f59e0b]/40 outline-none transition-colors" /></label>
              <label className="flex justify-between items-center text-sm text-white/80" >Putty (₹/Kg) <input type="number" aria-label="Putty Price" min="0" value={config.puttyPrice} onChange={e=>setConfig({...config, puttyPrice: parseNum(e.target.value)})} className="bg-[#020617] border border-slate-800 p-1.5 w-20 text-center focus:border-[#f59e0b]/40 outline-none transition-colors" /></label>
              <div className="pt-2"></div>
              <label className="flex justify-between items-center text-sm text-white/80" >Consumables (%) <input type="number" aria-label="Consumables Percentage" min="0" value={config.consumablesPercentage} onChange={e=>setConfig({...config, consumablesPercentage: parseNum(e.target.value)})} className="bg-[#020617] border border-slate-800 p-1.5 w-20 text-center focus:border-[#f59e0b]/40 outline-none transition-colors text-red-300" /></label>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
