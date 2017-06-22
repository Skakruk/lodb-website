import * as api from "./api";

export const PUSH_ARTICLE = "PUSH_ARTICLE";

export function getFolderTree() {
    return dispatch => {
        return dispatch(api.get(`/media/images/tree`))
            .then(response => {
                return response
            });
    }
}

export function addDirectory(data) {
    return dispatch => dispatch(api.post(`/media/directory`, data))
}

export function uploadFiles({files, parent}) {
    return dispatch => dispatch(api.upload(`/media/images`, {
        parent
    }, files))
}

export function deleteFile(id) {
    return dispatch => dispatch(api.remove(`/media/images/${id}`));
}