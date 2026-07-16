/**
 * Type definitions for the ComfoAir card.
 */

/** Card configuration provided by the user in the Lovelace YAML. */
export interface ComfoAirCardConfig {
  /** The climate entity ID, e.g. "climate.comfoair". */
  entity: string;

  /**
   * Prefix for all ComfoAir sensor/binary_sensor entity IDs.
   * Defaults to "comfoair".
   *
   * With prefix "comfoair", the card looks for entities like:
   *   - sensor.comfoair_outside_temperature
   *   - sensor.comfoair_intake_fan_rpm
   *   - binary_sensor.comfoair_bypass_open
   *   - etc.
   */
  entity_prefix?: string;

  /** Manual language override (e.g. "en", "zh-Hans", "zh-Hant"). */
  lang?: string;
}

/** Shape of the Home Assistant state object for a single entity. */
export interface HassEntity {
  state: string;
  attributes: Record<string, unknown>;
}

/** Minimal subset of the Home Assistant object exposed to Lovelace cards. */
export interface HomeAssistant {
  language: string;
  locale?: {
    language: string;
  };
  states: Record<string, HassEntity>;
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>
  ): Promise<void>;
}
