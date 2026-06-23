export const INITIAL_CONFIG = {
  paintCoverage: 180,
  primerCoverage: 120,
  puttyCoverage: 40,
  economyPaintPrice: 150,
  premiumPaintPrice: 350,
  luxuryPaintPrice: 650,
  puttyPrice: 25,
  primerPrice: 140,
  defaultWastage: 10,
  consumablesPercentage: 5,
};

export const MATERIAL_CATEGORIES = [
  'Interior Painting', 'Exterior Painting', 'Waterproofing', 'Flooring', 
  'False Ceiling', 'Wall Finishes', 'Decorative Finishes', 'Wood Finishes', 
  'Metal Finishes', 'Furniture', 'Lighting', 'Electricals', 'Plumbing', 'Custom'
];

export const MATERIAL_LIBRARY: Record<string, any[]> = {
  'Interior Painting': [
    { name: 'Economy Interior Paint', unit: 'Liters', coverage: 180, rate: 150 },
    { name: 'Premium Interior Paint', unit: 'Liters', coverage: 180, rate: 350 },
    { name: 'Luxury Interior Paint', unit: 'Liters', coverage: 180, rate: 650 },
    { name: 'Wall Primer', unit: 'Liters', coverage: 120, rate: 140 },
    { name: 'White Putty', unit: 'Kg', coverage: 40, rate: 25 },
  ],
  'False Ceiling': [
    { name: 'Gypsum Board', unit: 'Sq.ft', coverage: 0, rate: 75 },
    { name: 'POP', unit: 'Bags', coverage: 20, rate: 150 },
    { name: 'Ceiling Channels', unit: 'Rft', coverage: 0, rate: 30 },
  ],
  'Flooring': [
    { name: 'Vitrified Tiles', unit: 'Sq.ft', coverage: 0, rate: 60 },
    { name: 'Marble', unit: 'Sq.ft', coverage: 0, rate: 250 },
    { name: 'Tile Adhesive', unit: 'Bags', coverage: 50, rate: 450 },
  ],
  'Wood Finishes': [
    { name: 'Melamine Polish', unit: 'Liters', coverage: 80, rate: 350 },
    { name: 'PU Polish', unit: 'Liters', coverage: 60, rate: 550 },
    { name: 'Laminate', unit: 'Sq.ft', coverage: 0, rate: 120 }
  ],
  'Exterior Painting': [
    { name: 'Exterior Emulsion', unit: 'Liters', coverage: 120, rate: 250 },
    { name: 'Exterior Primer', unit: 'Liters', coverage: 100, rate: 160 },
  ],
  'Waterproofing': [
    { name: 'Acrylic Waterproofing', unit: 'Liters', coverage: 40, rate: 300 },
    { name: 'Cementitious Waterproofing', unit: 'Kg', coverage: 15, rate: 80 },
  ],
  'Wall Finishes': [
    { name: 'Wallpaper', unit: 'Sq.ft', coverage: 0, rate: 80 },
    { name: 'Wall Paneling', unit: 'Sq.ft', coverage: 0, rate: 250 },
  ],
  'Decorative Finishes': [
    { name: 'Texture Paint', unit: 'Sq.ft', coverage: 0, rate: 120 },
    { name: 'Stucco', unit: 'Sq.ft', coverage: 0, rate: 150 },
  ],
  'Metal Finishes': [
    { name: 'Enamel Paint', unit: 'Liters', coverage: 100, rate: 250 },
    { name: 'Metal Primer', unit: 'Liters', coverage: 120, rate: 180 },
  ],
  'Furniture': [
    { name: 'Sofa Set (3 Seater)', unit: 'Pieces', coverage: 0, rate: 15000 },
    { name: 'Dining Table', unit: 'Pieces', coverage: 0, rate: 25000 },
    { name: 'King Size Bed', unit: 'Pieces', coverage: 0, rate: 35000 },
    { name: 'Wardrobe', unit: 'Pieces', coverage: 0, rate: 45000 },
    { name: 'Office Chair', unit: 'Pieces', coverage: 0, rate: 5000 }
  ],
  'Lighting': [
    { name: 'Chandelier', unit: 'Pieces', coverage: 0, rate: 8000 },
    { name: 'LED Spotlight', unit: 'Pieces', coverage: 0, rate: 450 },
    { name: 'Profile Light', unit: 'Rft', coverage: 0, rate: 350 },
    { name: 'Pendant Light', unit: 'Pieces', coverage: 0, rate: 2500 }
  ],
  'Electricals': [
    { name: 'Switchboard', unit: 'Pieces', coverage: 0, rate: 800 },
    { name: 'Wiring Bundles', unit: 'Nos', coverage: 0, rate: 1200 },
    { name: 'MCB Box', unit: 'Pieces', coverage: 0, rate: 2500 },
    { name: 'Fan', unit: 'Pieces', coverage: 0, rate: 2200 }
  ],
  'Plumbing': [
    { name: 'Wash Basin', unit: 'Pieces', coverage: 0, rate: 3500 },
    { name: 'Commode', unit: 'Pieces', coverage: 0, rate: 8500 },
    { name: 'Faucets', unit: 'Pieces', coverage: 0, rate: 1500 },
    { name: 'Shower Panel', unit: 'Pieces', coverage: 0, rate: 6500 }
  ]
};

export type Opening = { 
  id: string; 
  type: 'Door' | 'Window' | 'Custom'; 
  width: string; 
  height: string; 
  qty: string; 
};

export type SelectedMaterial = { 
  id: string; 
  category: string; 
  name: string; 
  unit: string; 
  coverage: number; 
  rate: number; 
  wastage: number; 
  coats: number; 
  notes: string; 
  isAdvancedOpen?: boolean; 
};

export type Room = { 
  id: string; 
  name: string; 
  length: string; 
  width: string; 
  height: string; 
  includeCeiling: boolean; 
  openings: Opening[]; 
  materials: SelectedMaterial[]; 
  isExpanded: boolean; 
};

export type EstimateVersion = {
  id: string; 
  name: string; 
  timestamp: number;
  rooms: Room[]; 
  laborType: 'lumpsum' | 'sqft'; 
  laborRate: string; 
  laborLumpSum: string;
  profitMargin: string; 
  gstEnabled: boolean; 
  discountType: 'flat' | 'percent'; 
  discountValue: string;
  config: typeof INITIAL_CONFIG; 
  clientName: string; 
  projectName: string; 
  paintQuality: 'Economy' | 'Premium' | 'Luxury';
  cgstRate?: string;
  sgstRate?: string;
};

export type CalculatedMaterial = SelectedMaterial & {
  baseQty: number;
  wastageQty: number;
  finalQty: number;
  procurementQty: number;
  amount: number;
};

export type CalculatedRoom = Room & {
  wallArea: number;
  ceilingArea: number;
  grossArea: number;
  totalDeductionArea: number;
  netArea: number;
  deductionWarning: boolean;
  materialsCalc: CalculatedMaterial[];
  roomMaterialCost: number;
  roomLaborCost: number;
};
