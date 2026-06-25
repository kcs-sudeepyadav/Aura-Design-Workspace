import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3001/api';

export function useApiData(resource: string) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('aura_token');
      if (!token) throw new Error('No authentication token found');

      const res = await fetch(`${API_BASE}/${resource}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error(`Failed to fetch ${resource}`);
      
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
      
      const MOCK_VERSION = '1782220719867'; // Bump to guarantee wipe
      const currentVersion = localStorage.getItem('aura_mock_version');
      
      if (currentVersion !== MOCK_VERSION) {
        // Bulletproof cache clearing
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('aura_mock_')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        localStorage.setItem('aura_mock_version', MOCK_VERSION);
      } else {
        const cached = localStorage.getItem(`aura_mock_${resource}`);
        if (cached) {
          setData(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }

      let initialMockData: any[] = [];
      
      // Provide robust mock data for prototype offline mode
      if (resource === 'conversations') {
        initialMockData = [
          { id: 'conv-1', projectId: 'p-1', type: 'GROUP', title: 'Main Project Thread', participants: ['admin-1', 'm-1', 'c-1'], lastActivity: new Date().toISOString() },
          { id: 'conv-2', projectId: 'p-1', type: '1-ON-1', title: 'Direct Message', participants: ['admin-1', 'c-1'], lastActivity: new Date().toISOString() }
        ];
      } else if (resource === 'messages') {
        initialMockData = [
          { id: 'msg-1', conversationId: 'conv-1', senderId: 'm-1', content: 'Welcome to the project thread! Let us know if you have any questions about the timeline.', timestamp: new Date(Date.now() - 86400000).toISOString(), readBy: [{userId: 'c-1', timestamp: new Date().toISOString()}] },
          { id: 'msg-2', conversationId: 'conv-1', senderId: 'c-1', content: 'Looks great! Can we discuss the materials?', timestamp: new Date(Date.now() - 3600000).toISOString(), readBy: [] }
        ];
            } else if (resource === 'users') {
        initialMockData = [
          { id: 'admin-1', role: 'admin', name: 'Admin User', avatar: 'https://i.pravatar.cc/150?u=admin' },
          { id: 'm-1', role: 'manager', name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/150?u=priya' },
          { id: 'm-2', role: 'manager', name: 'Aryan Bose', avatar: 'https://i.pravatar.cc/150?u=aryan' },
          { id: 'u-mgr-1', role: 'manager', name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/150?u=priya' },
          { id: 'u-mgr-2', role: 'manager', name: 'Aryan Bose', avatar: 'https://i.pravatar.cc/150?u=aryan' },
          { id: 'u-mgr-3', role: 'manager', name: 'Leila Nouri', avatar: 'https://i.pravatar.cc/150?u=leila' },
          { id: 'c-1', role: 'client', name: 'Ananya Mehta', avatar: 'https://i.pravatar.cc/150?u=ananya' },
          { id: 'c-2', role: 'client', name: 'Rohan Kapoor', avatar: 'https://i.pravatar.cc/150?u=rohan' },
          { id: 'u-3', role: 'client', name: 'Sara Johansson', avatar: 'https://i.pravatar.cc/150?u=sara' },
          { id: 'u-4', role: 'client', name: 'Meera Nair', avatar: 'https://i.pravatar.cc/150?u=meera' },
          { id: 'u-5', role: 'client', name: 'Dev Anand', avatar: 'https://i.pravatar.cc/150?u=dev' },
          { id: 'u-6', role: 'client', name: 'Vikram Singh', avatar: 'https://i.pravatar.cc/150?u=vikram' }
        ];
      } else if (resource === 'projects') {
        initialMockData = [
          {
            id: 'p-1',
            name: 'The Penthouse Residency',
            clientId: 'c-1',
            client: 'Ananya Mehta',
            managerId: 'm-1',
            manager: 'Priya Sharma',
            phase: 'Execution',
            health: 'green',
            budget: '₹2.8 Cr',
            completion: 58,
            startDate: 'Jan 10, 2026',
            endDate: 'Jul 30, 2026'
          },
          {
            id: 'p-2',
            name: 'Meridian Office Tower',
            clientId: 'c-2',
            client: 'Rohan Kapoor',
            managerId: 'm-2',
            manager: 'Aryan Bose',
            phase: 'Design Dev',
            health: 'amber',
            budget: '₹6.5 Cr',
            completion: 35,
            startDate: 'Feb 1, 2026',
            endDate: 'Dec 31, 2026'
          },
          {
            id: 'p-3',
            name: 'Villa Serenity',
            clientId: 'u-3',
            client: 'Sara Johansson',
            managerId: 'u-mgr-3',
            manager: 'Leila Nouri',
            phase: 'Procurement',
            health: 'green',
            budget: '₹1.9 Cr',
            completion: 45,
            startDate: 'Mar 1, 2026',
            endDate: 'Oct 15, 2026'
          },
          {
            id: 'p-4',
            name: 'The Onyx Apartment',
            clientId: 'u-4',
            client: 'Meera Nair',
            managerId: 'u-mgr-1',
            manager: 'Priya Sharma',
            phase: 'Discovery',
            health: 'red',
            budget: '₹80 L',
            completion: 12,
            startDate: 'Apr 15, 2026',
            endDate: 'Sep 30, 2026'
          },
          {
            id: 'p-5',
            name: 'Studio 14 Co-working',
            clientId: 'u-5',
            client: 'Dev Anand',
            managerId: 'u-mgr-2',
            manager: 'Aryan Bose',
            phase: 'Concept',
            health: 'green',
            budget: '₹1.2 Cr',
            completion: 20,
            startDate: 'May 1, 2026',
            endDate: 'Nov 30, 2026'
          },
          {
            id: 'p-6',
            name: 'Lakeside Mansion',
            clientId: 'u-6',
            client: 'Vikram Singh',
            managerId: 'u-mgr-3',
            manager: 'Leila Nouri',
            phase: 'Handover',
            health: 'green',
            budget: '₹8.5 Cr',
            completion: 95,
            startDate: 'Jan 10, 2025',
            endDate: 'Jun 15, 2026'
          }
        ];
} else if (resource === 'tasks') {
        initialMockData = [{
          id: 't-1', label: 'Flooring inspection – Level 3 master bedroom', done: true, assignee: 'Suresh M.', due: 'May 16'
        }, {
          id: 't-2', label: 'Electrical first-fix completion sign-off', done: true, assignee: 'Suresh M.', due: 'May 15'
        }, {
          id: 't-3', label: 'Upload site photos – Week 13', done: false, assignee: 'Raj V.', due: 'May 17'
        }];
      } else if (resource === 'issues') {
        initialMockData = [{
          id: 'iss-1', title: 'HVAC ducting clash with false ceiling layout in living room', priority: 'high', status: 'open', date: 'May 10', assignee: 'Arjun K.'
        }, {
          id: 'iss-2', title: 'Delay in Italian marble shipment from supplier', priority: 'medium', status: 'in-progress', date: 'May 8', assignee: 'Suresh M.'
        }];
      } else if (resource === 'documents') {
        initialMockData = [
          { id: 'd-1', name: 'Master Bedroom Elevation.pdf', type: 'DWG', date: 'May 10, 2026', size: '4.2 MB', projectId: 'p-1' },
          { id: 'd-2', name: 'Lighting Schedule Rev 2.xlsx', type: 'XLS', date: 'May 8, 2026', size: '1.1 MB', projectId: 'p-1' },
          { id: 'd-3', name: 'Living Room Chair 3D Render.glb', type: '3D', date: 'May 12, 2026', size: '2.5 MB', projectId: 'p-1', url: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/SheenChair/glTF-Binary/SheenChair.glb' },
          { id: 'd-4', name: 'Exterior Landscape Planter.glb', type: '3D', date: 'May 13, 2026', size: '1.8 MB', projectId: 'p-1', url: 'https://modelviewer.dev/shared-assets/models/GeoPlanter.glb' }
        ];
      } else if (resource === 'approvals') {
        initialMockData = [{
          id: 'a-1', title: 'Master Bedroom Flooring Material', type: 'Material', due: '2026-05-18', description: 'Please approve the Calacatta Gold marble sample for the master bedroom flooring.', status: 'pending', imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80'
        }];
      } else if (resource === 'sitelogs') {
        initialMockData = [{
          id: 'sl-1', date: '2026-05-16', title: 'Weekly Progress Review', summary: 'Flooring in master bedroom is progressing well. Electrical first-fix is complete.', crew: 12, progress: 58, photos: JSON.stringify(['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80'])
        }];
      } else if (resource === 'invoices') {
        initialMockData = [{
          id: 'inv-1',
          label: 'Advance Payment - Design & Planning',
          ref: 'INV-2026-001',
          due: 'May 05, 2026',
          amount: '₹3,50,000',
          status: 'paid',
          projectId: 'p-1'
        }, {
          id: 'inv-2',
          label: 'Material Procurement - Flooring',
          ref: 'INV-2026-002',
          due: 'May 20, 2026',
          amount: '₹12,00,000',
          status: 'pending',
          projectId: 'p-1'
        }, {
          id: 'inv-3',
          label: 'Consultancy Fees',
          ref: 'INV-2026-003',
          due: 'April 30, 2026',
          amount: '₹1,50,000',
          status: 'overdue',
          projectId: 'p-1'
        }];
      } else if (resource === 'siteupdates') {
        initialMockData = [{
          id: 'su-1',
          date: 'May 16, 2026',
          title: 'Master Bedroom Flooring Progress',
          description: 'Calacatta Gold marble installation is 80% complete in the master bedroom. The bookmatched layout is looking exceptional. Minor edge-trim work remains.',
          phase: 'Execution Phase 1',
          photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80'],
          reportedBy: 'Suresh Menon'
        }, {
          id: 'su-2',
          date: 'May 14, 2026',
          title: 'Kitchen Cabinetry Installed',
          description: 'The handleless kitchen cabinetry in Grigio Chiaro finish has been installed. Countertop templating scheduled for May 18. Hardware fitting in progress.',
          phase: 'Execution Phase 1',
          photos: ['https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80'],
          reportedBy: 'Priya Sharma'
        }, {
          id: 'su-3',
          date: 'May 10, 2026',
          title: 'Electrical First Fix Complete',
          description: 'All electrical conduits and wiring for the entire floor plan have been signed off by the site inspector. Smart home wiring is routed and labeled.',
          phase: 'Execution Phase 1',
          photos: [],
          reportedBy: 'Suresh Menon'
        }, {
          id: 'su-4',
          date: 'May 5, 2026',
          title: 'Partition Walls & Plastering',
          description: 'Structural partitions in all bedrooms are complete. Plaster has been applied and is curing. Paint prep begins next week after quality check.',
          phase: 'Execution Phase 1',
          photos: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80'],
          reportedBy: 'Raj Verma'
        }];
      }
      
      setData(initialMockData);
      localStorage.setItem(`aura_mock_${resource}`, JSON.stringify(initialMockData));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [resource]);

  const createItem = async (payload: any) => {
    try {
      const token = localStorage.getItem('aura_token');
      const res = await fetch(`${API_BASE}/${resource}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newItem = await res.json();
        setData(prev => [...prev, newItem]);
        return newItem;
      }
      throw new Error('Create failed');
    } catch (e) {
      // Mock fallback
      console.warn(`[Prototype Mode] Mocking createItem for ${resource}`);
      const newItem = { ...payload, id: payload.id || `${resource}-${Date.now()}` };
      
      const cachedStr = localStorage.getItem(`aura_mock_${resource}`);
      const currentData = cachedStr ? JSON.parse(cachedStr) : data;
      const nextData = [...currentData, newItem];
      
      localStorage.setItem(`aura_mock_${resource}`, JSON.stringify(nextData));
      setData(nextData);
      return newItem;
    }
  };

  const updateItem = async (id: string, payload: any) => {
    try {
      const token = localStorage.getItem('aura_token');
      const res = await fetch(`${API_BASE}/${resource}/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updatedItem = await res.json();
        setData(prev => prev.map(item => item.id === id ? updatedItem : item));
        return updatedItem;
      }
      throw new Error('Update failed');
    } catch (e) {
      // Mock fallback
      console.warn(`[Prototype Mode] Mocking updateItem for ${resource}`);
      const updatedItem = { ...payload, id };
      
      const cachedStr = localStorage.getItem(`aura_mock_${resource}`);
      const currentData = cachedStr ? JSON.parse(cachedStr) : data;
      const nextData = currentData.map((item: any) => item.id === id ? { ...item, ...payload } : item);
      
      localStorage.setItem(`aura_mock_${resource}`, JSON.stringify(nextData));
      setData(nextData);
      return updatedItem;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const token = localStorage.getItem('aura_token');
      const res = await fetch(`${API_BASE}/${resource}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setData(prev => prev.filter(item => item.id !== id));
        return;
      }
      throw new Error('Delete failed');
    } catch (e) {
      // Mock fallback
      console.warn(`[Prototype Mode] Mocking deleteItem for ${resource}`);
      
      const cachedStr = localStorage.getItem(`aura_mock_${resource}`);
      const currentData = cachedStr ? JSON.parse(cachedStr) : data;
      const nextData = currentData.filter((item: any) => item.id !== id);
      
      localStorage.setItem(`aura_mock_${resource}`, JSON.stringify(nextData));
      setData(nextData);
      return;
    }
  };

  return { data, loading, error, createItem, updateItem, deleteItem, refetch: fetchData, setData };
}

