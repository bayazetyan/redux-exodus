---
id: get-started
title: Redux exodus
sidebar_label: Get Started
---

![npm](https://img.shields.io/npm/v/redux-exodus)
![npm](https://img.shields.io/npm/dt/redux-exodus)

This tool is used to manage the state of the application. This makes the state of the application more predictable and more powerful.

### Getting Started
 ```bash
npm install --save redux-exodus

 # or if you are use yarn

yarn add redux-exodus
 ``` 

### Recommended Structure

```
src
├── modules
│   ├── some-module.js
│   └── some1-module.js
├── store
│   ├── store.js
│   └── rootreducer.js
└── App.js
```

### Step 1: init

Init your default settings (not required). See about init on API [Exodus.init](/)

**index.js or App.js**

```javascript
import Exodus from 'redux-exodus'

Exodus.init({})
```
### Step 2: Create action and reducer
Configure your action (its very simple)

**module.js**

```javascript
import { createAction, createReducer } from 'redux-exodus';
import { getPosts } from './api'

const defaultState = {
  posts: []
}

const getPostsAction = createAction({
  key: 'posts',
  name: 'GET_POSTS',
  apiCall: getPosts,
})

// Export actions
export const actions = {
  getPosts: getPostsAction
}

// Init reducer
export default createReducer(actions, defaultState)

```
> Note: 

### Step 3: Init Root reducer

**rootReducer.js**

```javascript
import { combineReducers } from 'redux';
import MainReducer from './module'

const appReducer = combineReducers({
  main: MainReducer
});

export default appReducer;
```

### Step 4: Init Store

**store.js**

```javascript
import { createStore } from 'redux';

import rootReducer from './rootReducer';

export function initStore() {
  return createStore(rootReducer);
}
```

### Examples
* **[Counter](/)**
* **[Todos](/)**

### API
See **[redux-exodus API](/api/)**

### Changelog

See the **[CHANGELOG](/)** to see what's new.

Like this project? ★ us on GitHub
