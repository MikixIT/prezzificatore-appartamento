import type { EstimateBreakdownItem, RenovationInputs } from '../components/RenovationCalculator/types';

export const PRICES = {
  sqm: 130,
  bathroom: 4000,
  falseCeiling: 35,
  airConditioner: 400,
  doorFrame: 500,
  wallsDemolition: 650,
  wallConstruction: 1250,
  paintingRooms: 400,
  waterproofing: 50,
  electrical: 2000,
  plumbing: 1800,
  heating: 1800,
  gas: 400,
} as const;

function getEffectivePrices() {
  try {
    if (typeof localStorage === 'undefined') return PRICES;
    const raw = localStorage.getItem('prezzificatore-prices');
    if (!raw) return PRICES;
    const overrides = JSON.parse(raw);
    return { ...PRICES, ...overrides };
  } catch (e) {
    return PRICES;
  }
}

const FLOOR_SURCHARGE: Record<RenovationInputs['floorLevel'], number> = {
  0: 0,
  1: 0.05,
  2: 0.1,
  3: 0.12,
  4: 0.18,
  5: 0.2,
  6: 0.25,
};

export type PriceKey = keyof typeof PRICES;

const SYSTEM_LABELS = {
  electrical: 'Impianto elettrico',
  plumbing: 'Impianto idraulico',
  heating: 'Impianto di riscaldamento',
  gas: 'Impianto gas',
} as const;

export function calculateEstimateBreakdown(inputs: RenovationInputs): EstimateBreakdownItem[] {
  const {
    surface,
    bathrooms,
    falseCeiling,
    airConditioners,
    doorFrames,
    wallsDemolition,
    wallConstruction,
    paintingRooms,
    floorLevel,
    waterproofingEnabled,
    waterproofingArea,
    systems,
  } = inputs;

  const items: EstimateBreakdownItem[] = [];

  const prices = getEffectivePrices();
  const priceMap = prices as unknown as Record<string, number>;

  if (surface > 0) {
    items.push({
      id: 'surface',
      label: 'Superficie abitabile',
      detail: `${surface} m² × ${prices.sqm} €`,
      amount: surface * prices.sqm,
    });
  }

  if (bathrooms > 0) {
    items.push({
      id: 'bathrooms',
      label: 'Bagni',
      detail: `${bathrooms} × ${prices.bathroom} €`,
      amount: bathrooms * prices.bathroom,
    });
  }

  if (falseCeiling > 0) {
    items.push({
      id: 'falseCeiling',
      label: 'Controsoffitto',
      detail: `${falseCeiling} m² × ${prices.falseCeiling} €`,
      amount: falseCeiling * prices.falseCeiling,
    });
  }

  if (airConditioners > 0) {
    items.push({
      id: 'airConditioners',
      label: 'Condizionatori',
      detail: `${airConditioners} × ${prices.airConditioner} €`,
      amount: airConditioners * prices.airConditioner,
    });
  }

  if (doorFrames > 0) {
    items.push({
      id: 'doorFrames',
      label: 'Porte telai a scomparsa',
      detail: `${doorFrames} × ${prices.doorFrame} €`,
      amount: doorFrames * prices.doorFrame,
    });
  }

  if (wallsDemolition > 0) {
    items.push({
      id: 'wallsDemolition',
      label: 'Abbattimento muro',
      detail: `${wallsDemolition} × ${prices.wallsDemolition} €`,
      amount: wallsDemolition * prices.wallsDemolition,
    });
  }

  if (wallConstruction > 0) {
    items.push({
      id: 'wallConstruction',
      label: 'Costruzione muro',
      detail: `${wallConstruction} × ${prices.wallConstruction} €`,
      amount: wallConstruction * prices.wallConstruction,
    });
  }

  if (paintingRooms > 0) {
    items.push({
      id: 'paintingRooms',
      label: 'Tinteggiatura camera',
      detail: `${paintingRooms} × ${prices.paintingRooms} €`,
      amount: paintingRooms * prices.paintingRooms,
    });
  }

  if (waterproofingEnabled && waterproofingArea > 0) {
    items.push({
      id: 'waterproofing',
      label: 'Impermeabilizzazione guaina',
      detail: `${waterproofingArea} m² × ${prices.waterproofing} €`,
      amount: waterproofingArea * prices.waterproofing,
    });
  }

  (Object.keys(SYSTEM_LABELS) as (keyof typeof SYSTEM_LABELS)[]).forEach((key) => {
    if (systems[key]) {
      items.push({
        id: key,
        label: SYSTEM_LABELS[key],
        detail: `1 × ${priceMap[key]} €`,
        amount: priceMap[key],
      });
    }
  });

  const baseAmount = items.reduce((total, item) => total + item.amount, 0);
  const surchargeRate = FLOOR_SURCHARGE[floorLevel] ?? 0;

  if (baseAmount > 0 && surchargeRate > 0) {
    items.push({
      id: 'floorSurcharge',
      label: `Soprapprezzo piano ${floorLevel}`,
      detail: `${Math.round(surchargeRate * 100)}%`,
      amount: Math.round(baseAmount * surchargeRate),
    });
  }

  return items;
}

export function calculateEstimate(inputs: RenovationInputs): number {
  return calculateEstimateBreakdown(inputs).reduce((sum, item) => sum + item.amount, 0);
}
