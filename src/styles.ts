import { css } from "lit";

export const cardStyles = css`
  :host {
    font-variant-numeric: tabular-nums;
    display: block;
    container-type: inline-size;
  }

  ha-card {
    display: block;
    overflow: hidden;
    background: var(--card-background-color, var(--ha-card-background, #fff));
    color: var(--primary-text-color, #212121);
  }

  .card-header-row {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px 0px 16px;
    pointer-events: none;
  }

  .card-header-row > * {
    pointer-events: auto;
  }

  .card-title {
    font-size: 1.15em;
    font-weight: 600;
    color: var(--primary-text-color, #212121);
    letter-spacing: 0.01em;
  }

  .clickable {
    cursor: pointer;
    user-select: none;
    transition: opacity 0.15s ease;
  }

  .clickable:hover {
    opacity: 0.75;
  }

  .header-icons {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .header-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color, #727272);
  }

  .header-icon ha-icon {
    --mdc-icon-size: 20px;
  }

  .diagram-wrapper {
    position: relative;
    z-index: 1;
    margin-top: -26px;
    padding: 0px 8px 0px 8px;
  }

  .diagram {
    width: 100%;
    height: auto;
    display: block;
  }

  /* ── House outline ───────────────────────────── */

  .house-fill {
    fill: var(--primary-text-color, #212121);
    fill-opacity: 0.03;
  }

  .house-outline {
    fill: none;
    stroke: var(--primary-text-color, #212121);
    stroke-width: 2;
    stroke-opacity: 0.2;
    stroke-linejoin: round;
  }

  /* ── SVG text ────────────────────────────────── */

  .label {
    fill: var(--secondary-text-color, #727272);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
  }

  .temp-text {
    font-size: 18px;
    font-weight: 700;
  }

  .fan-text {
    fill: var(--secondary-text-color, #727272);
    font-size: 11px;
    font-weight: 500;
  }

  .filter-badge-bg {
    fill: var(--error-color, #f44336);
  }

  .filter-badge-text {
    fill: #ffffff;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .filter-badge-icon {
    fill: #ffffff;
  }

  .bypass-badge-bg {
    fill: var(--warning-color, #ff9800);
  }

  .bypass-badge-text {
    fill: #ffffff;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  /* ── Ducts & arrows ──────────────────────────── */

  .duct {
    stroke-linejoin: round;
    stroke-linecap: round;
    opacity: 0.85;
  }

  .arrow {
    fill: var(--card-background-color, var(--ha-card-background, #ffffff));
    stroke: none;
    opacity: 0.75;
  }

  /* ── Bottom Controls Bar ─────────────────────── */

  .controls-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px 12px 8px 12px;
    border-top: none;
  }

  .fan-buttons {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--secondary-background-color, rgba(128, 128, 128, 0.08));
    padding: 4px;
    border-radius: 12px;
  }

  .fan-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    border: none;
    background: transparent;
    color: var(--secondary-text-color, #727272);
    padding: 9px 20px;
    border-radius: 9px;
    font-size: 0.92em;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
    text-transform: capitalize;
  }

  .fan-btn ha-icon {
    --mdc-icon-size: 19px;
  }

  /* Responsive: Hide button text on narrow containers (<380px) */
  @container (max-width: 380px) {
    .fan-btn span {
      display: none;
    }
    .fan-btn {
      padding: 9px 15px;
    }
  }

  .fan-btn:hover {
    color: var(--primary-text-color, #212121);
    background: rgba(128, 128, 128, 0.12);
  }

  .fan-btn.active {
    background: var(--primary-color, #03a9f4);
    color: var(--text-primary-color, #ffffff);
    font-weight: 600;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .fan-btn.active ha-icon {
    color: var(--text-primary-color, #ffffff);
  }
`;
