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

  if (surface > 0) {
    items.push({
      id: 'surface',
      label: 'Superficie abitabile',
      detail: `${surface} m² × ${PRICES.sqm} €`,
      amount: surface * PRICES.sqm,
    });
  }

  if (bathrooms > 0) {
    items.push({
      id: 'bathrooms',
      label: 'Bagni',
      detail: `${bathrooms} × ${PRICES.bathroom} €`,
      amount: bathrooms * PRICES.bathroom,
    });
  }

  if (falseCeiling > 0) {
    items.push({
      id: 'falseCeiling',
      label: 'Controsoffitto',
      detail: `${falseCeiling} m² × ${PRICES.falseCeiling} €`,
      amount: falseCeiling * PRICES.falseCeiling,
    });
  }

  if (airConditioners > 0) {
    items.push({
      id: 'airConditioners',
      label: 'Condizionatori',
      detail: `${airConditioners} × ${PRICES.airConditioner} €`,
      amount: airConditioners * PRICES.airConditioner,
    });
  }

  if (doorFrames > 0) {
    items.push({
      id: 'doorFrames',
      label: 'Porte telai a scomparsa',
      detail: `${doorFrames} × ${PRICES.doorFrame} €`,
      amount: doorFrames * PRICES.doorFrame,
    });
  }

  if (wallsDemolition > 0) {
    items.push({
      id: 'wallsDemolition',
      label: 'Abbattimento muro',
      detail: `${wallsDemolition} × ${PRICES.wallsDemolition} €`,
      amount: wallsDemolition * PRICES.wallsDemolition,
    });
  }

  if (wallConstruction > 0) {
    items.push({
      id: 'wallConstruction',
      label: 'Costruzione muro',
      detail: `${wallConstruction} × ${PRICES.wallConstruction} €`,
      amount: wallConstruction * PRICES.wallConstruction,
    });
  }

  if (paintingRooms > 0) {
    items.push({
      id: 'paintingRooms',
      label: 'Tinteggiatura camera',
      detail: `${paintingRooms} × ${PRICES.paintingRooms} €`,
      amount: paintingRooms * PRICES.paintingRooms,
    });
  }

  if (waterproofingEnabled && waterproofingArea > 0) {
    items.push({
      id: 'waterproofing',
      label: 'Impermeabilizzazione guaina',
      detail: `${waterproofingArea} m² × ${PRICES.waterproofing} €`,
      amount: waterproofingArea * PRICES.waterproofing,
    });
  }

  (Object.keys(SYSTEM_LABELS) as (keyof typeof SYSTEM_LABELS)[]).forEach((key) => {
    if (systems[key]) {
      items.push({
        id: key,
        label: SYSTEM_LABELS[key],
        detail: `1 × ${PRICES[key]} €`,
        amount: PRICES[key],
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
