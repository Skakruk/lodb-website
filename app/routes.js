import React from 'react';
import {Route, IndexRoute, IndexRedirect} from 'react-router';
import App from './containers/App';
import Admin from './containers/Admin';
import Article from './containers/Article';
import Login from './containers/Login';
import EditArticle from './containers/EditArticle';

export default function () {
    return (
        <Route path="/" component={App}>
            <IndexRoute component={Article}/>
            <Route path="**" component={Article}/>
        </Route>
    );
}
