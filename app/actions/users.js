import * as api from "./api";
import {saveState} from '../store/persistentState';

export const FETCH_USER = 'FETCH_USER';

export function getUser() {
    return (dispatch, getState) => dispatch(api.get(`/user`))
        .then(response => {
            dispatch({
                type: FETCH_USER,
                user: response
            });

            saveState({
                user: getState().user
            });
        })
}