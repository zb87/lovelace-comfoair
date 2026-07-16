import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import {
  mdiAirFilter,
  mdiSnowflake,
  mdiWeatherSunny,
  mdiThermometer,
  mdiFanOff,
  mdiFanSpeed1,
  mdiFanSpeed2,
  mdiFanSpeed3,
} from "@mdi/js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const jsFile = resolve(rootDir, "dist/comfoair-card.js");
const outFile = resolve(rootDir, "dist/preview.html");

const jsCode = readFileSync(jsFile, "utf8");

const iconMap = {
  "mdi:air-filter": mdiAirFilter,
  "mdi:snowflake": mdiSnowflake,
  "mdi:weather-sunny": mdiWeatherSunny,
  "mdi:thermometer": mdiThermometer,
  "mdi:fan-off": mdiFanOff,
  "mdi:fan-speed-1": mdiFanSpeed1,
  "mdi:fan-speed-2": mdiFanSpeed2,
  "mdi:fan-speed-3": mdiFanSpeed3,
};

const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ComfoAir Card Standalone Preview</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
      padding: 30px 20px;
      background: #121212;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
    }

    h1 {
      font-size: 1.4em;
      font-weight: 500;
      color: #e0e0e0;
      margin-bottom: 5px;
    }

    .preview-section {
      width: 100%;
      max-width: 980px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 30px;
    }

    .card-wrapper {
      width: 440px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .card-label {
      font-size: 0.85em;
      color: #aaa;
      font-weight: 500;
      padding-left: 4px;
    }

    /* Mock ha-card Dark Theme */
    .theme-dark {
      --card-background-color: #1c1c1c;
      --ha-card-background: #1c1c1c;
      --primary-text-color: #e1e1e1;
      --secondary-text-color: #9e9e9e;
      --secondary-background-color: rgba(255, 255, 255, 0.06);
      --divider-color: rgba(255, 255, 255, 0.1);
      --primary-color: #03a9f4;
      --warning-color: #ff9800;
      --error-color: #f44336;
      --text-primary-color: #ffffff;
    }

    /* Mock ha-card Light Theme */
    .theme-light {
      --card-background-color: #ffffff;
      --ha-card-background: #ffffff;
      --primary-text-color: #212121;
      --secondary-text-color: #757575;
      --secondary-background-color: rgba(0, 0, 0, 0.05);
      --divider-color: rgba(0, 0, 0, 0.1);
      --primary-color: #0288d1;
      --warning-color: #f57c00;
      --error-color: #d32f2f;
      --text-primary-color: #ffffff;
    }
  </style>

  <!-- Polyfills for ha-card and ha-icon -->
  <script>
    const MDI_ICONS = ${JSON.stringify(iconMap, null, 2)};

    if (!customElements.get('ha-card')) {
      customElements.define('ha-card', class extends HTMLElement {});
    }

    if (!customElements.get('ha-icon')) {
      customElements.define('ha-icon', class extends HTMLElement {
        static get observedAttributes() { return ['icon']; }
        attributeChangedCallback() { this.render(); }
        connectedCallback() { this.render(); }
        render() {
          const name = this.getAttribute('icon') || '';
          const path = MDI_ICONS[name] || '';
          this.innerHTML = \`<svg viewBox="0 0 24 24" style="width:var(--mdc-icon-size, 24px);height:var(--mdc-icon-size, 24px);fill:currentColor;display:inline-block;vertical-align:middle;"><path d="\${path}"/></svg>\`;
        }
      });
    }
  </script>

  <!-- Inlined Compiled ComfoAir Web Component JS -->
  <script>
${jsCode}
  </script>
</head>
<body>
  <h1>ComfoAir Card Live Preview</h1>

  <div class="preview-section">
    <!-- LIGHT THEME (LEFT) -->
    <div class="card-wrapper theme-light">
      <div class="card-label">Light Theme (Heat Exchange ON — Winter Mode)</div>
      <comfoair-card id="card-light"></comfoair-card>
    </div>

    <!-- DARK THEME (RIGHT) -->
    <div class="card-wrapper theme-dark">
      <div class="card-label">Dark Theme (Bypass Active — Summer Mode)</div>
      <comfoair-card id="card-dark"></comfoair-card>
    </div>
  </div>

  <script>
    function createMockHass(overrideStates = {}) {
      const states = {
        "climate.comfoair": { state: "auto", attributes: { fan_mode: "medium", temperature: 24 } },
        "sensor.comfoair_outside_temperature": { state: "10", attributes: {} },
        "sensor.comfoair_exhaust_temperature": { state: "12", attributes: {} },
        "sensor.comfoair_return_temperature": { state: "25.5", attributes: {} },
        "sensor.comfoair_supply_temperature": { state: "24", attributes: {} },
        "sensor.comfoair_intake_fan_rpm": { state: "1522", attributes: {} },
        "sensor.comfoair_exhaust_fan_rpm": { state: "1469", attributes: {} },
        "sensor.comfoair_return_air_level": { state: "60", attributes: {} },
        "sensor.comfoair_supply_air_level": { state: "60", attributes: {} },
        "binary_sensor.comfoair_bypass_open": { state: "off", attributes: {} },
        "sensor.comfoair_filter_status": { state: "OK", attributes: {} },
        "binary_sensor.comfoair_summer_mode": { state: "off", attributes: {} },
        ...overrideStates
      };

      return {
        states,
        callService: (domain, service, data) => {
          console.log(\`[Mock HA] Call Service: \${domain}.\${service}\`, data);
          if (service === "set_fan_mode" && data.fan_mode) {
            states["climate.comfoair"].attributes.fan_mode = data.fan_mode;
            updateCards();
          }
        }
      };
    }

    const mockWinter = createMockHass({});

    const mockSummer = createMockHass({
      "climate.comfoair": { state: "auto", attributes: { fan_mode: "high", temperature: 24 } },
      "sensor.comfoair_outside_temperature": { state: "18.5", attributes: {} },
      "sensor.comfoair_exhaust_temperature": { state: "26", attributes: {} },
      "sensor.comfoair_return_temperature": { state: "26", attributes: {} },
      "sensor.comfoair_supply_temperature": { state: "19", attributes: {} },
      "sensor.comfoair_intake_fan_rpm": { state: "1973", attributes: {} },
      "sensor.comfoair_exhaust_fan_rpm": { state: "1909", attributes: {} },
      "sensor.comfoair_return_air_level": { state: "80", attributes: {} },
      "sensor.comfoair_supply_air_level": { state: "80", attributes: {} },
      "binary_sensor.comfoair_bypass_open": { state: "on", attributes: {} },
      "binary_sensor.comfoair_summer_mode": { state: "on", attributes: {} },
      "sensor.comfoair_filter_status": { state: "OK", attributes: {} },
    });

    function updateCards() {
      const cardLight = document.getElementById("card-light");
      const cardDark = document.getElementById("card-dark");

      if (cardLight && cardDark) {
        cardLight.setConfig({ entity: "climate.comfoair" });
        cardLight.hass = mockWinter;

        cardDark.setConfig({ entity: "climate.comfoair" });
        cardDark.hass = mockSummer;
      }
    }

    window.addEventListener("hass-more-info", (e) => {
      console.log("[Mock HA] Open More Info Dialog:", e.detail);
      alert(\`[Mock HA] Opening info dialog for entity: \${e.detail.entityId}\`);
    });

    customElements.whenDefined('comfoair-card').then(() => {
      updateCards();
    });
  </script>
</body>
</html>
`;

writeFileSync(outFile, htmlTemplate, "utf8");
console.log(`[Preview Build] Preview HTML generated at ${outFile}`);

try {
  const previewPng = resolve(rootDir, "preview.png");
  execSync(`google-chrome --headless --disable-gpu --window-size=1020,550 --screenshot="${previewPng}" "file://${outFile}"`, { stdio: "ignore" });
  console.log(`[Preview Build] Preview screenshot saved to ${previewPng}`);
} catch (e) {
  // Ignore if chrome screenshot fails
}
