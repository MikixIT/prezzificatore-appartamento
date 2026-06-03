import styles from './DeveloperCredit.module.scss';

export function DeveloperCredit() {
  return (
    <footer className={styles.credit}>
      <p className={styles.line}>
        <span className={styles.pulse} aria-hidden="true" />
        <span className={styles.label}>sviluppato da</span>
        <a
          className={styles.name}
          href="https://github.com/MikixIT"
          target="_blank"
          rel="noopener noreferrer"
        >
          Mikixit
        </a>
      </p>
    </footer>
  );
}
