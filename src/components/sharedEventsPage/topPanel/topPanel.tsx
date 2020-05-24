import React from 'react';
import {Component }from 'react';
import OrganizationStateInterface from '../../../store/interface/OrganizationState.interface';

import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Collapse, NavbarToggler
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import './topPanel.css';


interface Props {
    organization: OrganizationStateInterface
}

class TopPanel extends Component<Props> {
    state = {
        collapse: false
    };
    render() {
        return(
            <div className="topPanel">
                <Navbar fixed="top" color="dark" dark expand="md">
                    <NavbarBrand className="NavBarBrand">{this.props.organization.name}</NavbarBrand>
                    <NavbarToggler onClick={() => {this.setState({collapse: !this.state.collapse})}} className="mr-2" />
                    <Collapse isOpen={this.state.collapse} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink href="https://github.com/ZhenyiZhang/gather-client">GitHub</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/signUp" >Create new account</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

export default TopPanel;