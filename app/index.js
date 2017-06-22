import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router, browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import routes from './routes';
import configureStore from './store/configureStore';
import {loadState} from './store/persistentState';
import './app.global.css';

injectTapEventPlugin();

const store = configureStore(loadState());
const history = syncHistoryWithStore(browserHistory, store);

render(
    <Provider store={store}>
        <Router history={history} routes={routes(store)}/>
    </Provider>,
    document.getElementById('root')
);
