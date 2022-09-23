import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from "redux-devtools-extension";
// import { createStore, compose } from "redux";


import rootReducer from "./reducer";

const composedEnhancer = composeWithDevTools(applyMiddleware(thunkMiddleware))

// The store now has the ability to accept thunk (a code that delays) functions
const store = createStore(rootReducer, composedEnhancer)

export default store