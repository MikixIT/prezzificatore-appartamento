import { type ChangeEvent, type FocusEvent } from 'react';
import { clampNonNegative, parseNonNegativeInt } from '../../utils/clampNonNegative';
import styles from './NumberStepperInput.module.scss';

interface NumberStepperInputProps {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  step?: number;
  suffix?: string;
  ariaDescribedBy?: string;
  decrementLabel?: string;
  incrementLabel?: string;
}

export function NumberStepperInput({
  id,
  value,
  onChange,
  min = 0,
  step = 1,
  suffix,
  ariaDescribedBy,
  decrementLabel = 'Diminuisci',
  incrementLabel = 'Aumenta',
}: NumberStepperInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(parseNonNegativeInt(event.target.value));
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    onChange(clampNonNegative(parseInt(event.target.value, 10) || min));
  };

  const handleStep = (delta: number) => {
    onChange(clampNonNegative(value + delta));
  };

  const stepper = (
    <div className={styles.stepper}>
      <button
        type="button"
        className={styles.stepButton}
        onClick={() => handleStep(-step)}
        disabled={value <= min}
        aria-label={decrementLabel}
      >
        <span aria-hidden="true">−</span>
      </button>

      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        step={step}
        className={styles.input}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-describedby={ariaDescribedBy}
      />

      <button
        type="button"
        className={styles.stepButton}
        onClick={() => handleStep(step)}
        aria-label={incrementLabel}
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  );

  if (suffix) {
    return (
      <div className={styles.wrap}>
        {stepper}
        <span className={styles.suffix} aria-hidden="true">
          {suffix}
        </span>
      </div>
    );
  }

  return stepper;
}
