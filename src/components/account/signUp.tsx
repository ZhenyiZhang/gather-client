import React from 'react';
import {Component }from 'react';
import './auth.css';
import signUpInterface from './interface/signUp.interface'
import signUpInstance from '../../apisInstances/signUp';
import displayOption from './constants/signUpDisplayOption'
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Badge} from "reactstrap";


class SignUp extends Component {
    state = {
        username: '',
        password: '',
        passwordConfirm: '',
        description: '',
        organizationName: '',
        warning: '',
        componetDisplay: displayOption.auth,
        collapse: false
    };

    usernameOnChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            username: event.currentTarget.value
        });
    };

    passwordOnChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            password: event.currentTarget.value
        });
    };

    passwordConfirmOnChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            passwordConfirm: event.currentTarget.value
        });
    };

    organizationNameChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            organizationName: event.currentTarget.value
        });
    };

    descriptionOnChangeHandler = (event: React.FormEvent<HTMLTextAreaElement>) => {
        this.setState({
            description: event.currentTarget.value
        });
    };

    authHandler = async() => {
        if(this.state.password !== this.state.passwordConfirm) {
            this.setState({
                warning: 'Passwords are not matched, please check'
            })
            return;
        }
        this.setState({componetDisplay: displayOption.description})
    };

    signUpHandler = async() => {
        const  organization: signUpInterface = {
            name: this.state.username,
            password: this.state.password,
            description: this.state.description,
            organizationName: this.state.organizationName,
        };
        signUpInstance.post('', organization)
            .then(() => {this.setState({
                componetDisplay: displayOption.done
            })})
    };

    render() {
        let showComponent;
        switch (this.state.componetDisplay) {
            case displayOption.auth:
                showComponent = (
                    <div className="form">
                        <h2><Badge color="info">Step 1</Badge></h2> <br/>
                        <p>Your user name for log in and password</p>
                        <input key='username' type="text" onChange={this.usernameOnChangeHandler} placeholder="username"/>
                        <input key='password' type="password" onChange={this.passwordOnChangeHandler} placeholder="password"/>
                        <input key='passwordConfirm' type="password" onChange={this.passwordConfirmOnChangeHandler}
                               placeholder="confirm password"/>
                        <button onClick={this.authHandler}>Next</button>
                        <p className="message">Already has an account? Go to <a href="/login">Log In</a></p>
                        <p className="warning">{this.state.warning}</p>
                    </div>)
                break;

            case displayOption.description:
                showComponent = (
                    <div className="form">
                        <h2><Badge color="info">Step 2</Badge></h2> <br/>
                        <p>What is your group/organization name ?</p>
                        <input key='organizationName' className="text" onChange={this.organizationNameChangeHandler} placeholder="group/organization name"/>
                        <p>write a short description about your group/organization</p>
                        <textarea className="description" onChange={this.descriptionOnChangeHandler} placeholder="description"/>
                        <p className="message">Already has an account? Go to <a href="/login">Log In</a></p>
                        <button onClick={this.signUpHandler}>Sign Up</button>
                    </div>);
                break;

            case displayOption.done:
                showComponent = (
                    <div className="form">
                        <h2><Badge color="info">You are all set</Badge></h2> <br/>
                        <p className="message">Go to <a href="/login">Log In</a></p>

                    </div>
                );
                break;
        }

        return(
            <div>
                <Navbar fixed="top" color="dark" dark expand="md">
                    <NavbarBrand className="NavBarBrand">Gathering</NavbarBrand>
                    <NavbarToggler onClick={() => {this.setState({collapse: !this.state.collapse})}} className="mr-2" />
                    <Collapse isOpen={this.state.collapse} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink href="/login">Log In</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="https://github.com/ZhenyiZhang/gather-client">GitHub</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
                {showComponent}
            </div>
        );
    }
}

export default SignUp;