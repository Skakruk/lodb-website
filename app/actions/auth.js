import * as api from "./api";
import {saveState} from '../store/persistentState';

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const INVALID_TOKEN = 'INVALID_TOKEN';


export function login(data) {
    return (dispatch, getState) => dispatch(api.post(`/auth/token`, data))
        .then(response => {
            dispatch({
                type: LOGIN_SUCCESS,
                token: response.token
            });

            saveState({
                user: {
                    auth: getState().user.auth
                }
            });
        })
}