import { describe, expect, it } from 'vitest';
import { calculateEstimate, calculateEstimateBreakdown, PRICES } from './calculateEstimate';

describe('calculateEstimate', () => {
  it('calculates the example total of €25,420', () => {
    const total = calculateEstimate({
      surface: 60,
      bathrooms: 2,
      falseCeiling: 60,
      airConditioners: 4,
      waterproofingEnabled: false,
      waterproofingArea: 0,
      systems: {
        electrical: true,
        plumbing: true,
        heating: true,
        gas: true,
      },
    });

    expect(total).toBe(25420);
  });

  it('excludes unselected systems', () => {
    const total = calculateEstimate({
      surface: 0,
      bathrooms: 0,
      falseCeiling: 0,
      airConditioners: 0,
      waterproofingEnabled: false,
      waterproofingArea: 0,
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
      surface: 0,
      bathrooms: 0,
      falseCeiling: 0,
      airConditioners: 0,
      waterproofingEnabled: true,
      waterproofingArea: 20,
      systems: {
        electrical: false,
        plumbing: false,
        heating: false,
        gas: false,
      },
    });

    expect(total).toBe(20 * PRICES.waterproofing);
  });

  it('builds a breakdown that sums to the total', () => {
    const inputs = {
      surface: 60,
      bathrooms: 2,
      falseCeiling: 60,
      airConditioners: 4,
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
    expect(breakdown).toHaveLength(7);
    expect(breakdown.find((item) => item.id === 'waterproofing')?.amount).toBe(
      10 * PRICES.waterproofing,
    );
  });
});
