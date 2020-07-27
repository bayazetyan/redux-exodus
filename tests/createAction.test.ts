import configureStore from 'redux-mock-store'
import createAction from '../src/lib/createAction'
import createReducer from '../src/lib/createReducer'

const mockStore = configureStore();
const store = mockStore({ test: { payload: {} } });

describe('Actions without apiCall', () => {
    beforeEach(() => { // Runs before each test in the suite
        store.clearActions();
    });

    test('Update boolean value', () => {
        const expectedActions =
            {
              'data': { payload: 1, error: null, status: 2 },
              'type': 'UPDATE_SUCCESS',
            };

        // const actAction = createAction({
        //     name: 'UPDATE',
        //     key: 'test'
        // })(store.dispatch)
        const actAction = createAction({
            name: 'UPDATE',
            key: 'test'
        })

        const actions = {
            actAction,
        }

        const reducer = createReducer(actions, store.getState())
        actAction(store.dispatch)(1)
        const s = reducer(store.getState(), expectedActions)
        console.log('store.getState()', s);
        
        expect(store.getActions()).toEqual(expectedActions)
    })
})