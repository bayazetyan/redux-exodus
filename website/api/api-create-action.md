---
id: create-action
title: Create Action
sidebar_label: Create Action
---

#### Parameters
| Name     | Required | Type              | Description            |
|:---------|:---------|:------------------|:-----------------------|
| Settings | `true`   | [Settings](/api/) | Action settings object |


```javascript
createAction({
  key: 'data',
  name: 'ACTION_NAME',
}) 
```


## Settings

### name

| Type   | Default | Required | Description         |
|:-------|:--------|:---------|:--------------------|
| String | -       | Yes      | The action name.    |

### key

| Type   | Default | Required | Description                                          |
|--------|---------|----------|------------------------------------------------------|
| String | -       | No       | The name of the key in which the data will be stored |


### keys

| Type   | Default | Required | Description                               |
|--------|---------|----------|-------------------------------------------|
| String | -       | No       | Stored data key when need find nested key |


### forceUpdate

| Type    | Default | Required | Description |
|:--------|:--------|:---------|:------------|
| Boolean | -       | No       | ----        |

### persists

| Type    | Default | Required | Description                                                             |
|:--------|:--------|:---------|:------------------------------------------------------------------------|
| Boolean | `false` | No       | Stores data from store to localStorage on web and asyncStorage on mobile |


### apiCall

|Type            | Default | Required                      | Description                 |
|----------------|---------|-------------------------------|-----------------------------|
|Function        | -       | No                            | This is an API call function, that returns a Promise (required). If you want to update the store without a request to the server you can skip this property             |

### merge

```javascript
createAction({
  // ...other options
  merge: (...args) => {
    // your api call arguments goes here `args` 
    
    return // your logic here
  } 
})
```

| Type     | Default | Required | Description                                                                                   |
|:---------|:--------|:---------|:----------------------------------------------------------------------------------------------|
| Function | -       | No       | This function return `boolean` and if it true after every call will be override existing data |

### reuducer
If you need control reducer yourself you can use this method

#### Parameters
| Name   | Required | Type            | Description   |
|:-------|:---------|:----------------|:--------------|
| state  | `true`   | Object          | State object  |
| action | `true`   | [Action](/api/api-types-action) | Action object |

```javascript
createAction({
  // ...other options
  key: 'yourKey',
  reducer: (state, action) => {
    return {
      ...state,
      yourKey: {
        ...state.yourKey,
        ...action.data 
      }
    }
  } 
})
```

### onSuccess
This function calls every time after a successful response

#### Parameters
| Name | Required | Type                    | Description                         |
|:-----|:---------|:------------------------|:------------------------------------|
| data | `false`  | [EventArguments](/api/) | Event arguments result and dispatch |

```javascript
createAction({
  // ...other options
  onSuccess: ({ result, dispatch }) => {
    // ... do something here
  } 
})
```

### onError
This function calls every time after a error response

#### Parameters
| Name | Required | Type                    | Description                         |
|:-----|:---------|:------------------------|:------------------------------------|
| data | `false`  | [EventArguments](/api/) | Event arguments result and dispatch |

```javascript
createAction({
  // ...other options
  onError: ({ result, dispatch }) => {
    // ... do something here
  } 
})
```

## Methods

### restore
Call action and restore your data and set default value

```javascript
yourAction.restore()
```

### delay

#### Parameters
| Name     | Required | Type   | Description    |
|:---------|:---------|:-------|:---------------|
| duration | `true`   | number | Delay duration |

```javascript
yourAction.delay(1000)

// if you need call with other arguments
yourAction.delay(1000, arg1, arg2, /* ... */)
```
### withCallback

#### Parameters
| Name     | Required | Type   | Description    |
|:---------|:---------|:-------|:---------------|
| duration | `true`   | number | Delay duration |

```javascript
yourAction.withCallback(() => {
  // callback function
})

// if you need call with other arguments
yourAction.withCallback( arg1, arg2, /* ... */, () => {
  // callback function
})
```
