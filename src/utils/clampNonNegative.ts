export function clampNonNegative(value: number): number {
  if (Number.isNaN(value) || value < 0) {
    return 0;
  }
  return value;
}

export function parseNonNegativeInt(raw: string): number {
  const parsed = parseInt(raw, 10);
  return clampNonNegative(Number.isNaN(parsed) ? 0 : parsed);
}
