import { LitElement, html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { cardStyles } from "./styles";
import type { ComfoAirCardConfig, HomeAssistant } from "./types";

/** Fan mode icon mapping. */
const FAN_ICONS: Record<string, string> = {
  auto: "fan",
  off: "fan-off",
  low: "fan-speed-1",
  medium: "fan-speed-2",
  high: "fan-speed-3",
};

@customElement("comfoair-card")
export class ComfoAirCard extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) config!: ComfoAirCardConfig;

  static styles = cardStyles;

  /** The entity prefix, defaulting to "comfoair". */
  private get entityPrefix(): string {
    return this.config.entity_prefix ?? "comfoair";
  }

  /** Helper to read a sensor state by suffix, e.g. "outside_temperature". */
  private sensorState(suffix: string): string {
    return this.hass.states[`sensor.${this.entityPrefix}_${suffix}`]?.state ?? "—";
  }

  /** Helper to read a binary_sensor state by suffix. */
  private binarySensorState(suffix: string): string {
    return (
      this.hass.states[`binary_sensor.${this.entityPrefix}_${suffix}`]?.state ?? "off"
    );
  }

  render(): TemplateResult {
    const fanMode =
      (this.hass.states[this.config.entity]?.attributes?.fan_mode as string) ??
      "off";
    const fanIcon = FAN_ICONS[fanMode] ?? "fan";

    return html`
      <ha-card>
        <div class="container">
          <div class="${this.getBackgroundClass()}">
            <div class="flex-container">
              <div class="flex-col-out">
                <div>${this.sensorState("outside_temperature")}°C</div>
                <div class="fan-state">
                  <ha-icon icon="mdi:speedometer"></ha-icon>
                  ${Math.trunc(
                    Number(this.sensorState("intake_fan_rpm"))
                  )} rpm
                </div>
                <div>${this.sensorState("exhaust_temperature")}°C</div>
                <div class="fan-state">
                  <ha-icon icon="mdi:speedometer"></ha-icon>
                  ${Math.trunc(
                    Number(this.sensorState("exhaust_fan_rpm"))
                  )} rpm
                </div>
              </div>
              <div class="flex-col-main">
                <div>
                  <ha-icon class="spin" icon="mdi:${fanIcon}"></ha-icon>
                </div>
                <div>
                  ${this.renderAirFilter()} ${this.renderSummerMode()}
                </div>
              </div>
              <div class="flex-col-in">
                <div>${this.sensorState("return_temperature")}°C</div>
                <div class="fan-state">
                  <ha-icon icon="mdi:fan"></ha-icon>
                  ${Math.trunc(
                    Number(this.sensorState("return_air_level"))
                  )}%
                </div>
                <div>${this.sensorState("supply_temperature")}°C</div>
                <div class="fan-state">
                  <ha-icon icon="mdi:fan"></ha-icon>
                  ${Math.trunc(
                    Number(this.sensorState("supply_air_level"))
                  )}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }

  private renderAirFilter(): TemplateResult {
    const isFull = this.sensorState("filter_status") === "Full";
    return html`<ha-icon
      class="${isFull ? "warning" : "inactive"}"
      icon="mdi:air-filter"
    ></ha-icon>`;
  }

  private renderSummerMode(): TemplateResult {
    const isSummer = this.binarySensorState("summer_mode") === "on";
    if (isSummer) {
      return html`<ha-icon
        class="inactive"
        icon="mdi:weather-sunny"
      ></ha-icon>`;
    }
    return html`<ha-icon icon="mdi:snowflake"></ha-icon>`;
  }

  private getBackgroundClass(): string {
    return this.isBypass() ? "bg-bypass" : "bg-heat";
  }

  private isBypass(): boolean {
    return this.binarySensorState("bypass_open") === "on";
  }

  setConfig(config: ComfoAirCardConfig): void {
    if (!config.entity) {
      throw new Error("Please define an entity");
    }
    this.config = config;
  }

  getCardSize(): number {
    return 7;
  }
}

// Register with Home Assistant's custom card picker
declare global {
  interface HTMLElementTagNameMap {
    "comfoair-card": ComfoAirCard;
  }
}
