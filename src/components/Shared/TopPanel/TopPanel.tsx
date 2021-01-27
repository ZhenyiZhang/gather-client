import React, { Component } from 'react';

import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Collapse,
  NavbarToggler,
} from 'reactstrap';
import OrganizationStateInterface from '../../../store/interface/OrganizationState.interface';

import UserInfo from '../UserInfo/UserInfo';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Home/EventsPanel/UserInfo/UserInfo.css';

interface Props {
  organization: OrganizationStateInterface;
}

class TopPanel extends Component<Props> {
  state = {
    collapse: false,
    dropdownOpen: false,
  };

  render() {
    return (
      <div>
        <Navbar fixed="top" color="dark" dark expand="md">
          <NavbarBrand className="NavBarBrand">Gather</NavbarBrand>
          <NavbarToggler
            onClick={() => {
              this.setState({ collapse: !this.state.collapse });
            }}
            className="mr-2"
          />
          <Collapse isOpen={this.state.collapse} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink href="https://github.com/ZhenyiZhang/gather-client">
                  GitHub
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/signUp">Create my account</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <UserInfo
          organizationName={this.props.organization.name}
          description={this.props.organization.description}
        />
      </div>
    );
  }
}

export default TopPanel;
