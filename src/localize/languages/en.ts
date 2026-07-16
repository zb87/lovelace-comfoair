export default {
  common: {
    outdoor: "OUTDOOR",
    indoor: "INDOOR",
    change_filter: "Change Filter",
    bypass: "BYPASS",
    open_climate_details: "Open Climate Details",
    open_filter_details: "Open Filter Details",
    open_bypass_details: "Open Bypass Details",
    summer_mode: "Summer Mode",
    state_on: "ON",
    state_off: "OFF",
  },
  fan_modes: {
    off: "Off",
    low: "Low",
    medium: "Med",
    high: "High",
  },
  sensors: {
    outside_temperature: "Outside Temperature",
    return_temperature: "Return Temperature",
    exhaust_temperature: "Exhaust Temperature",
    supply_temperature: "Supply Temperature",
    intake_fan_rpm: "Intake Fan RPM",
    return_air_level: "Return Air Level",
    exhaust_fan_rpm: "Exhaust Fan RPM",
    supply_air_level: "Supply Air Level",
  },
  editor: {
    entity: "Climate Entity",
    entity_prefix: "Entity Prefix (default: comfoair)",
    entity_prefix_helper:
      "Prefix used for sensor & binary_sensor entity IDs (e.g. sensor.<prefix>_outside_temperature)",
    lang: "Language (override)",
    lang_helper:
      "Leave empty to auto-detect from Home Assistant settings (e.g. en, zh-Hans, zh-Hant)",
  },
};
