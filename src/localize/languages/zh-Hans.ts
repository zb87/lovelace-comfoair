export default {
  common: {
    outdoor: "室外",
    indoor: "室内",
    change_filter: "更换滤网",
    bypass: "旁通",
    open_climate_details: "打开新风详情",
    open_filter_details: "打开滤网详情",
    open_bypass_details: "打开旁通详情",
    summer_mode: "夏季模式",
    state_on: "开启",
    state_off: "关闭",
  },
  fan_modes: {
    off: "关",
    low: "低速",
    medium: "中速",
    high: "高速",
  },
  sensors: {
    outside_temperature: "室外温度",
    return_temperature: "回风温度",
    exhaust_temperature: "排风温度",
    supply_temperature: "送风温度",
    intake_fan_rpm: "新风风机转速",
    return_air_level: "回风档位",
    exhaust_fan_rpm: "排风风机转速",
    supply_air_level: "送风档位",
  },
  editor: {
    entity: "新风实体",
    entity_prefix: "实体前缀 (默认: comfoair)",
    entity_prefix_helper:
      "用于传感器和二进制传感器的前缀 (例如 sensor.<前缀>_outside_temperature)",
    lang: "语言 (覆盖)",
    lang_helper:
      "留空将自动从 Home Assistant 设置检测 (如 en, zh-Hans)",
  },
};
