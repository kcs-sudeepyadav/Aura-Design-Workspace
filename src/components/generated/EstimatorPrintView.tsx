import React from 'react';

export const EstimatorPrintView: React.FC<{ engine: any }> = ({ engine }) => {
  const { state } = engine;
  const { 
    clientName, projectName, roomCalculations, shoppingList, 
    totalNetArea, laborCost, consumablesCost, subtotal, 
    profitAmount, discountAmount, discountType, gstEnabled,
    cgstAmount, sgstAmount, cgstRate, sgstRate, finalProjectCost
  } = state;

  const shoppingPaints = shoppingList.filter((s:any) => s.category === 'Interior Painting' && s.name.includes('Paint') || s.category === 'Exterior Painting' && s.name.includes('Emulsion'));
  const shoppingPrimers = shoppingList.filter((s:any) => s.name.includes('Primer'));
  const shoppingPutty = shoppingList.filter((s:any) => s.name.includes('Putty'));
  const shoppingOthers = shoppingList.filter((s:any) => !shoppingPaints.includes(s) && !shoppingPrimers.includes(s) && !shoppingPutty.includes(s));

  return (
    <div className="hidden print:block p-8 bg-white text-black max-w-4xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-light tracking-tight mb-2" >Aura : A Design Studio Workspace</h1>
          <p className="text-sm text-gray-500 uppercase tracking-widest">Professional Estimation Proposal</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium">Date: {new Date().toLocaleDateString()}</p>
          <p className="text-sm text-gray-600 mt-1">Ref: {Date.now().toString().slice(-6)}</p>
        </div>
      </div>

      {/* Client Info */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Prepared For</p>
          <p className="text-lg font-medium">{clientName || 'Valued Client'}</p>
          <p className="text-sm text-gray-600">{projectName || 'Interior Works Project'}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Prepared By</p>
          <p className="text-lg font-medium">Aura Costing Engine</p>
          <p className="text-sm text-gray-600">Total Net Area: {totalNetArea.toFixed(0)} sqft</p>
        </div>
      </div>

      {/* Room Breakdown Summary */}
      <h3 className="text-lg font-medium border-b border-gray-200 pb-2 mb-4">Area & Cost Breakdown by Room</h3>
      <table className="w-full text-sm mb-12">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left py-2 px-3">Room</th>
            <th className="text-right py-2 px-3">Net Area</th>
            <th className="text-right py-2 px-3">Material Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {roomCalculations.map((r: any) => (
            <tr key={r.id}>
              <td className="py-2 px-3 font-medium">{r.name}</td>
              <td className="text-right py-2 px-3 text-gray-600">{r.netArea} sqft</td>
              <td className="text-right py-2 px-3">₹{r.roomMaterialCost.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Procurement Schedule */}
      <h3 className="text-lg font-medium border-b border-gray-200 pb-2 mb-4">Procurement Schedule</h3>
      <table className="w-full text-sm mb-12">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left py-2 px-3">Item Description</th>
            <th className="text-right py-2 px-3">Category</th>
            <th className="text-right py-2 px-3">Quantity Req.</th>
            <th className="text-right py-2 px-3">Total Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {/* Group 1: Paints */}
          {shoppingPaints.length > 0 && <tr className="bg-gray-50/50"><td colSpan={4} className="py-1 px-3 text-xs font-bold uppercase text-gray-500">Paints & Finishes</td></tr>}
          {shoppingPaints.map((s:any, i:number) => (
            <tr key={`p-${i}`}>
              <td className="py-2 px-3 font-medium">{s.name}</td>
              <td className="text-right py-2 px-3 text-gray-500 text-xs">{s.category}</td>
              <td className="text-right py-2 px-3">{s.procurementQty} {s.unit}</td>
              <td className="text-right py-2 px-3">₹{s.amount.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
            </tr>
          ))}
          
          {/* Group 2: Primers */}
          {shoppingPrimers.length > 0 && <tr className="bg-gray-50/50"><td colSpan={4} className="py-1 px-3 text-xs font-bold uppercase text-gray-500 mt-2">Primers</td></tr>}
          {shoppingPrimers.map((s:any, i:number) => (
            <tr key={`pr-${i}`}>
              <td className="py-2 px-3 font-medium">{s.name}</td>
              <td className="text-right py-2 px-3 text-gray-500 text-xs">{s.category}</td>
              <td className="text-right py-2 px-3">{s.procurementQty} {s.unit}</td>
              <td className="text-right py-2 px-3">₹{s.amount.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
            </tr>
          ))}

          {/* Group 3: Putty */}
          {shoppingPutty.length > 0 && <tr className="bg-gray-50/50"><td colSpan={4} className="py-1 px-3 text-xs font-bold uppercase text-gray-500 mt-2">Putty & Prep</td></tr>}
          {shoppingPutty.map((s:any, i:number) => (
            <tr key={`pu-${i}`}>
              <td className="py-2 px-3 font-medium">{s.name}</td>
              <td className="text-right py-2 px-3 text-gray-500 text-xs">{s.category}</td>
              <td className="text-right py-2 px-3">{s.procurementQty} {s.unit}</td>
              <td className="text-right py-2 px-3">₹{s.amount.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
            </tr>
          ))}

          {/* Group 4: Others */}
          {shoppingOthers.length > 0 && <tr className="bg-gray-50/50"><td colSpan={4} className="py-1 px-3 text-xs font-bold uppercase text-gray-500 mt-2">Other Materials</td></tr>}
          {shoppingOthers.map((s:any, i:number) => (
            <tr key={`po-${i}`}>
              <td className="py-2 px-3 font-medium">{s.name}</td>
              <td className="text-right py-2 px-3 text-gray-500 text-xs">{s.category}</td>
              <td className="text-right py-2 px-3">{s.procurementQty} {s.unit}</td>
              <td className="text-right py-2 px-3">₹{s.amount.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Commercial Summary */}
      <div className="flex justify-end">
        <div className="w-80">
          <h3 className="text-lg font-medium border-b border-gray-200 pb-2 mb-4">Financial Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Execution & Labor</span><span>₹{laborCost.toLocaleString(undefined, {maximumFractionDigits:0})}</span></div>
            <div className="flex justify-between"><span>Consumables & Allowances</span><span>₹{consumablesCost.toLocaleString(undefined, {maximumFractionDigits:0})}</span></div>
            
            <div className="flex justify-between font-medium pt-2 mt-2 border-t border-gray-100"><span>Subtotal</span><span>₹{subtotal.toLocaleString(undefined, {maximumFractionDigits:0})}</span></div>
            
            <div className="flex justify-between text-gray-600"><span>Commercial Margin</span><span>+ ₹{profitAmount.toLocaleString(undefined, {maximumFractionDigits:0})}</span></div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-gray-600"><span>Discount {discountType === 'percent' ? '(%)' : ''}</span><span>- ₹{discountAmount.toLocaleString(undefined, {maximumFractionDigits:0})}</span></div>
            )}
            
            {gstEnabled && (
              <>
                <div className="flex justify-between text-gray-600"><span>CGST ({cgstRate}%)</span><span>+ ₹{cgstAmount.toLocaleString(undefined, {maximumFractionDigits:0})}</span></div>
                <div className="flex justify-between text-gray-600"><span>SGST ({sgstRate}%)</span><span>+ ₹{sgstAmount.toLocaleString(undefined, {maximumFractionDigits:0})}</span></div>
              </>
            )}
            
            <div className="flex justify-between text-lg font-bold pt-4 mt-2 border-t-2 border-black">
              <span>Grand Total</span>
              <span>₹{finalProjectCost.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
