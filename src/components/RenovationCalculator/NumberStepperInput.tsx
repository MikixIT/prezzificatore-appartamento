import { useEffect, useState, type ChangeEvent, type FocusEvent } from 'react';
import {
  clampNonNegative,
  formatNumberInputValue,
  parseNonNegativeInt,
} from '../../utils/clampNonNegative';
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
  const [isFocused, setIsFocused] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!isFocused) {
      setText(formatNumberInputValue(value));
    }
  }, [value, isFocused]);

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    const next = formatNumberInputValue(value);
    setText(next);
    requestAnimationFrame(() => event.target.select());
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = event.target.value.replace(/\D/g, '');
    setText(digits);
    onChange(parseNonNegativeInt(digits));
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseNonNegativeInt(text);
    onChange(clampNonNegative(parsed < min ? min : parsed));
    setText(formatNumberInputValue(parsed));
  };

  const handleStep = (delta: number) => {
    const next = clampNonNegative(value + delta);
    onChange(next < min ? min : next);
    setText(formatNumberInputValue(next));
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
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        className={styles.input}
        value={text}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-describedby={ariaDescribedBy}
        placeholder="0"
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
