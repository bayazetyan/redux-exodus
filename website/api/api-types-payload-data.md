---
id: api-types-payload-data
title: Payload Data
sidebar_label: Payload Data
---------------------

### payload

| Type | Default | Description |
|:-----|:--------|:------------|
| any  | -       | -           |


### status

| Type   | Default | Description                                  |
|:-------|:--------|:---------------------------------------------|
| number | -       | Response status, for more info see [here](/) |

```typescript

enum PAYLOAD_STATUS {
  ERROR,   // 0
  PENDING, // 1
  SUCCESS, // 2
  RESTORE, // 3
}
```

### error

| Type | Default | Description         |
|:-----|:--------|:--------------------|
| any  | -       | Response error data |
