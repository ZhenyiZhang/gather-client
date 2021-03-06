// eslint-disable-next-line
import React, { Component } from 'react';

import {
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  Collapse,
  Spinner,
} from 'reactstrap';
import LoginInstance from '../../../lib/apisInstances/login';
import AccessInterface from '../../../store/interface/Access.interface';

import '../styles/auth.css';

interface Props {
  cookies: any;
}

class Login extends Component<Props> {
  state = {
    username: '',
    password: '',
    warning: '',
    collapse: false,
    spinner: false,
  };

  usernameOnChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      username: event.currentTarget.value,
    });
  };

  passwordOnChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    this.setState({
      password: event.currentTarget.value,
    });
  };

  loginHandler = async () => {
    const loginInfo = {
      username: this.state.username,
      password: this.state.password,
    };
    this.setState({ spinner: true });
    /* get access token */
    const response = await LoginInstance.post('', loginInfo).catch((err) => {
      this.setState({ warning: err.response.statusText });
      this.setState({ spinner: false });
    });
    /* log in failed */
    if (!response) return;
    const access: AccessInterface = response.data;
    const accessKey = access.AccessToken;
    /* store access token in cookies */
    const { cookies } = this.props;
    const cookieSet = await cookies.set('AccessToken', accessKey, {
      path: '/',
    });
    if (cookieSet) {
      this.setState({ redirectToMain: true });
    }
    this.setState({ spinner: false });
    window.location.href = '/main';
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
                <NavLink href="/signUp">Sign Up</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="https://github.com/ZhenyiZhang/gather-client">
                  GitHub
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <div className="form">
          <input
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                this.loginHandler();
              }
            }}
            type="text"
            onChange={this.usernameOnChangeHandler}
            placeholder="username or email"
          />
          <input
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                this.loginHandler();
              }
            }}
            type="password"
            onChange={this.passwordOnChangeHandler}
            placeholder="password"
          />
          <button onClick={this.loginHandler}>login</button>
          <p className="message">
            Not registered?
            <a href="/signup">Sign Up</a>
          </p>
          <p className="message">
            Forgot your password?
            <a href="/reset">Reset Password</a>
          </p>
          <p className="warning">{this.state.warning}</p>
          {this.state.spinner && <Spinner color="info" />}
        </div>
      </div>
    );
  }
}

export default Login;
