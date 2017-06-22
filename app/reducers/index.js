import {combineReducers} from 'redux';
import {routerReducer as routing} from 'react-router-redux';
import articles from './articles';
import user from './user';

const rootReducer = combineReducers({
    routing,
    articles,
    user
});

export default rootReducer;