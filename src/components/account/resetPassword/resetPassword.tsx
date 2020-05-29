import React, { Component } from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Button, Badge} from "reactstrap";
import resetPasswordRequest from "../../../apisInstances/resetRequst";
import updatePasswordInstance from "../../../apisInstances/updatePassword";
import '../auth.css';

class ResetPassword extends Component {
    state = {
        email: '',
        password: '',
        passwordConfirm: '',
        collapse: false
    };

    sendEmailHandler = () => {
        resetPasswordRequest.post('', {email: this.state.email})
            .then(() => {alert('the email was sent')})
            .catch((err) => {alert(err)})
    };

    passwordOnChangeHandler = (token: string) => {
        updatePasswordInstance.post('', {password: this.state.password},
            {headers:{Authorization: 'Bearer ' + token}})
            .then(() => {window.location.href="/login"})
            .catch((err) => {alert(err)});
    };

    render() {
        return(
            <div>
                <Navbar fixed="top" color="dark" dark expand="md">
                    <NavbarBrand className="NavBarBrand">Gathering</NavbarBrand>
                    <NavbarToggler onClick={() => {this.setState({collapse: !this.state.collapse})}} className="mr-2" />
                    <Collapse isOpen={this.state.collapse} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink href="/signUp">Sign Up</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/Login">Log In</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="https://github.com/ZhenyiZhang/gather-client">GitHub</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
                <Switch>
                    <Route path="/reset" exact>
                        <div className="form">
                            <input type="Email"
                                   onChange={(event) => {
                                       this.setState({ email: event.currentTarget.value})
                                   }}
                                   placeholder="Registered email address"/>
                            <Button color="info"
                                    onClick={this.sendEmailHandler}>
                                Send Reset Password Email</Button>
                        </div>
                    </Route>
                    <Route path="/reset/:resetToken" render={({match}) => (
                        <div className="form">
                            <input type="password"
                                   onChange={(event) => {
                                       this.setState({ password: event.currentTarget.value})}}
                                   placeholder="password"/>
                            <input type="password"
                                   onChange={(event) => {
                                       this.setState({ passwordConfirm: event.currentTarget.value})}}
                                   placeholder="confirm password"/>
                            <Button color="info"
                                    onClick={() => {this.passwordOnChangeHandler(match.params.resetToken)}}>
                                Change Password</Button>
                        </div>
                    )}/>
                </Switch>
            </div>
        );
    }
}

export default ResetPassword;