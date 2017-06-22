import {combineReducers} from 'redux';
import {LOGIN_SUCCESS} from '../actions/auth';
import {FETCH_USER} from '../actions/users';

function auth(state = {
    token: null
}, action) {
    switch (action.type) {
        case LOGIN_SUCCESS: {
            return {
                ...state,
                token: action.token
            };
        }
        case FETCH_USER: {
            return {
                ...state,
                user: action.user
            };
        }
        default:
            return state;
    }
}

function user(state = {}, action) {
    switch (action.type) {
        case FETCH_USER: {
            return {
                ...state,
                ...action.user
            };
        }
        default:
            return state;
    }
}

export default combineReducers({
    auth,
    user
})