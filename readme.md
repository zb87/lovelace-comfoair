# Home Assistant ComfoAir Card

![Image](https://raw.githubusercontent.com/zb87/lovelace-comfoair/main/preview.png)

## Configuration Options

| Name         | Type    | Default | Description                                       |
| ------------ | ------- | ------- | ------------------------------------------------- |
| `type`       | string  | N/A     | Must be `custom:vertical-stack-in-card`.          |
| `entity`     | list    | N/A     | The entity ID of the ConfoAir HVAC.               |

## Installation

### HACS

1. Open HACS in Home Assistant.
1. Add custom repo https://github.com/zb87/lovelace-comfoair with type "dashboard".
1. Install and follow the setup instructions.

### Manually

1. Copy the `lovelace-comfoair` directory to the `www` directory of Home Assistant config directory
1. Home Assistant -> Settings -> Dashboards -> "..." button -> Resources
1. Add a JavaScript module resource with the path `/local/lovelace-comfoair/comfoair-card.js`
1. In Home Assistant dashboard page, add a card with the following config:

```
- type: custom:comfoair-card
  entity: <Entity ID starts with climate>
```

## Relevant projects

The code is based on the following GitHub projects:

* https://github.com/wichers/lovelace-comfoair