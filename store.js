import { createStore, compose, applyMiddleware } from 'redux';
import { Platform } from 'react-native';
import rootReducer from './reducers/index';
import devTools from 'remote-redux-devtools';
import thunk from 'redux-thunk';

const enhancers = compose(
  applyMiddleware(thunk),
  devTools({
    name: Platform.OS,
    hostname: 'localhost',
    port: 5678
  })
)

const store = createStore(rootReducer, {}, enhancers);

if(module.hot) {
  module.hot.accept('./reducers/', () => {
    const nextRootReducer = require('./reducers/index').default;
    store.replaceReducer(nextRootReducer);
  });
}

export default store;
