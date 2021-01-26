import React, { Component } from 'react';

import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Collapse,
  NavbarToggler,
  Button,
  Card,
  CardBody,
} from 'reactstrap';
import OrganizationStateInterface from '../../../store/interface/OrganizationState.interface';

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
        <div>
          <div className="TopPanelControl">
            <h2>{this.props.organization.organizationName}</h2>
            <Button
              color="primary"
              onClick={() => {
                this.setState({ dropdownOpen: !this.state.dropdownOpen });
              }}
              className="ButtonAbout"
            >
              About
            </Button>
            <Collapse className="Collspse" isOpen={this.state.dropdownOpen}>
              <Card className="Card">
                <CardBody>{this.props.organization.description}</CardBody>
              </Card>
            </Collapse>
          </div>
        </div>
      </div>
    );
  }
}

export default TopPanel;
