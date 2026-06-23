import { useState, useMemo, useEffect } from 'react';
import { 
  INITIAL_CONFIG, MATERIAL_LIBRARY, 
  Room, EstimateVersion, Opening, SelectedMaterial, 
  CalculatedRoom, CalculatedMaterial 
} from './EstimatorTypes';

export const parseNum = (val: string | number, min = 0) => Math.max(min, Number(val) || 0);

const STORAGE_KEY = 'aura_estimator_state';

export const useEstimatorEngine = () => {
  // --- STATE ---
  const [config, setConfig] = useState(INITIAL_CONFIG);
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  
  const [rooms, setRooms] = useState<Room[]>([{
    id: `room-${Date.now()}`, name: 'Living Room', length: '', width: '', height: '', includeCeiling: true, openings: [], materials: [], isExpanded: true
  }]);

  const [paintQuality, setPaintQuality] = useState<'Economy' | 'Premium' | 'Luxury'>('Premium');
  const [laborType, setLaborType] = useState<'lumpsum' | 'sqft'>('sqft');
  const [laborRate, setLaborRate] = useState<string>('45');
  const [laborLumpSum, setLaborLumpSum] = useState<string>('');
  
  const [profitMargin, setProfitMargin] = useState<string>('15');
  const [gstEnabled, setGstEnabled] = useState(true);
  const [cgstRate, setCgstRate] = useState<string>('9');
  const [sgstRate, setSgstRate] = useState<string>('9');
  
  const [discountType, setDiscountType] = useState<'flat' | 'percent'>('flat');
  const [discountValue, setDiscountValue] = useState<string>('');

  const [versions, setVersions] = useState<EstimateVersion[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);

  const [isLoaded, setIsLoaded] = useState(false);

  // --- PERSISTENCE ---
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.versions) setVersions(parsed.versions);
        if (parsed.currentVersionId) {
          const v = parsed.versions.find((x: EstimateVersion) => x.id === parsed.currentVersionId);
          if (v) {
            setCurrentVersionId(v.id); setRooms(v.rooms); setLaborType(v.laborType); setLaborRate(v.laborRate); setLaborLumpSum(v.laborLumpSum);
            setProfitMargin(v.profitMargin); setGstEnabled(v.gstEnabled); setDiscountType(v.discountType); setDiscountValue(v.discountValue);
            setConfig(v.config); setClientName(v.clientName); setProjectName(v.projectName); setPaintQuality(v.paintQuality);
            if(v.cgstRate) setCgstRate(v.cgstRate);
            if(v.sgstRate) setSgstRate(v.sgstRate);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load estimator state', e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ versions, currentVersionId }));
    } catch (e) {
      console.error('Failed to save estimator state', e);
    }
  }, [versions, currentVersionId, isLoaded]);


  // --- ENGINE ---
  const roomCalculations = useMemo((): CalculatedRoom[] => {
    return rooms.map(room => {
      const l = parseNum(room.length); const w = parseNum(room.width); const h = parseNum(room.height);
      const wallArea = (l + w) * 2 * h;
      const ceilingArea = room.includeCeiling ? (l * w) : 0;
      const grossArea = wallArea + ceilingArea;

      const totalDeductionArea = room.openings.reduce((acc, curr) => acc + (parseNum(curr.width) * parseNum(curr.height) * parseNum(curr.qty)), 0);
      const netAreaRaw = grossArea - totalDeductionArea;
      const netArea = Math.max(0, netAreaRaw);
      const deductionWarning = totalDeductionArea > grossArea;

      const floorArea = parseNum(room.length) * parseNum(room.width);
      const ceilingAreaRaw = parseNum(room.length) * parseNum(room.width);
      
      const materialsCalc: CalculatedMaterial[] = room.materials.map(mat => {
        const isItem = ['Pieces', 'Nos', 'Set', 'Unit'].includes(mat.unit);
        let baseQty = 0;
        let effectiveArea = 0;

        if (isItem) {
          // Absolute quantity (ignores room dimensions)
          baseQty = parseNum(mat.coats, 1);
        } else {
          // Determine correct surface area
          let surfaceArea = netArea;
          if (mat.category === 'Flooring') surfaceArea = floorArea;
          else if (mat.category === 'False Ceiling') surfaceArea = ceilingAreaRaw;

          effectiveArea = surfaceArea * parseNum(mat.coats, 1);
          
          if (mat.coverage > 0) {
            baseQty = effectiveArea / mat.coverage;
          } else {
            baseQty = effectiveArea;
          }
        }

        const safeWastage = parseNum(mat.wastage);
        const wastageQty = baseQty * (safeWastage / 100);
        const finalQty = baseQty + wastageQty;
        
        const isFractionalUnit = ['Liters', 'L', 'Kg', 'Bags', 'Gallons'].includes(mat.unit);
        const procurementQty = (isFractionalUnit || isItem) ? Math.ceil(finalQty) : finalQty;

        const amount = procurementQty * parseNum(mat.rate);
        return { ...mat, baseQty, wastageQty, finalQty, procurementQty, amount };
      });

      const roomMaterialCost = materialsCalc.reduce((acc, curr) => acc + curr.amount, 0);
      const roomLaborCost = laborType === 'sqft' ? (netArea * parseNum(laborRate)) : 0;

      return {
        ...room, wallArea, ceilingArea, grossArea, totalDeductionArea, netArea, deductionWarning, materialsCalc, roomMaterialCost, roomLaborCost
      };
    });
  }, [rooms, laborType, laborRate]);

  // Aggregations
  const totalWallArea = roomCalculations.reduce((acc, r) => acc + r.wallArea, 0);
  const totalCeilingArea = roomCalculations.reduce((acc, r) => acc + r.ceilingArea, 0);
  const totalNetArea = roomCalculations.reduce((acc, r) => acc + r.netArea, 0);
  const totalMaterialCost = roomCalculations.reduce((acc, r) => acc + r.roomMaterialCost, 0);
  
  const laborCost = laborType === 'sqft' ? (totalNetArea * parseNum(laborRate)) : parseNum(laborLumpSum);
  const consumablesCost = (totalMaterialCost + laborCost) * (parseNum(config.consumablesPercentage) / 100);
  const subtotal = totalMaterialCost + laborCost + consumablesCost;
  
  const profitAmount = subtotal * (parseNum(profitMargin) / 100);
  
  let safeDiscountValue = parseNum(discountValue);
  if (discountType === 'percent' && safeDiscountValue > 100) safeDiscountValue = 100;
  const discountAmount = discountType === 'percent' ? (subtotal * (safeDiscountValue / 100)) : safeDiscountValue;
  
  const totalBeforeTax = Math.max(0, subtotal + profitAmount - discountAmount);
  
  const cgstAmount = gstEnabled ? (totalBeforeTax * (parseNum(cgstRate) / 100)) : 0;
  const sgstAmount = gstEnabled ? (totalBeforeTax * (parseNum(sgstRate) / 100)) : 0;
  const finalProjectCost = totalBeforeTax + cgstAmount + sgstAmount;

  // Shopping List
  const shoppingList = useMemo(() => {
    const list: CalculatedMaterial[] = [];
    roomCalculations.forEach(r => {
      r.materialsCalc.forEach(m => {
        const existing = list.find(l => l.name === m.name && l.rate === m.rate);
        if (existing) {
          existing.procurementQty += m.procurementQty;
          existing.amount += m.amount;
        } else {
          list.push({ ...m });
        }
      });
    });
    return list;
  }, [roomCalculations]);

  const hasNegativeDimensions = rooms.some(r => Number(r.length) < 0 || Number(r.width) < 0 || Number(r.height) < 0 || r.openings.some(o => Number(o.width) < 0 || Number(o.height) < 0));

  // --- HANDLERS ---
  const addRoom = () => setRooms(prev => [...prev.map(r => ({ ...r, isExpanded: false })), { id: `room-${Date.now()}`, name: `Room ${prev.length + 1}`, length: '', width: '', height: '', includeCeiling: true, openings: [], materials: [], isExpanded: true }]);
  const removeRoom = (id: string) => setRooms(prev => prev.filter(r => r.id !== id));
  const toggleRoom = (id: string) => setRooms(prev => prev.map(r => r.id === id ? { ...r, isExpanded: !r.isExpanded } : r));
  const updateRoom = (id: string, field: keyof Room, value: any) => setRooms(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

  const addOpening = (roomId: string) => updateRoom(roomId, 'openings', [...rooms.find(r => r.id === roomId)!.openings, { id: `op-${Date.now()}`, type: 'Door', width: '', height: '', qty: '1' }]);
  const updateOpening = (roomId: string, opId: string, field: keyof Opening, value: string) => setRooms(prev => prev.map(r => r.id === roomId ? { ...r, openings: r.openings.map(o => o.id === opId ? { ...o, [field]: value } : o) } : r));
  const removeOpening = (roomId: string, opId: string) => setRooms(prev => prev.map(r => r.id === roomId ? { ...r, openings: r.openings.filter(o => o.id !== opId) } : r));

  const addMaterial = (roomId: string, category: string, predefinedName?: string) => {
    let defName = `New ${category} Item`; let defUnit = 'Sq.ft'; let defCov = 0; let defRate = 150;
    
    if (predefinedName && MATERIAL_LIBRARY[category]) {
      const libItem = MATERIAL_LIBRARY[category].find(i => i.name === predefinedName);
      if (libItem) {
        defName = libItem.name; defUnit = libItem.unit; defCov = libItem.coverage; defRate = libItem.rate;
      }
    } else if (category === 'Custom') {
      defName = 'Custom Material';
    }

    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, materials: [...r.materials, {
      id: `mat-${Date.now()}`, category, name: defName, unit: defUnit, coverage: defCov, rate: defRate, wastage: config.defaultWastage, coats: 1, notes: '', isAdvancedOpen: false
    }]} : r));
  };

  const updateMaterial = (roomId: string, matId: string, field: keyof SelectedMaterial, value: any) => setRooms(prev => prev.map(r => r.id === roomId ? { ...r, materials: r.materials.map(m => m.id === matId ? { ...m, [field]: value } : m) } : r));
  const removeMaterial = (roomId: string, matId: string) => setRooms(prev => prev.map(r => r.id === roomId ? { ...r, materials: r.materials.filter(m => m.id !== matId) } : r));
  const toggleMaterialAdvanced = (roomId: string, matId: string) => setRooms(prev => prev.map(r => r.id === roomId ? { ...r, materials: r.materials.map(m => m.id === matId ? { ...m, isAdvancedOpen: !m.isAdvancedOpen } : m) } : r));

  const applyDefaultPaint = (roomId: string, selectedQuality: 'Economy' | 'Premium' | 'Luxury') => {
    let paintRate = config.premiumPaintPrice; let paintName = 'Premium Interior Paint';
    if (selectedQuality === 'Economy') { paintRate = config.economyPaintPrice; paintName = 'Economy Interior Paint'; }
    else if (selectedQuality === 'Luxury') { paintRate = config.luxuryPaintPrice; paintName = 'Luxury Interior Paint'; }

    const mats: SelectedMaterial[] = [
      { id: `mat-${Date.now()}-3`, category: 'Interior Painting', name: 'White Putty', unit: 'Kg', coverage: config.puttyCoverage, rate: config.puttyPrice, wastage: config.defaultWastage, coats: 2, notes: '', isAdvancedOpen: false },
      { id: `mat-${Date.now()}-2`, category: 'Interior Painting', name: 'Wall Primer', unit: 'Liters', coverage: config.primerCoverage, rate: config.primerPrice, wastage: config.defaultWastage, coats: 1, notes: '', isAdvancedOpen: false },
      { id: `mat-${Date.now()}-1`, category: 'Interior Painting', name: paintName, unit: 'Liters', coverage: config.paintCoverage, rate: paintRate, wastage: config.defaultWastage, coats: 2, notes: '', isAdvancedOpen: false }
    ];
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, materials: [...r.materials, ...mats] } : r));
  };

  const cascadePricing = () => {
    setRooms(prev => prev.map(r => ({
      ...r,
      materials: r.materials.map(m => {
        let newRate = m.rate;
        let newCov = m.coverage;
        if (m.name.includes('Economy Interior Paint')) { newRate = config.economyPaintPrice; newCov = config.paintCoverage; }
        else if (m.name.includes('Premium Interior Paint')) { newRate = config.premiumPaintPrice; newCov = config.paintCoverage; }
        else if (m.name.includes('Luxury Interior Paint')) { newRate = config.luxuryPaintPrice; newCov = config.paintCoverage; }
        else if (m.name.includes('Wall Primer')) { newRate = config.primerPrice; newCov = config.primerCoverage; }
        else if (m.name.includes('White Putty')) { newRate = config.puttyPrice; newCov = config.puttyCoverage; }
        return { ...m, rate: newRate, coverage: newCov };
      })
    })));
  };

  // VERSIONING
  const buildCurrentVersionObj = (): EstimateVersion & { cgstRate: string, sgstRate: string } => ({
    id: currentVersionId || `v-${Date.now()}`, name: `Estimate Version ${versions.length + 1}`, timestamp: Date.now(),
    rooms, laborType, laborRate, laborLumpSum, profitMargin, gstEnabled, discountType, discountValue, config, clientName, projectName, paintQuality, cgstRate, sgstRate
  });

  const saveVersion = () => {
    const newV = buildCurrentVersionObj();
    setVersions(prev => currentVersionId ? prev.map(v => v.id === currentVersionId ? newV : v) : [...prev, newV]);
    setCurrentVersionId(newV.id);
  };

  const loadVersion = (id: string) => {
    const v = versions.find(x => x.id === id) as any;
    if (!v) return;
    setCurrentVersionId(v.id); setRooms(v.rooms); setLaborType(v.laborType); setLaborRate(v.laborRate); setLaborLumpSum(v.laborLumpSum);
    setProfitMargin(v.profitMargin); setGstEnabled(v.gstEnabled); setDiscountType(v.discountType); setDiscountValue(v.discountValue);
    setConfig(v.config); setClientName(v.clientName); setProjectName(v.projectName); setPaintQuality(v.paintQuality);
    if(v.cgstRate) setCgstRate(v.cgstRate);
    if(v.sgstRate) setSgstRate(v.sgstRate);
  };

  const duplicateVersion = () => {
    const v = buildCurrentVersionObj();
    v.id = `v-${Date.now()}`; v.name = `${v.name} (Copy)`;
    setVersions(prev => [...prev, v]);
    setCurrentVersionId(v.id);
  };
  
  const updateVersionName = (id: string, newName: string) => {
    setVersions(prev => prev.map(v => v.id === id ? { ...v, name: newName } : v));
  };

  const deleteVersion = (id: string) => {
    setVersions(prev => prev.filter(v => v.id !== id));
    if (currentVersionId === id) setCurrentVersionId(null);
  };
  
  const resetWorkspace = () => {
      setCurrentVersionId(null);
      setRooms([{ id: `room-${Date.now()}`, name: 'Living Room', length: '', width: '', height: '', includeCeiling: true, openings: [], materials: [], isExpanded: true }]);
      setClientName('');
      setProjectName('');
  };

  return {
    state: {
      config, clientName, projectName, rooms, paintQuality, laborType, laborRate, laborLumpSum,
      profitMargin, gstEnabled, discountType, discountValue, versions, currentVersionId,
      roomCalculations, totalWallArea, totalCeilingArea, totalNetArea, totalMaterialCost, laborCost,
      consumablesCost, subtotal, profitAmount, discountAmount, totalBeforeTax,
      cgstRate, sgstRate, cgstAmount, sgstAmount, finalProjectCost, shoppingList, hasNegativeDimensions
    },
    actions: {
      setConfig, setClientName, setProjectName, setPaintQuality, setLaborType, setLaborRate, setLaborLumpSum,
      setProfitMargin, setGstEnabled, setDiscountType, setDiscountValue, setCgstRate, setSgstRate,
      addRoom, removeRoom, toggleRoom, updateRoom,
      addOpening, updateOpening, removeOpening,
      addMaterial, updateMaterial, removeMaterial, toggleMaterialAdvanced, applyDefaultPaint, cascadePricing,
      saveVersion, loadVersion, duplicateVersion, resetWorkspace, updateVersionName, deleteVersion
    }
  };
};
