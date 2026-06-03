import { describe, expect, it } from 'vitest';
import { calculateEstimate, calculateEstimateBreakdown, PRICES } from './calculateEstimate';

const baseInputs = {
  surface: 0,
  bathrooms: 0,
  falseCeiling: 0,
  airConditioners: 0,
  doorFrames: 0,
  wallsDemolition: 0,
  wallConstruction: 0,
  paintingRooms: 0,
  waterproofingEnabled: false,
  waterproofingArea: 0,
  systems: {
    electrical: false,
    plumbing: false,
    heating: false,
    gas: false,
  },
};

describe('calculateEstimate', () => {
  it('calculates total with default example values', () => {
    const inputs = {
      ...baseInputs,
      surface: 60,
      bathrooms: 2,
      falseCeiling: 60,
      airConditioners: 4,
      systems: {
        electrical: true,
        plumbing: true,
        heating: true,
        gas: true,
      },
    };

    const expected =
      60 * PRICES.sqm +
      2 * PRICES.bathroom +
      60 * PRICES.falseCeiling +
      4 * PRICES.airConditioner +
      PRICES.electrical +
      PRICES.plumbing +
      PRICES.heating +
      PRICES.gas;

    expect(calculateEstimate(inputs)).toBe(expected);
  });

  it('excludes unselected systems', () => {
    const total = calculateEstimate({
      ...baseInputs,
      systems: {
        electrical: true,
        plumbing: false,
        heating: false,
        gas: false,
      },
    });

    expect(total).toBe(PRICES.electrical);
  });

  it('adds waterproofing cost when enabled', () => {
    const total = calculateEstimate({
      ...baseInputs,
      waterproofingEnabled: true,
      waterproofingArea: 20,
    });

    expect(total).toBe(20 * PRICES.waterproofing);
  });

  it('adds door frame cost per piece', () => {
    const total = calculateEstimate({
      ...baseInputs,
      doorFrames: 3,
    });

    expect(total).toBe(3 * PRICES.doorFrame);
  });

  it('builds a breakdown that sums to the total', () => {
    const inputs = {
      ...baseInputs,
      surface: 60,
      bathrooms: 2,
      falseCeiling: 60,
      airConditioners: 4,
      doorFrames: 2,
      wallsDemolition: 1,
      wallConstruction: 1,
      paintingRooms: 3,
      waterproofingEnabled: true,
      waterproofingArea: 10,
      systems: {
        electrical: true,
        plumbing: true,
        heating: false,
        gas: false,
      },
    };

    const breakdown = calculateEstimateBreakdown(inputs);
    const sum = breakdown.reduce((acc, item) => acc + item.amount, 0);

    expect(sum).toBe(calculateEstimate(inputs));
    expect(breakdown).toHaveLength(11);
    expect(breakdown.find((item) => item.id === 'doorFrames')?.amount).toBe(
      2 * PRICES.doorFrame,
    );
    expect(breakdown.find((item) => item.id === 'waterproofing')?.amount).toBe(
      10 * PRICES.waterproofing,
    );
  });
});
