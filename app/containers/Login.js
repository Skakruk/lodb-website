import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {login} from '../actions/auth';
import {getUser} from '../actions/users';

class Login extends Component {
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    state = {
        data: {
            username: "",
            password: ""
        },
    };

    handleChange = (prop) => (e, value) => {
        this.setState({
            ...this.state,
            data: {
                ...this.state.data,
                [prop]: value
            }
        })
    };

    handleLogin = (e) => {
        e.preventDefault();
        this.props.login(this.state.data).then(() => {
            this.context.router.push("/admin");
            this.props.getUser();
        });
    };

    render() {
        return (
            <div className="row">
                <div className="col-md-2 col-md-offset-5">
                    <form onSubmit={this.handleLogin}>
                        <TextField
                            id="username"
                            name="username"
                            onChange={this.handleChange("username")}
                            fullWidth={true}
                            floatingLabelText="Username"
                        /><br/>
                        <TextField
                            id="password"
                            name="password"
                            onChange={this.handleChange("password")}
                            type="password"
                            fullWidth={true}
                            floatingLabelText="Password"
                        /><br/>
                        <RaisedButton
                            type="submit"
                            onTouchTap={this.handleLogin} label="Login" primary={true}/>
                    </form>
                </div>
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        login,
        getUser
    }, dispatch);
}

export default connect(undefined, mapDispatchToProps)(Login);