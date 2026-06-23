import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Box, PaintBucket, CheckSquare, AlertTriangle, SlidersHorizontal } from 'lucide-react';
import { MATERIAL_CATEGORIES, MATERIAL_LIBRARY } from './EstimatorTypes';
import { parseNum } from './useEstimatorEngine';

export const EstimatorRoomsTab: React.FC<{ engine: any }> = ({ engine }) => {
  const { state, actions } = engine;
  const { rooms, roomCalculations, paintQuality } = state;
  const { 
    addRoom, removeRoom, toggleRoom, updateRoom, 
    addOpening, updateOpening, removeOpening, 
    addMaterial, updateMaterial, removeMaterial, toggleMaterialAdvanced, applyDefaultPaint 
  } = actions;

  // Local state for material adder dropdowns to fix the dependency bug
  const [selectedCats, setSelectedCats] = useState<Record<string, string>>({});
  const handleCatChange = (roomId: string, cat: string) => {
    setSelectedCats(prev => ({ ...prev, [roomId]: cat }));
  };

  // Local state for inline paint preset selection
  const [roomPresets, setRoomPresets] = useState<Record<string, 'Economy'|'Premium'|'Luxury'>>({});

  return (
    <div className="space-y-5 pb-24 animate-in fade-in">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-white" >Setup Rooms</h3>
        <button aria-label="Add Room" onClick={addRoom} className="px-5 py-2.5 border border-amber-500/10 text-white/50 text-xs hover:border-amber-500/30 hover:text-white/70 transition-colors flex items-center gap-2 uppercase tracking-[0.12em]" >
          + Add Room
        </button>
      </div>

      {rooms.map((room: any, rIndex: number) => {
        const rCalc = roomCalculations[rIndex];
        const selectedCat = selectedCats[room.id] || '';
        const presetQuality = roomPresets[room.id] || paintQuality;

        return (
          <div key={room.id} className="bg-[#0f172a] border border-amber-500/10 shadow-sm transition-all duration-300">
            
            {/* Accordion Header */}
            <div className="p-5 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors group" onClick={() => toggleRoom(room.id)}>
              <div className="flex items-center gap-4">
                <button aria-label={room.isExpanded ? "Collapse Room" : "Expand Room"} className={`p-1.5 ${room.isExpanded ? 'text-[#f59e0b]' : 'text-white/30'}`}>
                  {room.isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <div onClick={e => e.stopPropagation()}>
                  <input type="text" value={room.name} onChange={e => updateRoom(room.id, 'name', e.target.value)} aria-label="Room Name" className="bg-transparent text-white font-semibold text-lg focus:outline-none focus:border-b focus:border-[#f59e0b] transition-all"  />
                </div>
              </div>
              <div className="flex items-center gap-6">
                {!room.isExpanded && (
                  <div className="hidden sm:flex gap-6 text-sm text-white/40">
                    <span className="flex items-center gap-1" ><Box size={14}/> {rCalc.netArea} sqft</span>
                    <span className="flex items-center gap-1" ><PaintBucket size={14}/> ₹{rCalc.roomMaterialCost.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                  </div>
                )}
                {rooms.length > 1 && (
                  <button aria-label="Remove Room" onClick={(e) => { e.stopPropagation(); removeRoom(room.id); }} className="text-white/20 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Accordion Body */}
            {room.isExpanded && (
              <div className="p-5 border-t border-amber-500/10 space-y-10">
                
                {/* Dimensions & Openings Grid */}
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Dimensions */}
                  <div>
                    <h4 className="text-[10px] text-white/35 tracking-[0.12em] uppercase flex items-center gap-2 mb-4" ><Box size={14} /> Room Dimensions</h4>
                    
                    <div className="grid grid-cols-12 gap-2 px-2 pb-1 text-[9px] text-white/30 uppercase tracking-[0.12em]" >
                      <div className="col-span-4">Length (ft)</div>
                      <div className="col-span-4">Width (ft)</div>
                      <div className="col-span-4">Height (ft)</div>
                    </div>

                    <div className="grid grid-cols-12 gap-2 items-center bg-[#020617] border border-slate-800 p-2 mb-4">
                      <div className="col-span-4 flex items-center gap-1 border-r border-slate-800 pr-2">
                        <input type="number" min="0" placeholder="0" value={room.length} onChange={e => updateRoom(room.id, 'length', e.target.value)} className="w-full bg-[#0f172a] border border-slate-800 p-1.5 text-xs focus:outline-none focus:border-[#f59e0b]/50 text-white transition-colors"  />
                      </div>
                      <div className="col-span-4 flex items-center gap-1 border-r border-slate-800 pr-2 pl-2">
                        <input type="number" min="0" placeholder="0" value={room.width} onChange={e => updateRoom(room.id, 'width', e.target.value)} className="w-full bg-[#0f172a] border border-slate-800 p-1.5 text-xs focus:outline-none focus:border-[#f59e0b]/50 text-white transition-colors"  />
                      </div>
                      <div className="col-span-4 flex items-center gap-1 pl-2">
                        <input type="number" min="0" placeholder="0" value={room.height} onChange={e => updateRoom(room.id, 'height', e.target.value)} className="w-full bg-[#0f172a] border border-slate-800 p-1.5 text-xs focus:outline-none focus:border-[#f59e0b]/50 text-white transition-colors"  />
                      </div>
                    </div>
                    
                    <label className="flex items-center gap-2 text-xs cursor-pointer text-white/50 hover:text-white transition-colors w-max" >
                      <input type="checkbox" checked={room.includeCeiling} onChange={e => updateRoom(room.id, 'includeCeiling', e.target.checked)} className="accent-[#f59e0b] w-4 h-4" />
                      Include Ceiling Area
                    </label>
                  </div>

                  {/* Deductions */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-[10px] text-white/35 tracking-[0.12em] uppercase flex items-center gap-2" ><CheckSquare size={14} /> Openings (Deductions)</h4>
                      <button aria-label="Add Opening" onClick={() => addOpening(room.id)} className="text-[#f59e0b] text-[10px] uppercase font-bold tracking-[0.12em] hover:bg-[#f59e0b]/10 px-2 py-1 transition-colors">ADD</button>
                    </div>
                    
                    {room.openings.length > 0 && (
                      <div className="grid grid-cols-12 gap-2 px-2 pb-1 text-[9px] text-white/30 uppercase tracking-[0.12em]" >
                        <div className="col-span-3">Type</div>
                        <div className="col-span-2">Width</div>
                        <div className="col-span-2">Height</div>
                        <div className="col-span-2">Qty</div>
                        <div className="col-span-2 text-right">Sqft</div>
                        <div className="col-span-1"></div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {room.openings.length === 0 && <p className="text-xs text-white/20 italic p-2 border border-dashed border-white/5">No openings added.</p>}
                      {room.openings.map((op: any) => (
                        <div key={op.id} className="grid grid-cols-12 gap-2 items-center bg-[#020617] border border-slate-800 p-2">
                          <div className="col-span-3">
                            <select aria-label="Opening Type" value={op.type} onChange={e => updateOpening(room.id, op.id, 'type', e.target.value)} className="w-full bg-transparent text-xs focus:outline-none text-white/80 cursor-pointer" >
                              <option value="Door" className="bg-[#0f172a] text-white">Door</option>
                              <option value="Window" className="bg-[#0f172a] text-white">Window</option>
                              <option value="Custom" className="bg-[#0f172a] text-white">Custom</option>
                            </select>
                          </div>
                          <div className="col-span-2 flex items-center gap-1 pl-2"><input aria-label="Opening Width" placeholder="0" type="number" min="0" value={op.width} onChange={e => updateOpening(room.id, op.id, 'width', e.target.value)} className="w-full bg-[#0f172a] border border-slate-800 p-1.5 text-xs focus:outline-none focus:border-[#f59e0b]/50 text-white transition-colors" /></div>
                          <div className="col-span-2 flex items-center gap-1"><input aria-label="Opening Height" placeholder="0" type="number" min="0" value={op.height} onChange={e => updateOpening(room.id, op.id, 'height', e.target.value)} className="w-full bg-[#0f172a] border border-slate-800 p-1.5 text-xs focus:outline-none focus:border-[#f59e0b]/50 text-white transition-colors" /></div>
                          <div className="col-span-2 flex items-center gap-1"><input aria-label="Opening Quantity" placeholder="1" type="number" min="1" value={op.qty} onChange={e => updateOpening(room.id, op.id, 'qty', e.target.value)} className="w-full bg-[#0f172a] border border-slate-800 p-1.5 text-xs focus:outline-none focus:border-[#f59e0b]/50 text-white transition-colors" /></div>
                          <div className="col-span-2 text-right text-[10px] text-white/30 font-medium" >-{parseNum(op.width) * parseNum(op.height) * parseNum(op.qty)} sqft</div>
                          <div className="col-span-1 text-right">
                            <button aria-label="Remove Opening" onClick={() => removeOpening(room.id, op.id)} className="text-white/20 hover:text-red-400 p-1"><Trash2 size={12} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {rCalc.deductionWarning && <p className="text-[10px] text-red-400 mt-2 flex items-center gap-1" ><AlertTriangle size={12} /> Deductions exceed gross area.</p>}
                  </div>
                </div>

                {/* Quick Area Summary Line */}
                <div className="flex items-center justify-between bg-amber-500/5 border border-amber-500/10 p-4 text-sm" >
                  <div className="flex gap-6 text-[#f59e0b]/60">
                    <span>Gross: {rCalc.grossArea} sqft</span>
                    <span>Deductions: -{rCalc.totalDeductionArea} sqft</span>
                  </div>
                  <div className="font-semibold text-[#f59e0b]">Net Paintable: <span className="font-bold text-xl ml-2">{rCalc.netArea} sqft</span></div>
                </div>

                {/* Materials */}
                <div>
                  <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
                    <h4 className="text-[10px] text-white/35 tracking-[0.12em] uppercase flex items-center gap-2" ><PaintBucket size={14} /> Material Requirements</h4>
                    <div className="flex gap-2 items-center flex-wrap">
                      
                      {/* Inline Preset Selector */}
                      <div className="flex items-center bg-[#020617] border border-amber-500/20">
                         <select aria-label="Preset Quality" value={presetQuality} onChange={e=>setRoomPresets(p => ({...p, [room.id]: e.target.value as any}))} className="bg-transparent text-[10px] text-emerald-400 font-bold uppercase tracking-[0.12em] focus:outline-none pl-3 py-2 cursor-pointer border-r border-amber-500/20 outline-none">
                            <option value="Economy" className="bg-[#0f172a]">Economy</option>
                            <option value="Premium" className="bg-[#0f172a]">Premium</option>
                            <option value="Luxury" className="bg-[#0f172a]">Luxury</option>
                         </select>
                         <button aria-label="Apply Paint System" onClick={() => applyDefaultPaint(room.id, presetQuality)} className="text-emerald-400 text-[10px] uppercase font-bold tracking-[0.12em] hover:bg-emerald-400/10 px-3 py-2 transition-colors">
                          Apply System
                        </button>
                      </div>

                      {/* Material Adder (Fixed Dependency) */}
                      <div className="flex items-center bg-[#020617] border border-slate-800 pr-1">
                        <select aria-label="Material Category" id={`add-mat-cat-${room.id}`} value={selectedCat} onChange={e => handleCatChange(room.id, e.target.value)} className="bg-transparent text-xs text-white/70 focus:outline-none pl-3 py-2 cursor-pointer border-r border-slate-800" >
                          <option value="" className="bg-[#0f172a] text-white/40">Category...</option>
                          {MATERIAL_CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-[#0f172a] text-white">{cat}</option>)}
                        </select>
                        {((selectedCat && MATERIAL_LIBRARY[selectedCat] && MATERIAL_LIBRARY[selectedCat].length > 0) || selectedCat === 'Custom') && (
                          <select aria-label="Material Item" id={`add-mat-lib-${room.id}`} className="bg-transparent text-xs text-white/70 focus:outline-none px-3 py-2 cursor-pointer max-w-[150px]" >
                            <option value="" className="bg-[#0f172a] text-white/40">Item...</option>
                            {(selectedCat && MATERIAL_LIBRARY[selectedCat]) ? MATERIAL_LIBRARY[selectedCat].map((m: any) => <option key={m.name} value={m.name} className="bg-[#0f172a] text-white">{m.name}</option>) : null}
                            {selectedCat === 'Custom' && <option value="Custom Material" className="bg-[#0f172a] text-white">Custom Blank Material</option>}
                          </select>
                        )}
                        <button aria-label="Add Material" onClick={() => {
                          const cat = selectedCat;
                          const itemSelect = document.getElementById(`add-mat-lib-${room.id}`) as HTMLSelectElement | null;
                          const itemName = itemSelect ? itemSelect.value : 'Custom Material';
                          if(cat) addMaterial(room.id, cat, itemName);
                        }} className="bg-[#f59e0b] text-[#020617] text-[10px] uppercase font-bold tracking-[0.12em] hover:bg-[#fbbf24] px-3 py-1.5 transition-colors ml-1">Add</button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {room.materials.length === 0 && <div className="text-center py-8 border border-dashed border-slate-800"><p className="text-white/20 text-sm" >No materials added yet.</p></div>}
                    {room.materials.map((mat: any, mIdx: number) => {
                      const calcMat = rCalc.materialsCalc[mIdx];
                      return (
                        <div key={mat.id} className="bg-[#020617] border border-slate-800 p-1 transition-all group">
                          {/* Material Basic Row */}
                          <div className="flex items-center p-3 relative">
                            <button aria-label="Remove Material" onClick={() => removeMaterial(room.id, mat.id)} className="absolute left-2 text-white/30 hover:text-red-400 transition-colors p-1 bg-[#0f172a] hover:bg-red-500/10 rounded"><Trash2 size={14} /></button>
                            
                            <div className="flex-1 grid grid-cols-12 gap-4 items-center pl-10 pr-4">
                              <div className="col-span-5">
                                <input aria-label="Material Name" type="text" value={mat.name} onChange={e => updateMaterial(room.id, mat.id, 'name', e.target.value)} className="w-full bg-transparent text-sm font-medium text-white focus:outline-none border-b border-transparent focus:border-[#f59e0b]/50"  />
                                <p className="text-[9px] text-white/30 uppercase tracking-[0.12em] mt-0.5" >{mat.category}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-[9px] text-white/30 uppercase tracking-[0.12em]" >Rate</p>
                                <div className="flex items-center text-sm" >₹<input aria-label="Material Rate" type="number" min="0" value={mat.rate} onChange={e => updateMaterial(room.id, mat.id, 'rate', parseNum(e.target.value))} className="w-full bg-transparent focus:outline-none" /></div>
                              </div>
                              <div className="col-span-3 text-right">
                                <p className="text-[9px] text-[#f59e0b] uppercase tracking-[0.12em]" >Quantity</p>
                                <p className="text-sm font-semibold text-white" >{calcMat.procurementQty} <span className="text-[10px] text-white/50 font-normal">{mat.unit}</span></p>
                              </div>
                              <div className="col-span-2 text-right">
                                <p className="text-[9px] text-white/30 uppercase tracking-[0.12em]" >Amount</p>
                                <p className="text-sm font-medium" >₹{calcMat.amount.toLocaleString(undefined, {maximumFractionDigits:0})}</p>
                              </div>
                            </div>
                            
                            <button aria-label="Toggle Advanced Properties" onClick={() => toggleMaterialAdvanced(room.id, mat.id)} className={`p-1.5 transition-colors ${mat.isAdvancedOpen ? 'text-[#f59e0b] bg-amber-500/10' : 'text-white/30 hover:text-white'}`}>
                              <SlidersHorizontal size={14} />
                            </button>
                          </div>

                          {/* Progressive Disclosure: Advanced Settings */}
                          {mat.isAdvancedOpen && (
                            <div className="flex flex-col gap-4 p-4 border-t border-slate-800/50 bg-[#020617]">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              {(() => {
                                const isItem = ['Pieces', 'Nos', 'Set', 'Unit'].includes(mat.unit);
                                const isArea = ['Sq.ft', 'Rft', 'Sq.m'].includes(mat.unit);
                                const label = isItem ? 'QUANTITY' : (isArea ? 'MULTIPLIER' : 'COATS');
                                
                                return (
                                  <>
                                    <div>
                                      <label className="text-[9px] text-white/30 uppercase tracking-[0.12em] block mb-2" >{label}</label>
                                      <input aria-label={label} type="number" min={isItem ? "1" : "0"} step={isItem ? "1" : "any"} value={mat.coats} onChange={e => updateMaterial(room.id, mat.id, 'coats', e.target.value)} className="w-full bg-[#0f172a] border border-slate-800 p-2 text-xs focus:outline-none focus:border-[#f59e0b]/50 text-white transition-colors"  />
                                    </div>
                                    {!isItem && !isArea && (
                                      <div>
                                        <label className="text-[9px] text-white/30 uppercase tracking-[0.12em] block mb-2" >COVERAGE / {mat.unit.toUpperCase()}</label>
                                        <input aria-label="Coverage" type="number" min="0" value={mat.coverage} onChange={e => updateMaterial(room.id, mat.id, 'coverage', e.target.value)} className="w-full bg-[#0f172a] border border-slate-800 p-2 text-xs focus:outline-none focus:border-[#f59e0b]/50 text-white transition-colors"  />
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                              <div>
                                <label className="text-[9px] text-white/30 uppercase tracking-[0.12em] block mb-2" >UNIT TYPE</label>
                                <select aria-label="Unit Type" value={mat.unit} onChange={e => updateMaterial(room.id, mat.id, 'unit', e.target.value)} className="w-full bg-[#0f172a] border border-slate-800 p-2 text-xs focus:outline-none focus:border-[#f59e0b]/50 text-white transition-colors" >
                                  <option value="Sq.ft">Sq.ft</option>
                                  <option value="Liters">Liters</option>
                                  <option value="Kg">Kg</option>
                                  <option value="Bags">Bags</option>
                                  <option value="Pieces">Pieces</option>
                                  <option value="Nos">Nos</option>
                                  <option value="Rft">Rft</option>
                                  <option value="Set">Set</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[9px] text-white/30 uppercase tracking-[0.12em] block mb-2" >WASTAGE %</label>
                                <input aria-label="Wastage Percentage" type="number" min="0" value={mat.wastage} onChange={e => updateMaterial(room.id, mat.id, 'wastage', e.target.value)} className="w-full bg-[#0f172a] border border-slate-800 p-2 text-xs focus:outline-none focus:border-[#f59e0b]/50 text-white transition-colors"  />
                              </div>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                              <span className="text-[10px] text-emerald-400/80 font-mono">Exact Qty: {calcMat.finalQty.toFixed(2)}</span>
                              <input type="text" placeholder="Add custom notes..." aria-label="Material Notes" value={mat.notes} onChange={e => updateMaterial(room.id, mat.id, 'notes', e.target.value)} className="bg-transparent text-xs text-white/60 focus:text-white outline-none w-1/2 text-right"  />
                            </div>
                          </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
