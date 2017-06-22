import * as api from "./api";

export const PUSH_ARTICLE = "PUSH_ARTICLE";

export function getArticleByUrl(url) {
    return dispatch => {
        var articleId = dispatch(findArticleInCacheByUrl(url));
        if (!articleId) {
            return dispatch(api.get(`/articles?url=${url}`))
                .then(response => {
                    dispatch({
                        type: PUSH_ARTICLE,
                        article: response[0]
                    });
                    return response[0]._id
                });
        } else {
            return Promise.resolve(articleId);
        }
    }
}

export const PUSH_ARTICLES = "PUSH_ARTICLES";

export function getArticlesByParentIdAndType(id, types) {
    return dispatch => dispatch(api.get(`/articles?parent=${id}&type=${types.join(',')}`))
        .then(response => {
            dispatch({
                type: PUSH_ARTICLES,
                articles: response,
                parent: id
            });
        });
}

export function findArticleInCacheByUrl(url) {
    return (dispatch, getState) => {
        var state = getState().articles;
        return state.ids.find(id => state.list[id].url === url)
    }
}

export function getArticle(id) {
    return dispatch => dispatch(api.get(`/articles/${id}`))
        .then(response => {
            dispatch({
                type: PUSH_ARTICLE,
                article: response
            });
        });
}

export function saveArticle(data) {
    return dispatch => dispatch(data._id ? api.put(`/articles/${data._id}`, data) : api.post(`/articles`, data))
        .then(response => {
            dispatch({
                type: PUSH_ARTICLE,
                article: response
            });
        });
}

export function getParentArticle(id) {
    return dispatch => dispatch(api.get(`/articles?children=${id}`))
        .then((response) => {
            dispatch({
                type: PUSH_ARTICLES,
                articles: response
            });
        });
}

export function getArticlesTree(where) {
    var query = "";
    if (where) {
        query = Object.keys(where).reduce((query, key) => {
            query.push(`${encodeURIComponent(key)}=${encodeURIComponent(where[key])}`);
            return query;
        }, []).join("&")
    }
    return dispatch => dispatch(api.get(`/articles/tree${(query.length > 0 ? `?${query}` : "")}`));
}
