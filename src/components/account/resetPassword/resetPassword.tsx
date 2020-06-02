import React, { Component } from 'react';
import {Route, Switch} from "react-router-dom";
import resetPasswordRequest from "../../../apisInstances/resetRequst";
import updatePasswordInstance from "../../../apisInstances/updatePassword";

import {Spinner, Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Button} from "reactstrap";
import '../auth.css';

class ResetPassword extends Component {
    state = {
        email: '',
        password: '',
        passwordConfirm: '',
        collapse: false,
        warning: '',
        spinner: false,
    };

    sendEmailHandler = () => {
        this.setState({spinner: true});
        resetPasswordRequest.post('', {email: this.state.email})
            .then(() => {
                this.setState({spinner: false});
                alert('the email was sent');})
            .catch((err) => {
                this.setState({spinner: false});
                alert(err)})
    };

    passwordOnChangeHandler = (token: string) => {
        if(this.state.password !== this.state.passwordConfirm) {
            this.setState({warning: 'Passwords are not matched, please check'});
            return;
        }
        updatePasswordInstance.post('', {password: this.state.password},
            {headers:{Authorization: 'Bearer ' + token}})
            .then(() => {window.location.href="/login"})
            .catch((err) => {alert(err)});
    };

    render() {
        return(
            <div>
                <Navbar fixed="top" color="dark" dark expand="md">
                    <NavbarBrand className="NavBarBrand">Gather</NavbarBrand>
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
                            <br/> <br/>
                            {this.state.spinner? (<Spinner color="secondary"/>) : null}
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
                            <p className="warning" color="danger">{this.state.warning}</p>
                        </div>
                    )}/>
                </Switch>
            </div>
        );
    }
}

export default ResetPassword;