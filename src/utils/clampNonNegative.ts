export function clampNonNegative(value: number): number {
  if (Number.isNaN(value) || value < 0) {
    return 0;
  }
  return value;
}

/** Parses typed input, strips leading zeros (e.g. "01" → 1). */
export function parseNonNegativeInt(raw: string): number {
  const digits = raw.replace(/\D/g, '');
  if (digits === '') {
    return 0;
  }
  const parsed = parseInt(digits, 10);
  return clampNonNegative(Number.isNaN(parsed) ? 0 : parsed);
}

export function formatNumberInputValue(value: number): string {
  return value === 0 ? '' : String(value);
}
