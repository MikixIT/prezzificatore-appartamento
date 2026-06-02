import type { EstimateBreakdownItem, RenovationInputs } from '../components/RenovationCalculator/types';

export const PRICES = {
  sqm: 180,
  bathroom: 5000,
  falseCeiling: 35,
  airConditioner: 550,
  waterproofing: 50,
  electrical: 1800,
  plumbing: 900,
  heating: 800,
  gas: 420,
} as const;

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

  return items;
}

export function calculateEstimate(inputs: RenovationInputs): number {
  return calculateEstimateBreakdown(inputs).reduce((sum, item) => sum + item.amount, 0);
}
