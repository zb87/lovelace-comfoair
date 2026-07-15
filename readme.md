# Home Assistant ComfoAir Card

![Image](https://raw.githubusercontent.com/zb87/lovelace-comfoair/main/preview.png)

## Configuration Options

| Name            | Type   | Default      | Description                                       |
| --------------- | ------ | ------------ | ------------------------------------------------- |
| `type`          | string | N/A          | Must be `custom:comfoair-card`.                   |
| `entity`        | string | N/A          | The entity ID of the ComfoAir HVAC climate entity.|
| `entity_prefix` | string | `"comfoair"` | Prefix for all sensor/binary_sensor entity IDs.   |

## Installation

### HACS

1. Open HACS in Home Assistant.
1. Add custom repo https://github.com/zb87/lovelace-comfoair with type "dashboard".
1. Install and follow the setup instructions.

### Manually

1. Download `comfoair-card.js` from the [latest release](https://github.com/zb87/lovelace-comfoair/releases/latest)
1. Copy it to the `www/community/lovelace-comfoair/` directory of your Home Assistant config
1. Home Assistant -> Settings -> Dashboards -> "..." button -> Resources
1. Add a JavaScript module resource with the path `/local/community/lovelace-comfoair/comfoair-card.js`

## Add to dashboard

In Home Assistant dashboard page, add a card with the following config:

```yaml
- type: custom:comfoair-card
  entity: <Entity ID starts with climate>
  entity_prefix: comfoair  # optional, defaults to "comfoair"
```

## Development

### Prerequisites

- Node.js 24+ (see `.nvmrc`)

### Setup

```bash
npm install
```

### Build

```bash
npm run build    # Production build → dist/comfoair-card.js
npm run dev      # Watch mode (rebuilds on file changes)
npm run lint     # Type-check without emitting
```

### Local testing

Use the `pull_from_ai.sh` script from your HA server to pull the built card:

```bash
./pull_from_ai.sh
```

Then hard-refresh your HA dashboard (Ctrl+Shift+R).

### Releasing

Tag a new version to trigger the GitHub Actions release workflow:

```bash
git tag v0.6.0
git push origin v0.6.0
```

This builds the card and creates a GitHub release with the bundled JS file.

## Relevant projects

The code is based on the following GitHub projects:

* https://github.com/wichers/lovelace-comfoair