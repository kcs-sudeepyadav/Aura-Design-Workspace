import React, { useState } from 'react';
import { toast } from 'sonner';
import { Truck, Search, PlusCircle, Filter, PackageOpen, ClipboardCheck, AlertTriangle, ArrowRight, PackageSearch, RefreshCw } from 'lucide-react';
import { Project } from './HubPages';

interface AdminProcurementViewProps {
  projects: Project[];
}

interface Vendor {
  id: string;
  name: string;
  category: 'Furniture' | 'Lighting' | 'Materials' | 'Contractor';
  rating: number;
  contact: string;
}

interface PO {
  id: string;
  vendorId: string;
  projectId: string;
  item: string;
  amount: string;
  status: 'draft' | 'ordered' | 'shipped' | 'delivered' | 'delayed';
  eta: string;
}

const mockVendors: Vendor[] = [
  { id: 'v-1', name: 'Lumina Lighting', category: 'Lighting', rating: 4.8, contact: 'sales@lumina.com' },
  { id: 'v-2', name: 'Milan Imports', category: 'Furniture', rating: 4.5, contact: 'orders@milan.it' },
  { id: 'v-3', name: 'Stones & Co', category: 'Materials', rating: 4.9, contact: 'marble@stonesco.com' },
  { id: 'v-4', name: 'Apex Build', category: 'Contractor', rating: 4.2, contact: 'pm@apexbuild.com' }
];

const mockPOs: PO[] = [
  { id: 'PO-2026-041', vendorId: 'v-3', projectId: 'p-1', item: 'Calacatta Marble Slabs (x12)', amount: '₹12,50,000', status: 'ordered', eta: 'May 20' },
  { id: 'PO-2026-042', vendorId: 'v-1', projectId: 'p-1', item: 'Dining Pendants (x3)', amount: '₹85,000', status: 'shipped', eta: 'May 14' },
  { id: 'PO-2026-043', vendorId: 'v-2', projectId: 'p-2', item: 'Lounge Sofa Custom', amount: '₹3,20,000', status: 'delayed', eta: 'Jun 05 (Revised)' },
  { id: 'PO-2026-044', vendorId: 'v-4', projectId: 'p-3', item: 'Demolition Services', amount: '₹1,50,000', status: 'delivered', eta: 'May 02' },
  { id: 'PO-2026-045', vendorId: 'v-1', projectId: 'p-1', item: 'Recessed Downlights (x40)', amount: '₹40,000', status: 'draft', eta: 'TBD' }
];

