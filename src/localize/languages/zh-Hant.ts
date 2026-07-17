export default {
  common: {
    outdoor: "室外",
    indoor: "室內",
    change_filter: "更換濾網",
    bypass: "旁通",
    open_climate_details: "開啟新風詳情",
    open_filter_details: "開啟濾網詳情",
    open_bypass_details: "開啟旁通詳情",
    summer_mode: "夏季模式",
    state_on: "開啟",
    state_off: "關閉",
  },
  fan_modes: {
    off: "關",
    low: "低速",
    medium: "中速",
    high: "高速",
  },
  sensors: {
    outside_temperature: "室外溫度",
    return_temperature: "回風溫度",
    exhaust_temperature: "排風溫度",
    supply_temperature: "送風溫度",
    intake_fan_rpm: "新風風機轉速",
    return_air_level: "回風檔位",
    exhaust_fan_rpm: "排風風機轉速",
    supply_air_level: "送風檔位",
  },
  editor: {
    name: "名稱",
    name_helper:
      "卡片標題 (預設使用新風實體的友好名稱)",
    entity: "新風實體",
    entity_prefix: "實體前綴 (預設: comfoair)",
    entity_prefix_helper:
      "用於感測器和二進位感測器的前綴 (例如 sensor.<前綴>_outside_temperature)",
    lang: "語言 (覆蓋)",
    lang_helper:
      "留空將自動從 Home Assistant 設定偵測 (如 en, zh-Hans, zh-Hant)",
  },
};
