---
id: main-settings
title: Main Settings
sidebar_label: Main settings
----------------------------


### handleResponse
If you need to globally handle the API call response manually and it will spread to all actions.

#### Parameters
| Name | Required | Type | Description       |
|:-----|:---------|:-----|:------------------|
| data | `true`   | any  | Api call response |

```javascript
Exodus.init({
  handleResponse: (data) => {
    // your code here
    return //....
  } 
})
```

### onError
The global error handler. This function will be call every time catch error in the action result

#### Parameters
| Name | Required | Type                           | Description                                     |
|:-----|:---------|:-------------------------------|:------------------------------------------------|
| data | `true`   | `{ name: string, error: any }` | `name: The action name, error: Any error data ` |

```javascript
Exodus.init({
  onError: ({ name, error }) => {
    // your code here
  } 
})
```
