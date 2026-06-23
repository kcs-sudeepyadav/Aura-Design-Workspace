import React, { useState } from 'react';
import { PlusCircle, IndianRupee, Clock } from 'lucide-react';
import { toast } from 'sonner';

export const AdminBillingView = ({ invoices, createInvoice, adminUsers = [], projects = [] }: any) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ref: '', amount: '', date: '', clientId: '', projectId: '' });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await createInvoice(form);
      setOpen(false);
      toast.success('Invoice issued successfully');
      setForm({ ref: '', amount: '', date: '', clientId: '', projectId: '' });
    } catch (e) {
      toast.error('Failed to issue invoice');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-semibold" >
          Billing & Invoices
        </h2>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-[#f59e0b] text-[#020617] px-4 py-2 text-xs font-semibold hover:bg-[#fbbf24] transition-colors shadow-sm" >
          <PlusCircle size={14} /> Issue Invoice
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0f172a] border border-amber-500/10 p-5">
          <IndianRupee size={18} className="text-[#f59e0b]" />
          <p className="text-white text-3xl font-light" >₹13.2 Cr</p>
          <p className="text-white/40 text-xs mt-0.5" >Total Revenue</p>
        </div>
        <div className="bg-[#0f172a] border border-amber-500/10 p-5">
          <Clock size={18} className="text-amber-400" />
          <p className="text-white text-3xl font-light" >2</p>
          <p className="text-white/40 text-xs mt-0.5" >Pending Invoices</p>
        </div>
      </div>

      <div className="bg-[#0f172a] border border-amber-500/10 p-5 mt-5">
        <h3 className="text-white font-semibold mb-4" >All Invoices</h3>
        <div className="space-y-2">
          {(invoices || []).map((inv: any) => (
            <div key={inv.id} className="flex items-center justify-between bg-[#020617] border border-amber-500/10 p-3 hover:border-amber-500/20 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 ${inv.status === 'paid' ? 'bg-emerald-400' : 'bg-[#f59e0b]'}`} />
                <div>
                  <p className="text-white text-sm font-medium flex items-center gap-2" >
                    {inv.ref}
                    <span className="text-white/40 font-normal">
                      · {adminUsers.find((u: any) => u.id === inv.clientId)?.name || 'Unknown Client'}
                      {inv.projectId && ` · ${projects.find((p: any) => p.id === inv.projectId)?.name || 'Unknown Project'}`}
                    </span>
                  </p>
                  <p className="text-white/30 text-xs" >{inv.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <div>
                  <p className="text-white/50 text-xs" >{inv.status === 'paid' ? 'Paid' : 'Pending'}</p>
                  <p className="text-white text-xs" >{inv.amount}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="bg-[#0f172a] border border-amber-500/10 w-full max-w-md p-6 relative">
            <h3 className="text-white font-semibold mb-5" >Issue New Invoice</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >Assign Client</label>
                <select required value={form.clientId} onChange={e => setForm({...form, clientId: e.target.value, projectId: ''})} className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors" >
                  <option value="" disabled>Select a Client</option>
                  {adminUsers.filter((u: any) => u.role === 'Client').map((client: any) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >Assign Project</label>
                <select required value={form.projectId} onChange={e => setForm({...form, projectId: e.target.value})} disabled={!form.clientId} className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors disabled:opacity-50" >
                  <option value="" disabled>Select a Project</option>
                  {projects.filter((p: any) => p.clientId === form.clientId).map((project: any) => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >Reference (e.g. INV-2026-001)</label>
                <input required type="text" value={form.ref} onChange={e => setForm({...form, ref: e.target.value})} className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors placeholder:text-white/20"  />
              </div>
              <div>
                <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >Amount</label>
                <input required type="text" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="e.g. ₹5,00,000" className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors placeholder:text-white/20"  />
              </div>
              <div>
                <label className="text-[10px] text-white/35 tracking-[0.12em] uppercase block mb-2" >Due Date</label>
                <input required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} onClick={(e) => { try { (e.target as HTMLInputElement).showPicker(); } catch(err){} }} className="w-full bg-[#020617] border border-slate-800 text-white px-4 py-2.5 text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors placeholder:text-white/20 [color-scheme:dark]"  />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <button type="submit" className="bg-[#f59e0b] text-[#020617] px-6 py-2.5 text-xs font-semibold hover:bg-[#fbbf24] transition-colors shadow-sm" >Issue</button>
                <button type="button" onClick={() => setOpen(false)} className="px-6 py-2.5 text-xs border border-slate-800 text-white/40 hover:text-white/70 transition-colors" >Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
