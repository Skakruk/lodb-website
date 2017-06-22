import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getUser} from '../actions/users';

class App extends Component {
    render() {
        return (<div> {this.props.children} </div>)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getUser
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        user: state.user.user
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(App);