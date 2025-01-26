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
        <div class="${this.getBackgroundClass()}">
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

  getSummerModeTmpl(){
    if(this.hass.states['binary_sensor.summer_mode'].state == 'off'){
      return html`<ha-icon icon="mdi:snowflake"></ha-icon>`;
    }else{
      return html`<ha-icon class="inactive" icon="mdi:weather-sunny"></ha-icon>`;
    }
  }
  
  getBackgroundClass(){
    if (this.isBypass()) {
      return "bg-bypass";
    } else {
      return "bg-heat";
    }
  }
  
  isBypass() {
    return this.hass.states['binary_sensor.bypass_open'].state == 'on'
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
    .bg-heat {
      background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjA0Ljc3bW0iIGhlaWdodD0iNjUuNDA2bW0iIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDIwNC43NyA2NS40MDYiIHhtbDpzcGFjZT0icHJlc2VydmUiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSI+PHN0b3Agc3RvcC1jb2xvcj0iI2FjYmZlNSIgb2Zmc2V0PSIwIi8+PHN0b3Agc3RvcC1jb2xvcj0iI2ZlN2M3YyIgb2Zmc2V0PSIxIi8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImMiIHgxPSIyLjA2NzgiIHgyPSIyMDcuMjMiIHkxPSIzNi42MDkiIHkyPSIzNi42MDkiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoLjM3MDYyIC0uMzk2NDUpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeGxpbms6aHJlZj0iI2EiLz48bGluZWFyR3JhZGllbnQgaWQ9ImIiIHgxPSIyLjA2NzgiIHgyPSIyMDcuMjMiIHkxPSIzNi42MDkiIHkyPSIzNi42MDkiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgLTEgLjM3MDYyIDcyLjgyMSkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4bGluazpocmVmPSIjYSIvPjwvZGVmcz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMi42Mzg0IC0zLjUwOTUpIj48cGF0aCBkPSJtMi45Mzg0IDMuODA5NXYxNS40MjNoMzkuNDU1bDEyMi4yMyA0OS4zODNoNDIuNDg0di0xNS40NDNoLTM5LjQ1NGwtMTIyLjE4LTQ5LjM2M3oiIGZpbGw9InVybCgjYykiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIuNiIvPjxwYXRoIGQ9Im0yLjkzODQgNjguNjE1di0xNS40MjNoMzkuNDU1bDEyMi4yMy00OS4zODNoNDIuNDg0djE1LjQ0M2gtMzkuNDU0bC0xMjIuMTggNDkuMzYzeiIgZmlsbD0idXJsKCNiKSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9Ii42Ii8+PHBhdGggZD0ibTE4Ljc0NiA3Ljk5ODR2MS45MjU1aC0xMS40MDR2My40MDdoMTEuNDA0djEuOTI1NWw0LjQ5OTUtMy42MjkyeiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Im0xOTguMjMgNTcuMzMydjEuOTI1NWgtMTEuNDA0djMuNDA3aDExLjQwNHYxLjkyNTVsNC40OTk1LTMuNjI5MnoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJtMTkxLjMyIDcuOTk4NHYxLjkyNTVoMTEuNDA0djMuNDA3aC0xMS40MDR2MS45MjU1bC00LjQ5OTUtMy42MjkyeiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Im0xMS44NDEgNTcuMzMydjEuOTI1NWgxMS40MDR2My40MDdoLTExLjQwNHYxLjkyNTVsLTQuNDk5NS0zLjYyOTJ6IiBmaWxsPSIjZmZmIi8+PC9nPjwvc3ZnPgo=");
      height: 200px;
      background-size: 100% 75%;
      background-repeat: no-repeat;
      background-position-y: 45%;
    }
    .bg-bypass {
      background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjA0Ljc3bW0iIGhlaWdodD0iNjUuNDA2bW0iIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDIwNC43NyA2NS40MDYiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxwYXRoIGQ9Im0wLjMgMC4zdjE1LjQyM2gzOS40NTVsMTIyLjIzIDQ5LjM4M2g0Mi40ODR2LTE1LjQ0M2gtMzkuNDU0bC0xMjIuMTgtNDkuMzYzeiIgZmlsbD0iI2FjYmZlNSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9Ii42Ii8+PHBhdGggZD0ibTAuMyA2NS4xMDZ2LTE1LjQyM2gzOS40NTVsMTIyLjIzLTQ5LjM4M2g0Mi40ODR2MTUuNDQzaC0zOS40NTRsLTEyMi4xOCA0OS4zNjN6IiBmaWxsPSIjZmU3YzdjIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iLjYiLz48cGF0aCBkPSJtMTYuMTA4IDQuNDg4OXYxLjkyNTVoLTExLjQwNHYzLjQwN2gxMS40MDR2MS45MjU1bDQuNDk5NS0zLjYyOTJ6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0ibTE5NS41OSA1My44MjJ2MS45MjU1aC0xMS40MDR2My40MDdoMTEuNDA0djEuOTI1NWw0LjQ5OTUtMy42MjkyeiIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Im0xODguNjggNC40ODg5djEuOTI1NWgxMS40MDR2My40MDdoLTExLjQwNHYxLjkyNTVsLTQuNDk5NS0zLjYyOTJ6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0ibTkuMjAyNiA1My44MjJ2MS45MjU1aDExLjQwNHYzLjQwN2gtMTEuNDA0djEuOTI1NWwtNC40OTk1LTMuNjI5MnoiIGZpbGw9IiNmZmYiLz48L3N2Zz4K");
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
      flex-grow: 1;
      flex-basis: 0;
      text-align: center;
      padding: 30px 0px;
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
      opacity: 0.5;
    }

    .warning {
      color: #d80707db;
    }
    `;
  }
}
customElements.define("comfoair-card", ComfoAirCard);
