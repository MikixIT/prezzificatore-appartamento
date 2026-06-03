import { useEffect, useState } from 'react';
import styles from './SettingsModal.module.scss';
import { PRICES } from '../../utils/calculateEstimate';

const LABELS: Record<string, string> = {
  sqm: 'Prezzo per m²',
  bathroom: 'Bagno (cadauno)',
  falseCeiling: 'Controsoffitto (€/m²)',
  airConditioner: 'Condizionatore (cadauno)',
  doorFrame: 'Telaio porta (cadauno)',
  wallsDemolition: 'Abbattimento muro (cadauno)',
  wallConstruction: 'Costruzione muro (cadauno)',
  paintingRooms: 'Tinteggiatura camera (cadauno)',
  waterproofing: 'Impermeabilizzazione (€/m²)',
  electrical: 'Impianto elettrico',
  plumbing: 'Impianto idraulico',
  heating: 'Impianto riscaldamento',
  gas: 'Impianto gas',
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SettingsModal({ open, onClose }: Props) {
  const [localPrices, setLocalPrices] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem('prezzificatore-prices');
      const overrides = raw ? JSON.parse(raw) : {};
      setLocalPrices({ ...PRICES, ...overrides } as unknown as Record<string, number>);
    } catch {
      setLocalPrices(PRICES as unknown as Record<string, number>);
    }
  }, [open]);

  if (!open) return null;

  function handleChange(key: string, value: string) {
    const num = Number(value) || 0;
    setLocalPrices((prev) => ({ ...prev, [key]: num }));
  }

  function handleSave() {
    const overrides: Record<string, number> = {};
    Object.keys(localPrices).forEach((k) => {
      // only persist differences from defaults
      if ((PRICES as any)[k] !== localPrices[k]) overrides[k] = localPrices[k];
    });
    try {
      if (Object.keys(overrides).length === 0) {
        localStorage.removeItem('prezzificatore-prices');
      } else {
        localStorage.setItem('prezzificatore-prices', JSON.stringify(overrides));
      }
      window.dispatchEvent(new Event('pricesChanged'));
    } catch {}
    onClose();
  }

  function handleResetDefaults() {
    localStorage.removeItem('prezzificatore-prices');
    setLocalPrices(PRICES as unknown as Record<string, number>);
    window.dispatchEvent(new Event('pricesChanged'));
    onClose();
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.dialog}>
        <header className={styles.header}>
          <h3>Impostazioni prezzi</h3>
          <button className={styles.close} onClick={onClose} aria-label="Chiudi">✕</button>
        </header>

        <div className={styles.body}>
          {(Object.keys(PRICES) as string[]).map((key) => (
            <label className={styles.row} key={key}>
              <span className={styles.label}>{LABELS[key] ?? key}</span>
              <input
                className={styles.input}
                type="number"
                value={localPrices[key] ?? (PRICES as any)[key] ?? 0}
                min={0}
                step={1}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            </label>
          ))}
        </div>

        <footer className={styles.footer}>
          <button className={styles.secondary} onClick={handleResetDefaults} type="button">Ripristina predefiniti</button>
          <div style={{flex:1}} />
          <button className={styles.primary} onClick={handleSave} type="button">Salva</button>
        </footer>
      </div>
    </div>
  );
}
