import React, {Component} from 'react';
import TopPanel from './topPanel/topPanel';
import EventsPanel from './eventsPanel/eventsPanel';
import {connect} from "react-redux";
import OrganizationStateInterface from "../../store/interface/OrganizationState.interface";
import {Collapse, Nav, Navbar, NavbarBrand, NavbarText, NavbarToggler, NavItem, NavLink} from "reactstrap";
import {Redirect, Route, Switch} from "react-router-dom";
import ProfilePage from "./profilePage/profilePage";
import getProfileInstance from "../../apisInstances/getProfile";
import {Dispatch} from "redux";
import getProfileAction from "./topPanel/actions/getProfileAction";
import './main.css';

interface Props {
    organization: OrganizationStateInterface,
    cookies: any,
    getProfileDispatch: (organizationData: OrganizationStateInterface) => void
}

class Main extends Component<Props> {
    state = {
        logOut: false,
        collapse: false
    };

    componentDidMount(): void {
        getProfileInstance.get('',
            {headers:{Authorization: 'Bearer ' + this.props.cookies.get('AccessToken')}})
            .then(res => {
                const profile: OrganizationStateInterface = res.data;
                this.props.getProfileDispatch(profile);})
            .catch(() => {alert('failed to access user profile')});
    }

    logOutHandler = () => {
        this.props.cookies.remove('AccessToken');
        this.setState({logOut: true});
        window.location.href="/login";
    };

    render() {
        return(
            <div>
                {this.state.logOut ? <Redirect to='/' exact/> : null}
                <Navbar fixed="top" color="dark" dark expand="md">
                    <NavbarBrand className="NavBarBrand">{this.props.organization.organizationName}</NavbarBrand>
                    <NavbarToggler onClick={() => {this.setState({collapse: !this.state.collapse})}} className="mr-2" />
                    <Collapse isOpen={this.state.collapse} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink href="/main">Main</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/main/profile">Profile</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="https://github.com/ZhenyiZhang/gather-client">GitHub</NavLink>
                            </NavItem>
                        </Nav>
                        <NavbarText className="LogOut" onClick={this.logOutHandler}>
                            Log out
                        </NavbarText>
                    </Collapse>
                </Navbar>
                <Switch>
                    <Route path="/main/profile" exact>
                        <ProfilePage AccessToken={this.props.cookies.get('AccessToken')}/>
                    </Route>
                    <Route path="" exact>
                        <TopPanel cookies={this.props.cookies}/>
                        <EventsPanel AccessToken={this.props.cookies.get('AccessToken')}/>
                    </Route>
                </Switch>
            </div>
        );
    }
}

const mapStateToProps = (state: OrganizationStateInterface) => {
    return{
        organization: state
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return{
        getProfileDispatch: (organizationData: OrganizationStateInterface) => {
            const action: getProfileAction = {type: 'getProfile', organization: organizationData};
            dispatch(action);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);