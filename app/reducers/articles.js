import {combineReducers} from 'redux';
import {PUSH_ARTICLE, PUSH_ARTICLES} from '../actions/articles';

function list(state = {}, action) {
    switch (action.type) {
        case PUSH_ARTICLE: {
            return {
                ...state,
                [action.article._id]: action.article
            };
        }
        case PUSH_ARTICLES: {
            var articles = {};
            action.articles.forEach(article => {
                articles[article._id] = article;
            });
            return {
                ...state,
                ...articles
            };
        }
        default:
            return state;
    }
}

function ids(state = [], action) {
    switch (action.type) {
        case PUSH_ARTICLE: {
            return [...(new Set(state.concat([action.article._id])))];
        }
        case PUSH_ARTICLES: {
            var ids = action.articles.map(a => a._id);
            return [...(new Set(state.concat(ids)))];
        }
        default:
            return state;
    }
}

function parents(state = {}, action) {
    switch (action.type) {
        case PUSH_ARTICLE: {
            if (action.parent) {
                return {
                    ...state,
                    [action.parent]: [
                        ...state[action.parent],
                        action.article._id
                    ]
                }
            }
            return state;
        }
        case PUSH_ARTICLES: {
            if (action.parent) {
                var ids = action.articles.map(a => a._id);
                var parent = [];

                if (!state[action.parent]) {
                    parent = ids;
                } else {
                    parent = [
                        ...(new Set(state[action.parent].concat(ids)))
                    ]
                }

                return {
                    ...state,
                    [action.parent]: parent
                }
            }
            return state;
        }
        default:
            return state;
    }
}

export default combineReducers({
    list,
    ids,
    parents
})
