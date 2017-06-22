import React, {Component} from 'react';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getUser} from '../actions/users';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import SiteStructure from '../components/SiteStructure';

class Admin extends Component {
    state = {
        menuOpen: false
    };

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    };

    componentWillMount() {
        this.props.getUser();
        if (location.pathname !== "/admin/login" && this.props.user.role !== "admin") {
            this.context.router.push("/admin/login");
        }
    }

    componentWillReceiveProps(newProps) {
        if (location.pathname !== "/admin/login" && newProps.user.role !== "admin") {
            this.context.router.push("/admin/login");
        }
    }

    handleMenuToggle = () => {
        this.setState({
            ...this.state,
            menuOpen: !this.state.menuOpen
        });
    }

    render() {
        var {user} = this.props;

        return (<div>
            <Helmet title="Адмін-панель - ЛОДБ"/>
            {user.role === "admin" && (<div>
                    <AppBar
                        title="Title"
                        onLeftIconButtonTouchTap={this.handleMenuToggle}
                    />
                    <Drawer
                        docked={false}
                        width={200}
                        open={this.state.menuOpen}
                        onRequestChange={this.handleMenuToggle}
                    >
                        <MenuItem onTouchTap={this.handleMenuToggle}>Menu Item</MenuItem>
                        <MenuItem onTouchTap={this.handleMenuToggle}>Menu Item 2</MenuItem>
                    </Drawer>
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-2">
                                <SiteStructure />
                            </div>
                            <div className="col-md-10">{this.props.children}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>)
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


export default connect(mapStateToProps, mapDispatchToProps)(Admin);