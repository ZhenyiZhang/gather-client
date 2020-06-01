import React from 'react';
import {Component }from 'react';
import './auth.css';
import SignUpInterface from './interface/signUp.interface'
import signUpInstance from '../../apisInstances/signUp';
import verifyUserNameInstance from '../../apisInstances/verifyUserName'
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
        email: '',
        share: false,
        componentDisplay: displayOption.auth,
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

    emailOnChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
      this.setState({
          email: event.currentTarget.value
      })
    };

    shareHandler = (event: React.FormEvent<HTMLSelectElement>) => {
        event.currentTarget.value === 'Yes' ?
            this.setState({share: true}) :
            this.setState({share: false});
    };

    authHandler = () => {
        verifyUserNameInstance.post('', {userName: this.state.username, email: this.state.email})
            .then(() => {
                if(this.state.componentDisplay === displayOption.auth) {
                    if(this.state.password !== this.state.passwordConfirm) {
                        this.setState({
                            warning: 'Passwords are not matched, please check'
                        });
                        return;
                    }
                }
                this.setState({warning: null});
                this.setState({componentDisplay: this.state.componentDisplay + 1});
            })
            .catch((err) => {
                this.setState({warning: err.response.statusText});
                return;
            });
    };

    signUpHandler = async() => {
        const  organization: SignUpInterface = {
            name: this.state.username,
            password: this.state.password,
            description: this.state.description,
            organizationName: this.state.organizationName,
            share: this.state.share,
            email: this.state.email,
        };
        signUpInstance.post('', organization)
            .then(() => {this.setState({
                componentDisplay: displayOption.done
            })})
            .catch(err => {alert(err)});
    };

    render() {
        let showComponent;
        switch (this.state.componentDisplay) {
            case displayOption.auth:
                showComponent = (
                    <div className="form">
                        <h2><Badge color="info">Step 1</Badge></h2> <br/>
                        <p>Your user name for log in and password</p>
                        <input key='username' type="text"
                               onChange={this.usernameOnChangeHandler}
                               value={this.state.username}
                               placeholder="username"/>
                        <input key='email' type="email"
                               onChange={this.emailOnChangeHandler}
                               value={this.state.email}
                               placeholder="email"/>
                        <input key='password' type="password"
                               onChange={this.passwordOnChangeHandler}
                               value={this.state.password}
                               placeholder="password"/>
                        <input key='passwordConfirm' type="password"
                               onChange={this.passwordConfirmOnChangeHandler}
                               value={this.state.passwordConfirm}
                               placeholder="confirm password"/>
                        <button onClick={this.authHandler}>Next</button>
                        <p className="message">Already have an account? Go to <a href="/login">Log In</a></p>
                        <p className="warning">{this.state.warning}</p>
                    </div>);
                break;
            case displayOption.description:
                showComponent = (
                    <div className="form">
                        <h2><Badge color="info">Step 2</Badge></h2> <br/>
                        <p>What is your group/organization name ?</p>
                        <input key='organizationName' className="text"
                               onChange={this.organizationNameChangeHandler}
                               value={this.state.organizationName}
                               placeholder="group/organization name"/>
                        <p>write a short description about your group/organization</p>
                        <textarea className="description"
                                  onChange={this.descriptionOnChangeHandler}
                                  value={this.state.description}
                                  placeholder="description"/>
                        <button onClick={() => {this.setState({componentDisplay: this.state.componentDisplay - 1})}}>Go Back</button>
                        <br/><br/>
                        <button onClick={this.authHandler}>Next</button>
                        <p className="message">Already have an account? Go to <a href="/login">Log In</a></p>
                    </div>);
                break;
            case displayOption.share:
                showComponent = (
                    <div className="form">
                        <h2><Badge color="info">Step 3</Badge></h2> <br/>
                        <p>Do you want other people be able to see your events?</p>
                        <select key='organizationName' className="text"
                                onChange={this.shareHandler}
                                value={this.state.share? 'Yes' : 'No'}>
                            <option>Yes</option>
                            <option>No</option>
                        </select> <br/> <br/>
                        <button onClick={() => {this.setState({componentDisplay: this.state.componentDisplay - 1})}}>Go Back</button>
                        <br/><br/>
                        <button onClick={this.signUpHandler}>Sign Up</button>
                        <p className="message">Already have an account? Go to <a href="/login">Log In</a></p>
                    </div>
                );
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