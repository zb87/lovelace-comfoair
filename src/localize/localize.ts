import en from "./languages/en";
import zhHans from "./languages/zh-Hans";
import zhHant from "./languages/zh-Hant";
import type { HomeAssistant, ComfoAirCardConfig } from "../types";

const languages: Record<string, any> = {
  en,
  zh: zhHans,
  "zh-Hans": zhHans,
  "zh-CN": zhHans,
  "zh-SG": zhHans,
  "zh-Hant": zhHant,
  "zh-TW": zhHant,
  "zh-HK": zhHant,
  "zh-MO": zhHant,
};

export function localize(
  stringKey: string,
  hass?: HomeAssistant,
  config?: ComfoAirCardConfig,
  search?: string,
  replace?: string
): string {
  const rawLang = (
    config?.lang ||
    hass?.locale?.language ||
    hass?.language ||
    "en"
  ).replace("_", "-");

  let translated: string | undefined;

  // 1. Exact match
  if (languages[rawLang]) {
    translated = getNestedKey(languages[rawLang], stringKey);
  }

  // 2. Prefix match (e.g. "en-US" -> "en")
  if (!translated && rawLang.includes("-")) {
    const primary = rawLang.split("-")[0];
    if (languages[primary]) {
      translated = getNestedKey(languages[primary], stringKey);
    }
  }

  // 3. Fallback to English
  if (!translated) {
    translated = getNestedKey(languages["en"], stringKey);
  }

  if (!translated) {
    return stringKey;
  }

  if (search && replace !== undefined) {
    translated = translated.replace(search, replace);
  }

  return translated;
}

function getNestedKey(obj: any, path: string): string | undefined {
  return path.split(".").reduce(
    (o, key) => (o && o[key] !== undefined ? o[key] : undefined),
    obj
  );
}
