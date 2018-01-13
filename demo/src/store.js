import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducer';

const middleware = [];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line no-underscore-dangle, no-undef

const store = createStore(
	reducer,
	// uncomment and add initial state to rehydrate
	composeEnhancers(applyMiddleware(...middleware))
);

export default store;