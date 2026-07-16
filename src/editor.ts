import { LitElement, html } from "lit";
import type { TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { ComfoAirCardConfig, HomeAssistant } from "./types";
import { localize } from "./localize/localize";

const EDITOR_TAG = "CARD_TAG_PLACEHOLDER-editor";

@customElement(EDITOR_TAG)
export class ComfoAirCardEditor extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private _config?: ComfoAirCardConfig;

  setConfig(config: ComfoAirCardConfig): void {
    this._config = config;
  }

  private _valueChanged(ev: CustomEvent): void {
    if (!this._config || !this.hass) return;
    const value = ev.detail?.value;
    if (!value) return;

    this._config = {
      ...this._config,
      ...value,
    };

    const event = new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

    const schema = [
      {
        name: "entity",
        label: localize("editor.entity", this.hass, this._config),
        selector: { entity: { domain: "climate" } },
      },
      {
        name: "entity_prefix",
        label: localize("editor.entity_prefix", this.hass, this._config),
        helper: localize("editor.entity_prefix_helper", this.hass, this._config),
        selector: { text: {} },
      },
      {
        name: "lang",
        label: localize("editor.lang", this.hass, this._config),
        helper: localize("editor.lang_helper", this.hass, this._config),
        selector: { text: {} },
      },
    ];

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${schema}
        .computeLabel=${(s: { label?: string; name: string }) =>
          s.label || s.name}
        .computeHelper=${(s: { helper?: string }) => s.helper || ""}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }
}

export function registerEditor(): void {
  if (typeof window !== "undefined" && !customElements.get(EDITOR_TAG)) {
    customElements.define(EDITOR_TAG, ComfoAirCardEditor);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "comfoair-card-editor": ComfoAirCardEditor;
    "comfoair-card-test-editor": ComfoAirCardEditor;
  }
}
