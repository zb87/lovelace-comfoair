import { LitElement, html, svg } from "lit";
import type { TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cardStyles } from "./styles";
import type { ComfoAirCardConfig, HomeAssistant } from "./types";
import { registerEditor } from "./editor";
import { localize } from "./localize/localize";

registerEditor();

/** Supported fan speeds for control buttons. */
const FAN_MODES = ["off", "low", "medium", "high"] as const;

/** Fan mode icon mapping using official MDI icons. */
const FAN_ICONS: Record<string, string> = {
  off: "fan-off",
  low: "fan-speed-1",
  medium: "fan-speed-2",
  high: "fan-speed-3",
};

const CARD_TAG: string = "CARD_TAG_PLACEHOLDER";

@customElement(CARD_TAG)
export class ComfoAirCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) config!: ComfoAirCardConfig;

  static styles = cardStyles;

  /** The entity prefix, defaulting to "comfoair". */
  private get entityPrefix(): string {
    return this.config.entity_prefix ?? "comfoair";
  }

  /** Helper to read a sensor state by suffix. */
  private sensorState(suffix: string): string {
    return this.hass.states[`sensor.${this.entityPrefix}_${suffix}`]?.state ?? "—";
  }

  /** Helper to read a binary_sensor state by suffix. */
  private binarySensorState(suffix: string): string {
    return (
      this.hass.states[`binary_sensor.${this.entityPrefix}_${suffix}`]?.state ?? "off"
    );
  }

  /** Parse a sensor state as a number, defaulting to 0. */
  private sensorNumber(suffix: string): number {
    return Number(this.sensorState(suffix)) || 0;
  }

  /**
   * Map temperature value (°C) to color based on thresholds.
   *  - < 18.0 °C: Cold (Deep Blue)
   *  - 18.0 - 23.5 °C: Cool (Deep Cyan)
   *  - 23.5 - 25.5 °C: Comfortable (Rich Dark Green)
   *  - 25.5 - 27.0 °C: Warm (Deep Orange)
   *  - > 27.0 °C: Hot (Crimson Red)
   */
  private temperatureColor(tempC: number): string {
    if (tempC < 18.0) return "#1e88e5"; // Deep Blue
    if (tempC < 23.5) return "#0097a7"; // Deep Cyan
    if (tempC <= 25.5) return "#2e7d32"; // Rich Dark Green
    if (tempC <= 27.0) return "#e65100"; // Deep Orange
    return "#d32f2f"; // Crimson Red
  }

  private isBypass(): boolean {
    return this.binarySensorState("bypass_open") === "on";
  }

  private setFanMode(mode: string): void {
    if (!this.config.entity) return;
    this.hass.callService("climate", "set_fan_mode", {
      entity_id: this.config.entity,
      fan_mode: mode,
    });
  }

  /** Open Home Assistant's more-info dialog for a specific entity or entity suffix. */
  private openMoreInfo(entityIdOrSuffix: string): void {
    const entityId = entityIdOrSuffix.includes(".")
      ? entityIdOrSuffix
      : `sensor.${this.entityPrefix}_${entityIdOrSuffix}`;

    if (!entityId) return;

    const event = new CustomEvent("hass-more-info", {
      bubbles: true,
      composed: true,
      detail: { entityId },
    });
    this.dispatchEvent(event);
  }

  // ── Main render ───────────────────────────────────────────────

  render(): TemplateResult {
    const bypass = this.isBypass();

    // Temperatures & display strings
    const outsideTemp = this.sensorNumber("outside_temperature");
    const exhaustTemp = this.sensorNumber("exhaust_temperature");
    const returnTemp = this.sensorNumber("return_temperature");
    const supplyTemp = this.sensorNumber("supply_temperature");

    const outsideStr = this.sensorState("outside_temperature");
    const exhaustStr = this.sensorState("exhaust_temperature");
    const returnStr = this.sensorState("return_temperature");
    const supplyStr = this.sensorState("supply_temperature");

    // Colors
    const outsideClr = this.temperatureColor(outsideTemp);
    const exhaustClr = this.temperatureColor(exhaustTemp);
    const returnClr = this.temperatureColor(returnTemp);
    const supplyClr = this.temperatureColor(supplyTemp);

    // Fan data
    const intakeRpm = Math.trunc(this.sensorNumber("intake_fan_rpm"));
    const exhaustRpm = Math.trunc(this.sensorNumber("exhaust_fan_rpm"));
    const returnLvl = Math.trunc(this.sensorNumber("return_air_level"));
    const supplyLvl = Math.trunc(this.sensorNumber("supply_air_level"));

    // Upper-right indoor location (top duct end) & lower-right indoor location (bottom duct end)
    // When bypass is ON (straight parallel ducts):
    //   - Top duct comes straight from Outdoor Intake -> Supply Air (supply_temperature, supply_air_level)
    //   - Bottom duct goes straight to Outdoor Exhaust -> Return Air (return_temperature, return_air_level)
    // When bypass is OFF (Heat Exchange mode, X crossing):
    //   - Upper right duct leads to lower left Exhaust -> Return Air (return_temperature, return_air_level)
    //   - Lower right duct comes from upper left Intake -> Supply Air (supply_temperature, supply_air_level)

    const upperIndoorStr = bypass ? supplyStr : returnStr;
    const upperIndoorClr = bypass ? supplyClr : returnClr;
    const upperIndoorLvl = bypass ? supplyLvl : returnLvl;
    const upperIndoorTempSensor = bypass ? "supply_temperature" : "return_temperature";
    const upperIndoorLvlSensor = bypass ? "supply_air_level" : "return_air_level";

    const lowerIndoorStr = bypass ? returnStr : supplyStr;
    const lowerIndoorClr = bypass ? returnClr : supplyClr;
    const lowerIndoorLvl = bypass ? returnLvl : supplyLvl;
    const lowerIndoorTempSensor = bypass ? "return_temperature" : "supply_temperature";
    const lowerIndoorLvlSensor = bypass ? "return_air_level" : "supply_air_level";

    // Climate state attributes
    const climateEntity = this.hass.states[this.config.entity];
    const currentFanMode =
      (climateEntity?.attributes?.fan_mode as string) ?? "off";
    const cardTitle = "ComfoAir";

    const isFilterFull = this.sensorState("filter_status") === "Full";

    return html`
      <ha-card>
        <!-- Header row: Title with target temp on left (clickable for climate info), summer/winter icon on right -->
        <div class="card-header-row">
          <div
            class="card-title clickable"
            @click=${() => this.openMoreInfo(this.config.entity)}
            title="${localize("common.open_climate_details", this.hass, this.config)}"
          >
            ${cardTitle}
          </div>
          <div class="header-icons">
            ${this.renderSummerModeIcon()}
          </div>
        </div>

        <!-- SVG Diagram -->
        <div class="diagram-wrapper">
          <svg
            class="diagram"
            viewBox="0 0 450 230"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              ${bypass
                ? this.bypassGradients(outsideClr, exhaustClr, returnClr, supplyClr)
                : this.hxGradients(outsideClr, exhaustClr, returnClr, supplyClr)}
            </defs>

            <!-- House silhouette -->
            <path
              class="house-fill"
              d="M130,68 L280,12 L430,68 V222 H130 Z"
            />
            <path
              class="house-outline"
              d="M130,68 L280,12 L430,68 V222 H130 Z"
            />

            <!-- Section labels (Vertically aligned at y=80, directly above top temperatures) -->
            <text class="label" x="60" y="80" text-anchor="middle">
              ${localize("common.outdoor", this.hass, this.config)}
            </text>
            <text class="label" x="330" y="80" text-anchor="middle">
              ${localize("common.indoor", this.hass, this.config)}
            </text>

            <!-- Change Filter warning badge (clickable for filter_status info) -->
            ${isFilterFull
              ? svg`
                <g class="filter-badge clickable" @click=${() => this.openMoreInfo("filter_status")} title="${localize("common.open_filter_details", this.hass, this.config)}">
                  <rect class="filter-badge-bg" x="125" y="67" width="122" height="22" rx="11"/>
                  <path class="filter-badge-icon" transform="translate(133, 71) scale(0.58)" d="M19,18.31V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V16.3C4.54,16.12 3.95,16 3,16A1,1 0 0,1 2,15A1,1 0 0,1 3,14C3.82,14 4.47,14.08 5,14.21V12.3C4.54,12.12 3.95,12 3,12A1,1 0 0,1 2,11A1,1 0 0,1 3,10C3.82,10 4.47,10.08 5,10.21V8.3C4.54,8.12 3.95,8 3,8A1,1 0 0,1 2,7A1,1 0 0,1 3,6C3.82,6 4.47,6.08 5,6.21V4A2,2 0 0,1 7,2H17A2,2 0 0,1 19,4V6.16C20.78,6.47 21.54,7.13 21.71,7.29C22.1,7.68 22.1,8.32 21.71,8.71C21.32,9.1 20.8,9.09 20.29,8.71V8.71C20.29,8.71 19.25,8 17,8C15.74,8 14.91,8.41 13.95,8.9C12.91,9.41 11.74,10 10,10C9.64,10 9.31,10 9,9.96V7.95C9.3,8 9.63,8 10,8C11.26,8 12.09,7.59 13.05,7.11C14.09,6.59 15.27,6 17,6V4H7V20H17V18C18.5,18 18.97,18.29 19,18.31M17,10C15.27,10 14.09,10.59 13.05,11.11C12.09,11.59 11.26,12 10,12C9.63,12 9.3,12 9,11.95V13.96C9.31,14 9.64,14 10,14C11.74,14 12.91,13.41 13.95,12.9C14.91,12.42 15.74,12 17,12C20.29,12 20.29,12.71 20.29,12.71V12.71C20.8,13.1 21.32,13.1 21.71,12.71C22.1,12.32 22.1,11.69 21.71,11.29C21.5,11.08 20.25,10 17,10M17,14C15.27,14 14.09,14.59 13.05,15.11C12.09,15.59 11.26,16 10,16C9.63,16 9.3,16 9,15.95V17.96C9.31,18 9.64,18 10,18C11.74,18 12.91,17.41 13.95,16.9C14.91,16.42 15.74,16 17,16C19.25,16 20.29,16.71 20.29,16.71V16.71C20.8,17.1 21.32,17.1 21.71,15.29C21.5,15.08 20.25,14 17,14Z"/>
                  <text class="filter-badge-text" x="193" y="82" text-anchor="middle">
                    ${localize("common.change_filter", this.hass, this.config)}
                  </text>
                </g>
              `
              : null}

            <!-- Smooth Ducts -->
            ${bypass
              ? this.renderBypassDucts()
              : this.renderHXDucts(outsideClr, exhaustClr, returnClr, supplyClr)}

            <!-- Bypass badge with background color & icon inside center airflow -->
            ${bypass
              ? svg`
                <g class="bypass-badge clickable" @click=${() => this.openMoreInfo("binary_sensor." + this.entityPrefix + "_bypass_open")} title="${localize("common.open_bypass_details", this.hass, this.config)}">
                  <rect class="bypass-badge-bg" x="145" y="142" width="80" height="20" rx="10"/>
                  <text class="bypass-badge-text" x="185" y="156" text-anchor="middle">⇌ ${localize("common.bypass", this.hass, this.config)}</text>
                </g>
              `
              : null}

            <!-- Static Flow direction arrows -->
            ${this.renderFlowArrows(bypass)}

            <!-- Temperature values (clickable for temperature sensor info) -->
            <text class="temp-text clickable" x="60" y="101" text-anchor="middle" fill="${outsideClr}" @click=${() => this.openMoreInfo("outside_temperature")} title="${localize("sensors.outside_temperature", this.hass, this.config)}">${outsideStr}°C</text>
            <text class="temp-text clickable" x="330" y="101" text-anchor="middle" fill="${upperIndoorClr}" @click=${() => this.openMoreInfo(upperIndoorTempSensor)} title="${localize(`sensors.${upperIndoorTempSensor}`, this.hass, this.config)}">${upperIndoorStr}°C</text>
            <text class="temp-text clickable" x="60" y="169" text-anchor="middle" fill="${exhaustClr}" @click=${() => this.openMoreInfo("exhaust_temperature")} title="${localize("sensors.exhaust_temperature", this.hass, this.config)}">${exhaustStr}°C</text>
            <text class="temp-text clickable" x="330" y="169" text-anchor="middle" fill="${lowerIndoorClr}" @click=${() => this.openMoreInfo(lowerIndoorTempSensor)} title="${localize(`sensors.${lowerIndoorTempSensor}`, this.hass, this.config)}">${lowerIndoorStr}°C</text>

            <!-- Fan data (clickable for RPM & air level info) -->
            <text class="fan-text clickable" x="60" y="144" text-anchor="middle" @click=${() => this.openMoreInfo("intake_fan_rpm")} title="${localize("sensors.intake_fan_rpm", this.hass, this.config)}">${intakeRpm} rpm</text>
            <text class="fan-text clickable" x="330" y="144" text-anchor="middle" @click=${() => this.openMoreInfo(upperIndoorLvlSensor)} title="${localize(`sensors.${upperIndoorLvlSensor}`, this.hass, this.config)}">${upperIndoorLvl}%</text>
            <text class="fan-text clickable" x="60" y="212" text-anchor="middle" @click=${() => this.openMoreInfo("exhaust_fan_rpm")} title="${localize("sensors.exhaust_fan_rpm", this.hass, this.config)}">${exhaustRpm} rpm</text>
            <text class="fan-text clickable" x="330" y="212" text-anchor="middle" @click=${() => this.openMoreInfo(lowerIndoorLvlSensor)} title="${localize(`sensors.${lowerIndoorLvlSensor}`, this.hass, this.config)}">${lowerIndoorLvl}%</text>
          </svg>
        </div>

        <!-- Controls bar: Centered Fan speed buttons -->
        <div class="controls-bar">
          <div class="fan-buttons">
            ${FAN_MODES.map(
              (mode) => html`
                <button
                  class="fan-btn ${currentFanMode === mode ? "active" : ""}"
                  @click=${() => this.setFanMode(mode)}
                >
                  <ha-icon icon="mdi:${FAN_ICONS[mode]}"></ha-icon>
                  <span>${localize(`fan_modes.${mode}`, this.hass, this.config)}</span>
                </button>
              `
            )}
          </div>
        </div>
      </ha-card>
    `;
  }

  // ── SVG gradient definitions ──────────────────────────────────

  private hxGradients(
    outsideClr: string,
    _exhaustClr: string,
    returnClr: string,
    supplyClr: string
  ) {
    return svg`
      <linearGradient id="grad-hx1" x1="130" y1="0" x2="240" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${outsideClr}"/>
        <stop offset="100%" stop-color="${supplyClr}"/>
      </linearGradient>
      <linearGradient id="grad-hx2" x1="240" y1="0" x2="130" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${returnClr}"/>
        <stop offset="100%" stop-color="${_exhaustClr}"/>
      </linearGradient>
    `;
  }

  private bypassGradients(
    outsideClr: string,
    exhaustClr: string,
    returnClr: string,
    supplyClr: string
  ) {
    return svg`
      <linearGradient id="grad-bypass-upper" x1="15" y1="0" x2="375" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${outsideClr}"/>
        <stop offset="100%" stop-color="${supplyClr}"/>
      </linearGradient>
      <linearGradient id="grad-bypass-lower" x1="15" y1="0" x2="375" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="${exhaustClr}"/>
        <stop offset="100%" stop-color="${returnClr}"/>
      </linearGradient>
    `;
  }

  // ── Smooth Single-Path Duct Rendering ─────────────────────────

  private renderHXDucts(
    outsideClr: string,
    exhaustClr: string,
    returnClr: string,
    supplyClr: string
  ) {
    return svg`
      <!-- Duct 1: Fresh air (Top-left outdoor -> Bottom-right indoor) -->
      <path class="duct"
        d="M 15,107 L 125,107 Q 140,107 150,114 L 210,168 Q 220,175 235,175 L 375,175 L 375,199 L 235,199 Q 215,199 200,187 L 140,133 Q 130,131 115,131 L 15,131 Z"
        fill="url(#grad-hx1)"
      />
      <rect class="duct" x="15" y="107" width="10" height="24" rx="2" fill="${outsideClr}"/>
      <rect class="duct" x="365" y="175" width="10" height="24" rx="2" fill="${supplyClr}"/>

      <!-- Duct 2: Stale air (Top-right indoor -> Bottom-left outdoor) -->
      <path class="duct"
        d="M 375,107 L 235,107 Q 220,107 210,114 L 150,168 Q 140,175 125,175 L 15,175 L 15,199 L 125,199 Q 145,199 160,187 L 220,133 Q 230,131 245,131 L 375,131 Z"
        fill="url(#grad-hx2)"
      />
      <rect class="duct" x="365" y="107" width="10" height="24" rx="2" fill="${returnClr}"/>
      <rect class="duct" x="15" y="175" width="10" height="24" rx="2" fill="${exhaustClr}"/>
    `;
  }

  private renderBypassDucts() {
    return svg`
      <rect class="duct" x="15" y="107" width="360" height="24" rx="4" fill="url(#grad-bypass-upper)" />
      <rect class="duct" x="15" y="175" width="360" height="24" rx="4" fill="url(#grad-bypass-lower)" />
    `;
  }

  // ── Static Flow Arrows ────────────────────────────────────────

  private renderFlowArrows(bypass: boolean) {
    if (bypass) {
      return svg`
        <!-- Top duct: Left to Right -->
        ${this.chevron(35, 119, "right")}
        ${this.chevron(75, 119, "right")}
        ${this.chevron(305, 119, "right")}
        ${this.chevron(345, 119, "right")}

        <!-- Bottom duct: Right to Left -->
        ${this.chevron(345, 187, "left")}
        ${this.chevron(305, 187, "left")}
        ${this.chevron(75, 187, "left")}
        ${this.chevron(35, 187, "left")}
      `;
    }

    return svg`
      <!-- Fresh air intake: Left to Right -->
      ${this.chevron(35, 119, "right")}
      ${this.chevron(75, 119, "right")}
      ${this.chevron(305, 187, "right")}
      ${this.chevron(345, 187, "right")}

      <!-- Stale air return: Right to Left -->
      ${this.chevron(345, 119, "left")}
      ${this.chevron(305, 119, "left")}
      ${this.chevron(75, 187, "left")}
      ${this.chevron(35, 187, "left")}
    `;
  }

  private chevron(cx: number, cy: number, dir: "left" | "right") {
    const d =
      dir === "right"
        ? `M${cx - 4},${cy - 5} L${cx + 4},${cy} L${cx - 4},${cy + 5}`
        : `M${cx + 4},${cy - 5} L${cx - 4},${cy} L${cx + 4},${cy + 5}`;
    return svg`<path class="arrow" d="${d}"/>`;
  }

  // ── Upper Right Header Icons ──────────────────────────────────

  private renderSummerModeIcon(): TemplateResult {
    const isSummer = this.binarySensorState("summer_mode") === "on";
    const entityId = `binary_sensor.${this.entityPrefix}_summer_mode`;
    const stateStr = isSummer
      ? localize("common.state_on", this.hass, this.config)
      : localize("common.state_off", this.hass, this.config);
    const summerModeStr = localize("common.summer_mode", this.hass, this.config);

    return html`
      <div
        class="header-icon clickable"
        @click=${() => this.openMoreInfo(entityId)}
        title="${summerModeStr}: ${stateStr}"
      >
        <ha-icon icon="mdi:${isSummer ? "weather-sunny" : "snowflake"}"></ha-icon>
      </div>
    `;
  }

  // ── Card lifecycle ────────────────────────────────────────────

  setConfig(config: ComfoAirCardConfig): void {
    if (!config.entity) {
      throw new Error("Please define an entity");
    }
    this.config = config;
  }

  getCardSize(): number {
    return 7;
  }

  /** Return custom card editor element for Lovelace UI. */
  public static async getConfigElement(): Promise<HTMLElement> {
    return document.createElement(`${CARD_TAG}-editor`);
  }

  /** Stub config for auto-populating default values when adding card from UI library. */
  public static getStubConfig(
    _hass: HomeAssistant,
    entities: string[],
    _entityIds: string[]
  ): ComfoAirCardConfig {
    const climateEntity =
      entities.find((e) => e.startsWith("climate.")) ?? "climate.comfoair";
    return {
      entity: climateEntity,
      entity_prefix: "comfoair",
    };
  }
}

// Register with Home Assistant's custom card picker
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: CARD_TAG,
  name: CARD_TAG === "comfoair-card-test" ? "ComfoAir Card (Test)" : "ComfoAir Card",
  description: "Home Assistant Lovelace card for ComfoAir HVAC units",
  preview: true,
});

declare global {
  interface HTMLElementTagNameMap {
    "comfoair-card": ComfoAirCard;
    "comfoair-card-test": ComfoAirCard;
  }
}