export const AdminProcurementView: React.FC<AdminProcurementViewProps> = ({ projects }) => {
  const [pos, setPos] = useState<PO[]>(mockPOs);
  const [activeTab, setActiveTab] = useState<'pos' | 'vendors'>('pos');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [generatePOOpen, setGeneratePOOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PO | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [newVendorOpen, setNewVendorOpen] = useState(false);

  const statusColors = {
    draft: 'text-white/40 border-white/10',
    ordered: 'text-blue-400 border-blue-400/30',
    shipped: 'text-[#f59e0b] border-[#f59e0b]/30',
    delivered: 'text-emerald-400 border-emerald-400/30',
    delayed: 'text-red-400 border-red-400/30'
  };

  const filteredPOs = pos.filter(po => {
    const matchesSearch = po.item.toLowerCase().includes(searchTerm.toLowerCase()) || po.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const displayProjects = projects && projects.length > 0 ? projects : [
    { id: 'p-1', name: 'Aura HQ Redesign', clientName: 'Aura Inc.', status: 'active', managerId: 'm-1' },
    { id: 'p-2', name: 'Apex Tower Lobby', clientName: 'Apex Build', status: 'active', managerId: 'm-1' },
    { id: 'p-3', name: 'Milan Residency', clientName: 'Milan Imports', status: 'active', managerId: 'm-2' }
  ];

  return (
    <div className="h-full overflow-y-auto">
      {/* Header */}
      <div className="p-8 border-b border-amber-500/10 flex justify-between items-end bg-[#0f172a] sticky top-0 z-10">
        <div>
          <p className="text-[#f59e0b] text-[10px] tracking-[0.2em] uppercase mb-2 font-semibold" >
            Supply Chain
          </p>
          <h1 className="text-3xl text-white font-light" >
            Vendor Procurement
          </h1>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('pos')} className={`text-sm font-semibold tracking-wide transition-colors pb-1 ${activeTab === 'pos' ? 'text-[#f59e0b] border-b-2 border-[#f59e0b]' : 'text-white/40 hover:text-white'}`} >
            Purchase Orders
          </button>
          <button onClick={() => setActiveTab('vendors')} className={`text-sm font-semibold tracking-wide transition-colors pb-1 ${activeTab === 'vendors' ? 'text-[#f59e0b] border-b-2 border-[#f59e0b]' : 'text-white/40 hover:text-white'}`} >
            Vendor Database
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0f172a] p-5 border border-amber-500/10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-white/40 text-xs tracking-wider uppercase font-semibold" >Active POs</span>
              <PackageSearch size={14} className="text-[#f59e0b]" />
            </div>
            <p className="text-3xl text-white font-light" >12</p>
          </div>
          <div className="bg-[#0f172a] p-5 border border-amber-500/10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-white/40 text-xs tracking-wider uppercase font-semibold" >In Transit</span>
              <Truck size={14} className="text-[#f59e0b]" />
            </div>
            <p className="text-3xl text-white font-light" >4</p>
          </div>
          <div className="bg-[#0f172a] p-5 border border-amber-500/10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-white/40 text-xs tracking-wider uppercase font-semibold" >Delayed</span>
              <AlertTriangle size={14} className="text-red-400" />
            </div>
            <p className="text-3xl text-white font-light" >1</p>
          </div>
          <div className="bg-[#0f172a] p-5 border border-amber-500/10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-white/40 text-xs tracking-wider uppercase font-semibold" >Total Spend (MTD)</span>
              <ClipboardCheck size={14} className="text-[#f59e0b]" />
            </div>
            <p className="text-3xl text-white font-light" >₹18.5M</p>
          </div>
        </div>

        {activeTab === 'pos' && (
          <div className="bg-[#0f172a] border border-amber-500/10">
            <div className="p-5 border-b border-amber-500/10 flex justify-between items-center bg-[#020617]/50">
              <div className="relative w-64">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search POs or Items..." 
                  className="w-full bg-[#0f172a] border border-slate-800 text-white pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#f59e0b]/40 placeholder:text-white/20"
                  
                />
              </div>
              <div className="flex gap-3 relative">
                <button onClick={() => setFilterOpen(!filterOpen)} className="flex items-center gap-2 px-4 py-2 text-xs border border-slate-800 text-white/60 hover:text-white hover:border-white/20 transition-colors" >
                  <Filter size={13} /> Filter
                </button>
                {filterOpen && (
                  <div className="absolute top-full right-32 mt-2 w-48 bg-[#0f172a] border border-amber-500/20 shadow-2xl z-20 rounded-sm">
                    <div className="p-3 border-b border-white/5">
                      <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold" >Filter by Status</span>
                    </div>
                    <div className="p-2 flex flex-col">
                      {['all', 'ordered', 'shipped', 'delivered', 'delayed', 'draft'].map(s => (
                        <button key={s} onClick={() => { setStatusFilter(s); setFilterOpen(false); }} className={`text-left px-3 py-2 text-xs hover:text-[#f59e0b] hover:bg-white/5 transition-colors uppercase tracking-wide ${statusFilter === s ? 'text-[#f59e0b] font-bold' : 'text-white/60'}`} >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={() => setGeneratePOOpen(true)} className="flex items-center gap-2 bg-[#f59e0b] text-[#020617] px-4 py-2 text-xs font-semibold hover:bg-[#fbbf24] transition-colors shadow-sm" >
                  <PlusCircle size={13} /> Generate PO
                </button>
              </div>
            </div>

            <table className="w-full text-left border-collapse" >
              <thead>
                <tr className="border-b border-amber-500/10 text-[10px] uppercase tracking-wider text-white/40">
                  <th className="p-4 font-semibold">PO Number</th>
                  <th className="p-4 font-semibold">Item & Vendor</th>
                  <th className="p-4 font-semibold">Project</th>
                  <th className="p-4 font-semibold">Amount</th>
                  <th className="p-4 font-semibold">Status & ETA</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPOs.map(po => {
                  const vendor = mockVendors.find(v => v.id === po.vendorId);
                  const project = displayProjects.find(p => p.id === po.projectId);
                  return (
                    <tr key={po.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4 text-sm text-white font-medium">{po.id}</td>
                      <td className="p-4">
                        <p className="text-sm text-white mb-0.5">{po.item}</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-wide">{vendor?.name}</p>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white/60 text-[10px]">{project?.name || 'Unknown'}</span>
                      </td>
                      <td className="p-4 text-sm text-white/80">{po.amount}</td>
                      <td className="p-4">
                        <div className="flex flex-col items-start gap-1">
                          <span className={`px-2 py-0.5 border text-[10px] uppercase tracking-wider font-semibold ${statusColors[po.status]}`}>
                            {po.status}
                          </span>
                          <span className="text-xs text-white/30">{po.eta}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => setSelectedPO(po)} className="text-white/20 hover:text-[#f59e0b] transition-colors p-2 group-hover:bg-[#f59e0b]/10 rounded">
                          <ArrowRight size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {mockVendors.map(vendor => (
              <div key={vendor.id} className="bg-[#0f172a] border border-amber-500/10 p-5 group hover:border-[#f59e0b]/30 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-medium mb-1" >{vendor.name}</h3>
                    <p className="text-xs text-white/40 uppercase tracking-wide" >{vendor.category}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-[#f59e0b]/10 px-2 py-1 rounded">
                    <span className="text-[#f59e0b] text-xs font-bold">{vendor.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/30 mb-5" >
                  <span>{vendor.contact}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedVendor(vendor)} className="flex-1 px-3 py-2 text-[10px] uppercase tracking-wider font-semibold border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors" >
                    View Profile
                  </button>
                  <button onClick={() => setGeneratePOOpen(true)} className="flex-1 px-3 py-2 text-[10px] uppercase tracking-wider font-semibold bg-[#f59e0b] text-[#020617] hover:bg-[#fbbf24] transition-colors" >
                    Create PO
                  </button>
                </div>
              </div>
            ))}
            <button onClick={() => setNewVendorOpen(true)} className="bg-[#0f172a] border border-dashed border-white/20 p-5 flex flex-col items-center justify-center gap-3 hover:border-[#f59e0b]/40 hover:bg-[#020617] transition-colors group">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#f59e0b]/10 group-hover:text-[#f59e0b] text-white/40 transition-colors">
                <PlusCircle size={20} />
              </div>
              <span className="text-sm font-medium text-white/60 group-hover:text-white transition-colors" >Add New Vendor</span>
            </button>
          </div>
        )}
      </div>

      {/* New Vendor Side Panel */}
      {newVendorOpen && (
        <>
          <div className="fixed inset-0 bg-[#020617]/60 backdrop-blur-sm z-40" onClick={() => setNewVendorOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-[400px] bg-[#0f172a] border-l border-[#f59e0b]/20 z-50 shadow-2xl flex flex-col transform transition-transform duration-300">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#020617]">
              <div>
                <h2 className="text-xl text-white font-light" >Add New Vendor</h2>
                <p className="text-xs text-white/40 uppercase tracking-wide mt-1" >Expand Supply Chain</p>
              </div>
              <button onClick={() => setNewVendorOpen(false)} className="text-white/40 hover:text-white transition-colors p-2 bg-white/5 rounded">
                <RefreshCw size={16} className="rotate-45" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold block mb-2" >Vendor Name</label>
                <input type="text" className="w-full bg-[#020617] border border-slate-800 text-white p-3 text-sm focus:outline-none focus:border-[#f59e0b]/40" placeholder="e.g. Italian Marbles Ltd." />
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold block mb-2" >Category</label>
                <select className="w-full bg-[#020617] border border-slate-800 text-white p-3 text-sm focus:outline-none focus:border-[#f59e0b]/40">
                  <option value="Furniture">Furniture</option>
                  <option value="Lighting">Lighting</option>
                  <option value="Materials">Materials</option>
                  <option value="Contractor">Contractor</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold block mb-2" >Contact Email</label>
                <input type="email" className="w-full bg-[#020617] border border-slate-800 text-white p-3 text-sm focus:outline-none focus:border-[#f59e0b]/40" placeholder="sales@vendor.com" />
              </div>
            </div>
            <div className="p-6 border-t border-white/5 bg-[#020617] flex justify-end gap-3">
              <button onClick={() => setNewVendorOpen(false)} className="px-5 py-2.5 text-xs font-semibold text-white/60 border border-slate-800 hover:text-white hover:bg-white/5 transition-colors" >Cancel</button>
              <button onClick={() => setNewVendorOpen(false)} className="px-5 py-2.5 text-xs font-semibold bg-[#f59e0b] text-[#020617] hover:bg-[#fbbf24] transition-colors" >Add Vendor</button>
            </div>
          </div>
        </>
      )}

      {/* Vendor Profile Panel */}
      {selectedVendor && (
        <>
          <div className="fixed inset-0 bg-[#020617]/60 backdrop-blur-sm z-40" onClick={() => setSelectedVendor(null)}></div>
          <div className="fixed top-0 right-0 h-full w-[400px] bg-[#0f172a] border-l border-[#f59e0b]/20 z-50 shadow-2xl flex flex-col transform transition-transform duration-300">
            <div className="p-6 border-b border-white/5 bg-[#020617]">
              <div className="flex justify-between items-start mb-4">
                <span className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider border border-white/10 text-white/40 bg-white/5">{selectedVendor.category}</span>
                <button onClick={() => setSelectedVendor(null)} className="text-white/40 hover:text-white transition-colors">Close</button>
              </div>
              <h2 className="text-2xl text-white font-light mb-1" >{selectedVendor.name}</h2>
              <p className="text-[#f59e0b] text-sm font-semibold flex items-center gap-1" >★ {selectedVendor.rating} Rating</p>
            </div>
            <div className="p-6 space-y-6 flex-1">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-1" >Contact Information</p>
                <p className="text-white text-sm" >{selectedVendor.contact}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-2" >Recent Performance</p>
                <div className="space-y-3">
                  <div className="bg-[#020617] p-3 border border-white/5">
                    <p className="text-xs text-white/60 mb-1" >On-Time Delivery Rate</p>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div className="bg-[#020617] p-3 border border-white/5">
                    <p className="text-xs text-white/60 mb-1" >Quality Acceptance</p>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#f59e0b] h-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/5 bg-[#020617] flex gap-3">
              <button onClick={() => toast.info('Edit Vendor Details functionality coming soon!')} className="flex-1 py-3 text-xs font-semibold border border-slate-800 text-white/60 hover:text-white hover:bg-white/5 transition-colors" >Edit Details</button>
              <button onClick={() => { setSelectedVendor(null); setGeneratePOOpen(true); }} className="flex-1 py-3 text-xs font-semibold bg-[#f59e0b] text-[#020617] hover:bg-[#fbbf24] transition-colors" >Create PO</button>
            </div>
          </div>
        </>
      )}

      {/* Generate PO Side Panel */}
      {generatePOOpen && (
        <>
          <div className="fixed inset-0 bg-[#020617]/60 backdrop-blur-sm z-40" onClick={() => setGeneratePOOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-[500px] bg-[#0f172a] border-l border-[#f59e0b]/20 z-50 shadow-2xl flex flex-col transform transition-transform duration-300">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#020617]">
              <div>
                <h2 className="text-xl text-white font-light" >Generate Purchase Order</h2>
                <p className="text-xs text-white/40 uppercase tracking-wide mt-1" >New Procurement Entry</p>
              </div>
              <button onClick={() => setGeneratePOOpen(false)} className="text-white/40 hover:text-white transition-colors p-2 bg-white/5 rounded">
                <RefreshCw size={16} className="rotate-45" /> {/* Using RefreshCw as X placeholder since X isn't imported, wait, I can just use text 'X' or import X */}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold block mb-2" >Select Vendor</label>
                <select className="w-full bg-[#020617] border border-slate-800 text-white p-3 text-sm focus:outline-none focus:border-[#f59e0b]/40">
                  <option value="">Select a vendor...</option>
                  {mockVendors.map(v => <option key={v.id} value={v.id}>{v.name} ({v.category})</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold block mb-2" >Assign Project</label>
                <select className="w-full bg-[#020617] border border-slate-800 text-white p-3 text-sm focus:outline-none focus:border-[#f59e0b]/40">
                  <option value="">Select a project...</option>
                  {displayProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold block mb-2" >Item Description</label>
                <textarea rows={3} className="w-full bg-[#020617] border border-slate-800 text-white p-3 text-sm focus:outline-none focus:border-[#f59e0b]/40" placeholder="E.g. Custom Lounge Sofa (Velvet, Navy Blue)"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold block mb-2" >Total Amount (₹)</label>
                  <input type="number" min="0" step="0.01" className="w-full bg-[#020617] border border-slate-800 text-white p-3 text-sm focus:outline-none focus:border-[#f59e0b]/40" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-[10px] text-white/40 uppercase tracking-wider font-semibold block mb-2" >Expected ETA</label>
                  <input type="date" className="w-full bg-[#020617] border border-slate-800 text-white/60 p-3 text-sm focus:outline-none focus:border-[#f59e0b]/40" style={{ colorScheme: 'dark' }} />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/5 bg-[#020617] flex justify-end gap-3">
              <button onClick={() => setGeneratePOOpen(false)} className="px-5 py-2.5 text-xs font-semibold text-white/60 border border-slate-800 hover:text-white hover:bg-white/5 transition-colors" >Cancel</button>
              <button onClick={() => setGeneratePOOpen(false)} className="px-5 py-2.5 text-xs font-semibold bg-[#f59e0b] text-[#020617] hover:bg-[#fbbf24] transition-colors" >Generate & Send PO</button>
            </div>
          </div>
        </>
      )}

      {/* PO Details Panel */}
      {selectedPO && (
        <>
          <div className="fixed inset-0 bg-[#020617]/60 backdrop-blur-sm z-40" onClick={() => setSelectedPO(null)}></div>
          <div className="fixed top-0 right-0 h-full w-[400px] bg-[#0f172a] border-l border-[#f59e0b]/20 z-50 shadow-2xl flex flex-col transform transition-transform duration-300">
            <div className="p-6 border-b border-white/5 bg-[#020617]">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider border ${statusColors[selectedPO.status]}`}>{selectedPO.status}</span>
                <button onClick={() => setSelectedPO(null)} className="text-white/40 hover:text-white transition-colors">Close</button>
              </div>
              <h2 className="text-2xl text-white font-light mb-1" >{selectedPO.id}</h2>
              <p className="text-white/60 text-sm" >{selectedPO.item}</p>
            </div>
            <div className="p-6 space-y-6 flex-1">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-1" >Vendor</p>
                <p className="text-white text-sm" >{mockVendors.find(v => v.id === selectedPO.vendorId)?.name}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-1" >Amount</p>
                <p className="text-[#f59e0b] text-xl font-light">{selectedPO.amount}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-1" >Timeline</p>
                <div className="relative border-l border-white/10 ml-2 mt-3 space-y-4">
                  <div className="pl-4 relative">
                    <div className="absolute w-2 h-2 bg-[#f59e0b] rounded-full -left-[5px] top-1"></div>
                    <p className="text-xs text-white/60">PO Generated</p>
                  </div>
                  <div className="pl-4 relative">
                    <div className={`absolute w-2 h-2 rounded-full -left-[5px] top-1 ${selectedPO.status !== 'draft' ? 'bg-[#f59e0b]' : 'bg-white/10'}`}></div>
                    <p className={`text-xs ${selectedPO.status !== 'draft' ? 'text-white/60' : 'text-white/30'}`}>Order Confirmed</p>
                  </div>
                  <div className="pl-4 relative">
                    <div className={`absolute w-2 h-2 rounded-full -left-[5px] top-1 ${(selectedPO.status === 'shipped' || selectedPO.status === 'delivered') ? 'bg-[#f59e0b]' : 'bg-white/10'}`}></div>
                    <p className={`text-xs ${(selectedPO.status === 'shipped' || selectedPO.status === 'delivered') ? 'text-white/60' : 'text-white/30'}`}>Shipped</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/5 bg-[#020617] flex gap-3">
              <button onClick={() => {
                const nextStatus: Record<string, PO['status']> = {
                  'draft': 'ordered',
                  'ordered': 'shipped',
                  'shipped': 'delivered',
                  'delayed': 'shipped',
                  'delivered': 'delivered'
                };
                const newStatus = nextStatus[selectedPO.status];
                setPos(pos.map(p => p.id === selectedPO.id ? { ...p, status: newStatus } : p));
                setSelectedPO({ ...selectedPO, status: newStatus });
                toast.success(`Status updated to ${newStatus}`);
              }} className="flex-1 py-3 text-xs font-semibold border border-slate-800 text-white/60 hover:text-white hover:bg-white/5 transition-colors" >Update Status</button>
              
              <button onClick={() => {
                setPos(pos.map(p => p.id === selectedPO.id ? { ...p, status: 'delivered' } : p));
                setSelectedPO({ ...selectedPO, status: 'delivered' });
                toast.success('Goods received successfully!');
                setTimeout(() => setSelectedPO(null), 1000);
              }} className="flex-1 py-3 text-xs font-semibold bg-[#f59e0b] text-[#020617] hover:bg-[#fbbf24] transition-colors flex items-center justify-center gap-2" ><PackageOpen size={14}/> Receive Goods</button>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
