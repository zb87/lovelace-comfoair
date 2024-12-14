import {
  LitElement,
  html,
  css
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";


class ComfoAirCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {}
    };
  }

  render() {
    return html`
    <ha-card>
      <div class="container">
        <div class="bg">
          <div class="flex-container">
            <div class="flex-col-out">
              <div>${this.hass.states['sensor.outside_temperature'].state}°C</div>
              <div class="fan-state"><ha-icon icon="mdi:speedometer"></ha-icon></ha-icon> ${Math.trunc(this.hass.states['sensor.intake_fan_rpm'].state)} rpm</div>
              <div>${this.hass.states['sensor.exhaust_temperature'].state}°C</div>
              <div class="fan-state"><ha-icon icon="mdi:speedometer"></ha-icon> ${Math.trunc(this.hass.states['sensor.exhaust_fan_rpm'].state)} rpm</div>
            </div>
            <div class="flex-col-main">
              <div><ha-icon class="spin" icon="mdi:${({'auto': 'fan', 'off': 'fan-off', low: 'fan-speed-1', medium: 'fan-speed-2', high: 'fan-speed-3'}[this.hass.states[this.config.entity].attributes.fan_mode])}"></ha-icon></div>
              <div>
                ${this.getAirFilterTmpl()}
                ${this.getBypassTmpl()}
                ${this.getSummerModeTmpl()}
              </div>
            </div>
            <div class="flex-col-in">
              <div>${this.hass.states['sensor.return_temperature'].state}°C</div>
              <div class="fan-state"><ha-icon icon="mdi:fan"></ha-icon> ${Math.trunc(this.hass.states['sensor.return_air_level'].state)}%</div>
              <div>${this.hass.states['sensor.supply_temperature'].state}°C</div>
              <div class="fan-state"><ha-icon icon="mdi:fan"></ha-icon> ${Math.trunc(this.hass.states['sensor.supply_air_level'].state)}%</div>
            </div>
          </div>
        </div>
      </div>
    </ha-card>
    `;
  }

  getAirFilterTmpl(){
    if(this.hass.states['sensor.filter_status'].state == 'Full'){
      return html`<ha-icon class="warning" icon="mdi:air-filter"></ha-icon>`;
    }else{
      return html`<ha-icon class="inactive" icon="mdi:air-filter"></ha-icon>`;
    }
  }

  getBypassTmpl(){
    if(this.hass.states['binary_sensor.bypass_open'].state == 'on'){
      return html`<ha-icon icon="mdi:electric-switch"></ha-icon>`;
    }else{
      return html`<ha-icon class="inactive" icon="mdi:electric-switch"></ha-icon>`;
    }
  }

  getSummerModeTmpl(){
    if(this.hass.states['binary_sensor.summer_mode'].state == 'off'){
      return html`<ha-icon icon="mdi:snowflake"></ha-icon>`;
    }else{
      return html`<ha-icon class="inactive" icon="mdi:weather-sunny"></ha-icon>`;
    }
  }

  setConfig(config) {
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 7;
  }

  static get styles() {
    return css`
    .container {
      padding: 10px;
    }
    .bg {
      background-image: url(/local/lovelace-comfoair/comfoair_heat.png);
      height: 200px;
      background-size: 100% 75%;
      background-repeat: no-repeat;
      background-position-y: 45%;
    }
    .flex-container {
        display: flex;
        justify-content: space-between;
        height: 100%;
    }
    .flex-col-main {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 30px 0px;
      font-size: x-large;
      text-align: center;
      font-weight:bold;
      flex-grow: 1;
      flex-basis: 0;
    }
    .flex-col-out {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-grow: 1;
      flex-basis: 0;
      text-align: left;
    }
    .flex-col-in {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-grow: 1;
      flex-basis: 0;
      text-align: right;
    }
    .fan-state {
      padding-top: 15px;
    }

    .inactive {
      opacity: 0.7;
    }

    .warning {
      color: color: #d80707db;
    }
    `;
  }
}
customElements.define("comfoair-card", ComfoAirCard);
