import React, {Component} from 'react';
import TopPanel from '../../components/Home/TopPanel/TopPanel';
import EventsPanel from '../../components/Home/EventsPanel/EventsPanel';
import {connect} from "react-redux";
import OrganizationStateInterface from "../../store/interface/OrganizationState.interface";
import {Redirect, Route, Switch} from "react-router-dom";
import ProfilePage from "../profile/profilePage";
import getProfileInstance from "../../lib/apisInstances/getProfile";
import LogoutInstance from "../../lib/apisInstances/logout";
import {Dispatch} from "redux";
import getProfileAction from "../../components/Home/TopPanel/actions/getProfileAction";

import {Collapse, Nav, Navbar, NavbarBrand, NavbarText, NavbarToggler, NavItem, NavLink} from "reactstrap";
import './home.css';

interface Props {
    organization: OrganizationStateInterface,
    cookies: any,
    getProfileDispatch: (organizationData: OrganizationStateInterface) => void
}

class Home extends Component<Props> {
    state = {
        logOut: false,
        collapse: false
    };

    /*get user profile data*/
    componentDidMount(): void {
        /*if no AccessToken, redirect to login page*/
        if(!this.props.cookies.get('AccessToken')) {
            window.location.href="/login";
            return;
        }
        /*request user profile data from server*/
        getProfileInstance.get('',
            {headers:{Authorization: 'Bearer ' + this.props.cookies.get('AccessToken')}})
            .then(res => {
                const profile: OrganizationStateInterface = res.data;
                console.log(profile);
                this.props.getProfileDispatch(profile);})
            .catch(() => {
                this.props.cookies.remove('AccessToken');
                this.setState({logOut: true});
                window.location.href="/login";
                alert('failed to access user profile');
            });
    }

    logOutHandler = async() => {
        LogoutInstance.get('',
            {headers:{Authorization: 'Bearer ' + this.props.cookies.get('AccessToken')}})
            .then(() => {this.props.cookies.remove('AccessToken');
                this.setState({logOut: true});
                window.location.href="/login";})
            .catch(err => {window.location.href="/login";
                alert(err);});
    };

    render() {
        return(
            <div>
                {this.state.logOut ? <Redirect to='/' exact/> : null}
                <Navbar fixed="top" color="dark" dark expand="md">
                    <NavbarBrand className="NavBarBrand">Gathering</NavbarBrand>
                    <NavbarToggler onClick={() => {this.setState({collapse: !this.state.collapse})}} className="mr-2" />
                    <Collapse isOpen={this.state.collapse} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink href="/main">Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/main/profile">Profile</NavLink>
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
                        <TopPanel/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);