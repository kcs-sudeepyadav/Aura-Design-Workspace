import React, { useState } from 'react';
import { Save, Download, Copy, Trash2, Split, Info } from 'lucide-react';
import { EstimateVersion } from './EstimatorTypes';
import { parseNum } from './useEstimatorEngine';

export const EstimatorManageTab: React.FC<{ engine: any }> = ({ engine }) => {
  const { state, actions } = engine;
  const { 
    clientName, projectName, versions, currentVersionId 
  } = state;
  const { 
    setClientName, setProjectName, saveVersion, loadVersion, duplicateVersion, resetWorkspace, updateVersionName, deleteVersion 
  } = actions;

  const [compareV1, setCompareV1] = useState<string>('');
  const [compareV2, setCompareV2] = useState<string>('');

  const calculateVersionTotal = (v: EstimateVersion) => {
    // Re-run simplified engine math for comparison
    const totalWallArea = v.rooms.reduce((acc, r) => acc + ((parseNum(r.length) + parseNum(r.width)) * 2 * parseNum(r.height)), 0);
    const totalCeilingArea = v.rooms.reduce((acc, r) => acc + (r.includeCeiling ? (parseNum(r.length) * parseNum(r.width)) : 0), 0);
    const totalDeductions = v.rooms.reduce((acc, r) => acc + r.openings.reduce((oAcc, o) => oAcc + (parseNum(o.width) * parseNum(o.height) * parseNum(o.qty)), 0), 0);
    
    const netArea = Math.max(0, (totalWallArea + totalCeilingArea) - totalDeductions);
    
    let matCost = 0;
    v.rooms.forEach(r => {
      const rWall = (parseNum(r.length) + parseNum(r.width)) * 2 * parseNum(r.height);
      const rCeil = r.includeCeiling ? (parseNum(r.length) * parseNum(r.width)) : 0;
      const rDed = r.openings.reduce((oAcc, o) => oAcc + (parseNum(o.width) * parseNum(o.height) * parseNum(o.qty)), 0);
      const rNet = Math.max(0, (rWall + rCeil) - rDed);
      const rFloor = parseNum(r.length) * parseNum(r.width);
      const rCeilRaw = parseNum(r.length) * parseNum(r.width);

      r.materials.forEach(m => {
        const isItem = ['Pieces', 'Nos', 'Set', 'Unit'].includes(m.unit);
        let baseQty = 0;
        let effArea = 0;

        if (isItem) {
          baseQty = parseNum(m.coats, 1);
        } else {
          let surfaceArea = rNet;
          if (m.category === 'Flooring') surfaceArea = rFloor;
          else if (m.category === 'False Ceiling') surfaceArea = rCeilRaw;

          effArea = surfaceArea * parseNum(m.coats, 1);
          if (m.coverage > 0) {
            baseQty = effArea / m.coverage;
          } else {
            baseQty = effArea;
          }
        }

        const wasteQty = baseQty * (parseNum(m.wastage) / 100);
        let finalQty = baseQty + wasteQty;
        if (['Liters', 'L', 'Kg', 'Bags', 'Gallons'].includes(m.unit) || isItem) finalQty = Math.ceil(finalQty);
        matCost += (finalQty * parseNum(m.rate));
      });
    });

    const laborCost = v.laborType === 'sqft' ? (netArea * parseNum(v.laborRate)) : parseNum(v.laborLumpSum);
    const consCost = (matCost + laborCost) * (parseNum(v.config.consumablesPercentage) / 100);
    const sub = matCost + laborCost + consCost;
    const profit = sub * (parseNum(v.profitMargin) / 100);
    
    let discVal = parseNum(v.discountValue);
    if(v.discountType === 'percent' && discVal > 100) discVal = 100;
    const discount = v.discountType === 'percent' ? (sub * (discVal / 100)) : discVal;
    
    const beforeTax = Math.max(0, sub + profit - discount);
    
    const cgstRate = parseNum(v.cgstRate || '9');
    const sgstRate = parseNum(v.sgstRate || '9');

    const tax = v.gstEnabled ? (beforeTax * ((cgstRate + sgstRate) / 100)) : 0;
    return beforeTax + tax;
  };

  const v1Data = versions.find(v => v.id === compareV1);
  const v2Data = versions.find(v => v.id === compareV2);
  const v1Total = v1Data ? calculateVersionTotal(v1Data as any) : 0;
  const v2Total = v2Data ? calculateVersionTotal(v2Data as any) : 0;
  const diff = v2Total - v1Total;

  return (
    <div className="space-y-5 animate-in fade-in pb-24">
      
      {/* Client Details */}
      <div className="bg-[#0f172a] border border-amber-500/10 p-5 shadow-sm">
        <h3 className="text-white font-semibold mb-5" >Project & Client Details</h3>
        <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
          <div>
            <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >Client Name</label>
            <input aria-label="Client Name" type="text" placeholder="e.g. Mr. Sharma" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full bg-[#020617] border border-slate-800 text-white py-2.5 px-4 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors"  />
          </div>
          <div>
            <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >Project / Site Name</label>
            <input aria-label="Project Name" type="text" placeholder="e.g. 3BHK Whitefield" value={projectName} onChange={e => setProjectName(e.target.value)} className="w-full bg-[#020617] border border-slate-800 text-white py-2.5 px-4 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors"  />
          </div>
        </div>
      </div>

      {/* Version Control */}
      <div className="bg-[#0f172a] border border-amber-500/10 p-5 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-semibold" >Estimate Revisions & Versions</h3>
          <div className="flex gap-3">
             <button aria-label="Start Fresh" onClick={resetWorkspace} className="px-5 py-2.5 border border-amber-500/10 text-white/50 text-xs hover:border-amber-500/30 hover:text-white/70 transition-colors uppercase tracking-[0.12em]" >
              Start Fresh
            </button>
            <button aria-label="Save Version" onClick={saveVersion} className="bg-[#f59e0b] text-[#020617] px-6 py-2.5 text-xs tracking-[0.12em] uppercase font-semibold hover:bg-[#fbbf24] transition-colors flex items-center gap-2 shadow-md shadow-amber-500/20" >
              <Save size={13}/> Save Version
            </button>
          </div>
        </div>
        
        {versions.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-800">
            <p className="text-white/30 text-sm" >No saved versions yet. Save your first estimate.</p>
          </div>
        ) : (
          <div className="border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-sm" >
              <thead className="bg-[#020617] text-white/40 text-[10px] uppercase tracking-[0.12em]">
                <tr>
                  <th className="px-5 py-3 font-medium">Version Name</th>
                  <th className="px-5 py-3 font-medium">Date Saved</th>
                  <th className="px-5 py-3 font-medium">Rooms</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-white/80 text-xs">
                {versions.map(v => (
                  <tr key={v.id} className={`hover:bg-white/5 transition-colors ${currentVersionId === v.id ? 'bg-amber-500/5' : ''}`}>
                    <td className="px-5 py-2 font-medium flex items-center gap-2">
                      <input aria-label="Rename Version" type="text" value={v.name} onChange={e => updateVersionName(v.id, e.target.value)} className="bg-transparent focus:outline-none focus:border-b focus:border-[#f59e0b]/50 border-b border-transparent py-1 w-full max-w-[200px]" />
                      {currentVersionId === v.id && <span className="text-[9px] bg-[#f59e0b] text-[#020617] px-1.5 py-0.5 uppercase font-bold tracking-[0.12em]">Active</span>}
                    </td>
                    <td className="px-5 py-2 text-white/50">{new Date(v.timestamp).toLocaleString()}</td>
                    <td className="px-5 py-2">{v.rooms.length}</td>
                    <td className="px-5 py-2 text-right">
                      <div className="flex justify-end gap-2">
                        <button aria-label="Load Version" onClick={() => loadVersion(v.id)} className="p-1.5 border border-amber-500/10 text-white/50 hover:border-amber-500/30 hover:text-white/70 transition-colors" title="Load"><Download size={13}/></button>
                        <button aria-label="Duplicate Version" onClick={duplicateVersion} className="p-1.5 border border-amber-500/10 text-white/50 hover:border-amber-500/30 hover:text-white/70 transition-colors" title="Duplicate"><Copy size={13}/></button>
                        <button aria-label="Delete Version" onClick={() => deleteVersion(v.id)} className="p-1.5 border border-amber-500/10 text-white/50 hover:border-red-500/50 hover:text-red-400 transition-colors" title="Delete"><Trash2 size={13}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Compare Tool */}
      {versions.length >= 2 && (
        <div className="bg-[#0f172a] border border-amber-500/10 p-5 shadow-sm">
          <h3 className="text-white font-semibold mb-5 flex items-center gap-2" ><Split size={16} className="text-[#f59e0b]"/> Compare Revisions</h3>
          <div className="flex gap-4 items-center mb-6 max-w-3xl">
            <select aria-label="Compare Version 1" value={compareV1} onChange={e=>setCompareV1(e.target.value)} className="flex-1 bg-[#020617] border border-slate-800 py-2.5 px-3 text-sm focus:outline-none text-white/80 cursor-pointer" >
              <option value="">Select Base Version...</option>
              {versions.map(v => <option key={v.id} value={v.id}>{v.name} ({new Date(v.timestamp).toLocaleDateString()})</option>)}
            </select>
            <span className="text-white/20 font-medium text-xs tracking-widest uppercase">VS</span>
            <select aria-label="Compare Version 2" value={compareV2} onChange={e=>setCompareV2(e.target.value)} className="flex-1 bg-[#020617] border border-slate-800 py-2.5 px-3 text-sm focus:outline-none text-white/80 cursor-pointer" >
              <option value="">Select Target Version...</option>
              {versions.map(v => <option key={v.id} value={v.id}>{v.name} ({new Date(v.timestamp).toLocaleDateString()})</option>)}
            </select>
          </div>

          {v1Data && v2Data && (
            <div className="grid grid-cols-3 gap-4 text-sm bg-[#020617] border border-slate-800 p-5" >
              <div className="font-semibold text-[#f59e0b] uppercase tracking-[0.12em] text-[10px] border-b border-amber-500/10 pb-2">Metric</div>
              <div className="font-semibold text-[#f59e0b] uppercase tracking-[0.12em] text-[10px] border-b border-amber-500/10 pb-2">{v1Data.name}</div>
              <div className="font-semibold text-[#f59e0b] uppercase tracking-[0.12em] text-[10px] border-b border-amber-500/10 pb-2">{v2Data.name}</div>

              <div className="text-white/60 text-xs">Total Rooms</div>
              <div className="text-white text-xs">{v1Data.rooms.length}</div>
              <div className="text-white text-xs">{v2Data.rooms.length}</div>

              <div className="text-white/60 text-xs">Paint Quality</div>
              <div className="text-white text-xs">{v1Data.paintQuality}</div>
              <div className="text-white text-xs">{v2Data.paintQuality}</div>
              
              <div className="text-white/60 text-xs">GST Enabled</div>
              <div className="text-white text-xs">{v1Data.gstEnabled ? 'Yes' : 'No'}</div>
              <div className="text-white text-xs">{v2Data.gstEnabled ? 'Yes' : 'No'}</div>
              
              <div className="text-white/60 text-xs font-semibold pt-3 border-t border-slate-800">Final Estimated Cost</div>
              <div className="text-white text-sm font-semibold pt-3 border-t border-slate-800">₹{v1Total.toLocaleString(undefined, {maximumFractionDigits:0})}</div>
              <div className={`text-sm font-semibold pt-3 border-t border-slate-800 ${diff > 0 ? 'text-red-400' : diff < 0 ? 'text-emerald-400' : 'text-white'}`}>
                ₹{v2Total.toLocaleString(undefined, {maximumFractionDigits:0})}
                {diff !== 0 && <span className="text-[10px] ml-2 tracking-widest uppercase opacity-80">({diff > 0 ? '+' : ''}₹{diff.toLocaleString(undefined, {maximumFractionDigits:0})})</span>}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
