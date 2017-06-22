import {INVALID_TOKEN} from './auth';

function request(url, options = {}, dispatch, getState) {
    let hasCanceled_ = false;
    let token = getState().user.auth.token;
    // let apiURL = getState().connectionSettings.apiUrl;
    let apiURL = 'http://localhost:3001';
    let tokenHeader = token ? {
        "Authorization": `Bearer ${token}`
    } : {};

    options = {
        ...options,
        headers: {
            "Accept": "application/json;charset=UTF-8",
            ...options.headers,
            ...tokenHeader
        }
    };


    return new Promise((resolve, reject) => fetch(apiURL + url, options)
        .then(response => {
            var responseData;
            if (/application\/json/.test(response.headers.get("Content-Type"))) {
                responseData = response.json();
            } else {
                responseData = response.text();
            }
            if (response && response.status >= 200 && response.status < 300) {
                return responseData.then(resp => resolve(resp));
            } else if (response.status === 401) {
                // session expired
                dispatch({
                    type: INVALID_TOKEN
                });


                // dispatch(addRequestForRetry({
                //     url,
                //     options,
                //     dispatch,
                //     getState,
                //     resolve,
                //     reject
                // }));

            } else {
                responseData.then(err => reject(err));
            }
        }));
}

function get(url, options) {
    return (dispatch, getState) => {
        return request(url, options, dispatch, getState)
    }
}

function post(url, data, options) {
    return (dispatch, getState) => {
        return request(url, {
            ...options,
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
            }
        }, dispatch, getState)
    }
}

function upload(url, data, fileList, options) {
    var formData = new FormData();

    if (fileList.length > 0) {
        Array.from(fileList).forEach(file => {
            formData.append('files[]', file);
        });
    }

    for (let field of Object.keys(data)) {
        formData.append(field, data[field]);
    }

    return (dispatch, getState) => {
        return request(url, {
            ...options,
            method: "POST",
            body: formData
        }, dispatch, getState)
    }
}

function put(url, data, options) {
    return (dispatch, getState) => request(url, {
        ...options,
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
        }
    }, dispatch, getState)
}

function remove(url, options) {
    return (dispatch, getState) => request(url, {
        ...options,
        method: "DELETE"
    }, dispatch, getState)
}

export {request, get, post, put, upload, remove}