import { useMemo, useState, type ChangeEvent, type FocusEvent } from 'react';
import { calculateEstimate, calculateEstimateBreakdown } from '../../utils/calculateEstimate';
import { formatCurrency } from '../../utils/formatCurrency';
import { clampNonNegative, parseNonNegativeInt } from '../../utils/clampNonNegative';
import type { RenovationCalculatorState, RenovationSystems } from './types';
import styles from './RenovationCalculator.module.scss';

const INITIAL_STATE: RenovationCalculatorState = {
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
};

const SYSTEM_OPTIONS: { key: keyof RenovationSystems; label: string }[] = [
  { key: 'electrical', label: 'Impianto elettrico' },
  { key: 'plumbing', label: 'Impianto idraulico' },
  { key: 'heating', label: 'Impianto di riscaldamento' },
  { key: 'gas', label: 'Impianto gas' },
];

export function RenovationCalculator() {
  const [state, setState] = useState<RenovationCalculatorState>(INITIAL_STATE);
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  const total = useMemo(() => calculateEstimate(state), [state]);
  const breakdown = useMemo(() => calculateEstimateBreakdown(state), [state]);

  const handleNumberChange =
    (
      field:
        | 'surface'
        | 'bathrooms'
        | 'falseCeiling'
        | 'airConditioners'
        | 'waterproofingArea',
    ) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = parseNonNegativeInt(event.target.value);
      setState((prev) => ({ ...prev, [field]: value }));
    };

  const handleSystemChange =
    (key: keyof RenovationSystems) => (event: ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      setState((prev) => ({
        ...prev,
        systems: { ...prev.systems, [key]: checked },
      }));
    };

  const handleWaterproofingToggle = (event: ChangeEvent<HTMLInputElement>) => {
    const enabled = event.target.checked;
    setState((prev) => ({ ...prev, waterproofingEnabled: enabled }));
  };

  const handleBlur =
    (
      field:
        | 'surface'
        | 'bathrooms'
        | 'falseCeiling'
        | 'airConditioners'
        | 'waterproofingArea',
    ) =>
    (event: FocusEvent<HTMLInputElement>) => {
      const value = clampNonNegative(parseInt(event.target.value, 10) || 0);
      setState((prev) => ({ ...prev, [field]: value }));
    };

  return (
    <article className={styles.calculator} aria-labelledby="calculator-title">
      <header className={styles.header}>
        <h1 id="calculator-title" className={styles.title}>
          Preventivo ristrutturazione
        </h1>
        <p className={styles.subtitle}>
          Inserisci i dati dell&apos;appartamento per ottenere una stima indicativa.
        </p>
      </header>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()} noValidate>
        <section className={styles.section} aria-labelledby="dimensions-heading">
          <h2 id="dimensions-heading" className={styles.sectionTitle}>
            Superfici e ambienti
          </h2>

          <div className={styles.fieldGrid}>
            <label className={styles.field}>
              <span className={styles.label}>Superficie abitabile</span>
              <div className={styles.inputWrap}>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  className={styles.input}
                  value={state.surface}
                  onChange={handleNumberChange('surface')}
                  onBlur={handleBlur('surface')}
                  aria-describedby="surface-hint"
                />
                <span className={styles.suffix} aria-hidden="true">
                  m²
                </span>
              </div>
              <span id="surface-hint" className={styles.hint}>
                Metri quadrati totali
              </span>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Bagni da ristrutturare</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                className={styles.input}
                value={state.bathrooms}
                onChange={handleNumberChange('bathrooms')}
                onBlur={handleBlur('bathrooms')}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Controsoffitto</span>
              <div className={styles.inputWrap}>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  className={styles.input}
                  value={state.falseCeiling}
                  onChange={handleNumberChange('falseCeiling')}
                  onBlur={handleBlur('falseCeiling')}
                  aria-describedby="ceiling-hint"
                />
                <span className={styles.suffix} aria-hidden="true">
                  m²
                </span>
              </div>
              <span id="ceiling-hint" className={styles.hint}>
                Superficie controsoffitto
              </span>
            </label>

            <label className={styles.field}>
              <span className={styles.label}>Condizionatori</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                className={styles.input}
                value={state.airConditioners}
                onChange={handleNumberChange('airConditioners')}
                onBlur={handleBlur('airConditioners')}
              />
            </label>
          </div>
        </section>

        <section className={styles.section} aria-labelledby="systems-heading">
          <h2 id="systems-heading" className={styles.sectionTitle}>
            Impianti da rifare
          </h2>

          <fieldset className={styles.checkboxGroup}>
            <legend className={styles.visuallyHidden}>Impianti selezionati</legend>
            {SYSTEM_OPTIONS.map(({ key, label }) => (
              <label key={key} className={styles.checkbox}>
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={state.systems[key]}
                  onChange={handleSystemChange(key)}
                />
                <span className={styles.checkboxBox} aria-hidden="true" />
                <span className={styles.checkboxLabel}>{label}</span>
              </label>
            ))}

            <div className={styles.systemOption}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  className={styles.checkboxInput}
                  checked={state.waterproofingEnabled}
                  onChange={handleWaterproofingToggle}
                />
                <span className={styles.checkboxBox} aria-hidden="true" />
                <span className={styles.checkboxLabel}>
                  Impermeabilizzazione guaina (soffitto o terrazzo)
                </span>
              </label>

              {state.waterproofingEnabled && (
                <label className={styles.systemField}>
                  <span className={styles.label}>Superficie da impermeabilizzare</span>
                  <div className={styles.inputWrap}>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      step={1}
                      className={styles.input}
                      value={state.waterproofingArea}
                      onChange={handleNumberChange('waterproofingArea')}
                      onBlur={handleBlur('waterproofingArea')}
                      aria-describedby="waterproofing-hint"
                    />
                    <span className={styles.suffix} aria-hidden="true">
                      m²
                    </span>
                  </div>
                  <span id="waterproofing-hint" className={styles.hint}>
                    50 €/m²
                  </span>
                </label>
              )}
            </div>
          </fieldset>
        </section>
      </form>

      <footer className={styles.result} aria-live="polite">
        <div className={styles.resultTop}>
          <p className={styles.resultLabel}>Totale stimato</p>
          <button
            type="button"
            className={styles.breakdownToggle}
            onClick={() => setBreakdownOpen((open) => !open)}
            aria-expanded={breakdownOpen}
            aria-controls="estimate-breakdown"
          >
            <span className={styles.breakdownToggleText}>Riepilogo</span>
            <span
              className={`${styles.chevron} ${breakdownOpen ? styles.chevronOpen : ''}`}
              aria-hidden="true"
            />
          </button>
        </div>

        <p className={styles.resultValue}>{formatCurrency(total)}</p>
        <p className={styles.resultNote}>IVA esclusa</p>

        {breakdownOpen && (
          <div
            id="estimate-breakdown"
            className={styles.breakdown}
            role="region"
            aria-label="Riepilogo costi"
          >
            {breakdown.length === 0 ? (
              <p className={styles.breakdownEmpty}>Nessuna voce selezionata</p>
            ) : (
              <ul className={styles.breakdownList}>
                {breakdown.map((item) => (
                  <li key={item.id} className={styles.breakdownItem}>
                    <div className={styles.breakdownInfo}>
                      <span className={styles.breakdownLabel}>{item.label}</span>
                      <span className={styles.breakdownDetail}>{item.detail}</span>
                    </div>
                    <span className={styles.breakdownAmount}>{formatCurrency(item.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </footer>
    </article>
  );
}
