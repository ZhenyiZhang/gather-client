// eslint-disable-next-line
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Dispatch } from 'redux';
import {
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarText,
  NavbarToggler,
  NavItem,
  NavLink,
} from 'reactstrap';
import EventsPanel from '../../components/Home/EventsPanel/EventsPanel';
import OrganizationStateInterface from '../../store/interface/OrganizationState.interface';
import ProfilePage from '../profile/profilePage';
import getProfileInstance from '../../lib/apisInstances/getProfile';
import LogoutInstance from '../../lib/apisInstances/logout';
import getProfileAction from '../../components/Home/EventsPanel/UserInfo/actions/getProfileAction';

import './home.css';

interface Props {
  organization: OrganizationStateInterface;
  cookies: any;
  getProfileDispatch: (organizationData: OrganizationStateInterface) => void;
}

class Home extends Component<Props> {
  state = {
    logOut: false,
    collapse: false,
  };

  /* get user profile data */
  componentDidMount(): void {
    /* if no AccessToken, redirect to login page */
    if (!this.props.cookies.get('AccessToken')) {
      window.location.href = '/login';
      return;
    }
    /* request user profile data from server */
    getProfileInstance
      .get('', {
        headers: {
          Authorization: `Bearer ${this.props.cookies.get('AccessToken')}`,
        },
      })
      .then((res) => {
        const profile: OrganizationStateInterface = res.data;
        this.props.getProfileDispatch(profile);
      })
      .catch(() => {
        this.props.cookies.remove('AccessToken');
        this.setState({ logOut: true });
        window.location.href = '/login';
        alert('failed to access user profile');
      });
  }

  logOutHandler = async () => {
    LogoutInstance.get('', {
      headers: {
        Authorization: `Bearer ${this.props.cookies.get('AccessToken')}`,
      },
    })
      .then(() => {
        this.props.cookies.remove('AccessToken');
        this.setState({ logOut: true });
        window.location.href = '/login';
      })
      .catch((err) => {
        window.location.href = '/login';
        alert(err);
      });
  };

  render() {
    return (
      <div>
        {this.state.logOut ? <Redirect to="/" exact /> : null}
        <Navbar fixed="top" color="dark" dark expand="md">
          <NavbarBrand className="NavBarBrand">Gathering</NavbarBrand>
          <NavbarToggler
            onClick={() => {
              this.setState({ collapse: !this.state.collapse });
            }}
            className="mr-2"
          />
          <Collapse isOpen={this.state.collapse} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink href="/home">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/home/profile">Profile</NavLink>
              </NavItem>
            </Nav>
            <NavbarText className="LogOut" onClick={this.logOutHandler}>
              Log out
            </NavbarText>
          </Collapse>
        </Navbar>
        <Switch>
          <Route path="/home/profile" exact>
            <ProfilePage AccessToken={this.props.cookies.get('AccessToken')} />
          </Route>
          <Route path="" exact>
            <EventsPanel AccessToken={this.props.cookies.get('AccessToken')} />
          </Route>
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = (state: OrganizationStateInterface) => {
  return {
    organization: state,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getProfileDispatch: (organizationData: OrganizationStateInterface) => {
      const action: getProfileAction = {
        type: 'getProfile',
        organization: organizationData,
      };
      dispatch(action);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
