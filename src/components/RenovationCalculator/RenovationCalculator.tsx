import { useMemo, useState, useEffect, type ChangeEvent } from 'react';
import { calculateEstimate, calculateEstimateBreakdown } from '../../utils/calculateEstimate';
import { formatCurrency } from '../../utils/formatCurrency';
import { useTheme } from '../../hooks/useTheme';
import { NumberStepperInput } from './NumberStepperInput';
import { SettingsModal } from '../SettingsModal/SettingsModal';
import type { RenovationCalculatorState, RenovationSystems } from './types';
import styles from './RenovationCalculator.module.scss';

type NumberField =
  | 'surface'
  | 'bathrooms'
  | 'falseCeiling'
  | 'airConditioners'
  | 'doorFrames'
  | 'wallsDemolition'
  | 'wallConstruction'
  | 'paintingRooms'
  | 'waterproofingArea';

const FLOOR_LEVELS = [0, 1, 2, 3, 4, 5, 6] as const;

const INITIAL_STATE: RenovationCalculatorState = {
  surface: 0,
  bathrooms: 0,
  falseCeiling: 0,
  airConditioners: 0,
  doorFrames: 0,
  wallsDemolition: 0,
  wallConstruction: 0,
  paintingRooms: 0,
  floorLevel: 0,
  waterproofingEnabled: false,
  waterproofingArea: 0,
  systems: {
    electrical: false,
    plumbing: false,
    heating: false,
    gas: false,
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
  const [showSettings, setShowSettings] = useState(false);
  const [pricesVersion, setPricesVersion] = useState(0);
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  const total = useMemo(() => calculateEstimate(state), [state, pricesVersion]);
  const breakdown = useMemo(() => calculateEstimateBreakdown(state), [state, pricesVersion]);

  const resetValues = () => setState(INITIAL_STATE);

  const handleNumberFieldChange = (field: NumberField) => (value: number) => {
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

  useEffect(() => {
    const handler = () => setPricesVersion((v) => v + 1);
    window.addEventListener('pricesChanged', handler);
    return () => window.removeEventListener('pricesChanged', handler);
  }, []);

  const handleFloorLevelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const level = Number(event.target.value) as RenovationCalculatorState['floorLevel'];
    setState((prev) => ({ ...prev, floorLevel: level }));
  };

  return (
    <article className={styles.calculator} aria-labelledby="calculator-title">
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <div className={styles.headerText}>
            <h1 id="calculator-title" className={styles.title}>
              Preventivo ristrutturazione
            </h1>
            <p className={styles.subtitle}>
              Inserisci i dati dell&apos;appartamento per ottenere una stima indicativa.
            </p>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.resetButton}
              onClick={resetValues}
              aria-label="Azzera tutti i valori"
            >
              Azzerra
            </button>
            <button
              type="button"
              className={styles.settingsButton}
              onClick={() => setShowSettings(true)}
              aria-label="Apri impostazioni prezzi"
            >
              ⚙
            </button>
            <button
              type="button"
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label={isDark ? 'Attiva modalità chiara' : 'Attiva modalità scura'}
            >
              {isDark ? '☀' : '☾'}
            </button>
          </div>
        </div>
      </header>

      <SettingsModal open={showSettings} onClose={() => setShowSettings(false)} />

      <form className={styles.form} onSubmit={(e) => e.preventDefault()} noValidate>
        <section className={styles.section} aria-labelledby="dimensions-heading">
          <h2 id="dimensions-heading" className={styles.sectionTitle}>
            Superfici e ambienti
          </h2>

          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="surface">
                Superficie abitabile
              </label>
              <NumberStepperInput
                id="surface"
                value={state.surface}
                onChange={handleNumberFieldChange('surface')}
                suffix="m²"
                ariaDescribedBy="surface-hint"
                decrementLabel="Diminuisci superficie"
                incrementLabel="Aumenta superficie"
              />
              <span id="surface-hint" className={styles.hint}>
                Metri quadrati totali
              </span>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="floorLevel">
                Piano
              </label>
              <select
                id="floorLevel"
                className={styles.select}
                value={state.floorLevel}
                onChange={handleFloorLevelChange}
              >
                {FLOOR_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    Piano {level} — {level === 0 ? '0%' : level === 1 ? '5%' : level === 2 ? '10%' : level === 3 ? '12%' : level === 4 ? '18%' : level === 5 ? '20%' : '25%'}
                  </option>
                ))}
              </select>
              <span id="floor-hint" className={styles.hint}>
                Percentuale sul totale in base al piano.
              </span>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="bathrooms">
                Bagni da ristrutturare
              </label>
              <NumberStepperInput
                id="bathrooms"
                value={state.bathrooms}
                onChange={handleNumberFieldChange('bathrooms')}
                decrementLabel="Diminuisci bagni"
                incrementLabel="Aumenta bagni"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="falseCeiling">
                Controsoffitto
              </label>
              <NumberStepperInput
                id="falseCeiling"
                value={state.falseCeiling}
                onChange={handleNumberFieldChange('falseCeiling')}
                suffix="m²"
                ariaDescribedBy="ceiling-hint"
                decrementLabel="Diminuisci superficie controsoffitto"
                incrementLabel="Aumenta superficie controsoffitto"
              />
              <span id="ceiling-hint" className={styles.hint}>
                Superficie controsoffitto
              </span>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="airConditioners">
                Condizionatori
              </label>
              <NumberStepperInput
                id="airConditioners"
                value={state.airConditioners}
                onChange={handleNumberFieldChange('airConditioners')}
                decrementLabel="Diminuisci condizionatori"
                incrementLabel="Aumenta condizionatori"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="doorFrames">
                Porte telai a scomparsa
              </label>
              <NumberStepperInput
                id="doorFrames"
                value={state.doorFrames}
                onChange={handleNumberFieldChange('doorFrames')}
                ariaDescribedBy="door-frames-hint"
                decrementLabel="Diminuisci porte telai a scomparsa"
                incrementLabel="Aumenta porte telai a scomparsa"
              />
              <span id="door-frames-hint" className={styles.hint}>
                Montaggio, 500 €/cad.
              </span>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="wallsDemolition">
                Abbattimento muro
              </label>
              <NumberStepperInput
                id="wallsDemolition"
                value={state.wallsDemolition}
                onChange={handleNumberFieldChange('wallsDemolition')}
                ariaDescribedBy="walls-hint"
                decrementLabel="Diminuisci muri da abbattere"
                incrementLabel="Aumenta muri da abbattere"
              />
              <span id="walls-hint" className={styles.hint}>
                650 €/cad.
              </span>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="wallConstruction">
                Costruzione muro
              </label>
              <NumberStepperInput
                id="wallConstruction"
                value={state.wallConstruction}
                onChange={handleNumberFieldChange('wallConstruction')}
                ariaDescribedBy="construction-hint"
                decrementLabel="Diminuisci muri da costruire"
                incrementLabel="Aumenta muri da costruire"
              />
              <span id="construction-hint" className={styles.hint}>
                1.250 €/cad.
              </span>
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="paintingRooms">
                Tinteggiatura camera
              </label>
              <NumberStepperInput
                id="paintingRooms"
                value={state.paintingRooms}
                onChange={handleNumberFieldChange('paintingRooms')}
                ariaDescribedBy="painting-hint"
                decrementLabel="Diminuisci camere da tinteggiare"
                incrementLabel="Aumenta camere da tinteggiare"
              />
              <span id="painting-hint" className={styles.hint}>
                400 €/cad.
              </span>
            </div>
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
                <div className={styles.systemField}>
                  <label className={styles.label} htmlFor="waterproofingArea">
                    Superficie da impermeabilizzare
                  </label>
                  <NumberStepperInput
                    id="waterproofingArea"
                    value={state.waterproofingArea}
                    onChange={handleNumberFieldChange('waterproofingArea')}
                    suffix="m²"
                    ariaDescribedBy="waterproofing-hint"
                    decrementLabel="Diminuisci superficie impermeabilizzazione"
                    incrementLabel="Aumenta superficie impermeabilizzazione"
                  />
                  <span id="waterproofing-hint" className={styles.hint}>
                    50 €/m²
                  </span>
                </div>
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
