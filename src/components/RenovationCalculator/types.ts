export interface RenovationSystems {
  electrical: boolean;
  plumbing: boolean;
  heating: boolean;
  gas: boolean;
}

export interface RenovationInputs {
  surface: number;
  bathrooms: number;
  falseCeiling: number;
  airConditioners: number;
  doorFrames: number;
  waterproofingEnabled: boolean;
  waterproofingArea: number;
  systems: RenovationSystems;
}

export interface RenovationCalculatorState extends RenovationInputs {}

export interface EstimateBreakdownItem {
  id: string;
  label: string;
  detail: string;
  amount: number;
}
