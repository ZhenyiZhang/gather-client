import React from 'react';
import {Component }from 'react';
import './auth.css';
import LoginInstance from '../../apisInstances/login';
import {Redirect} from "react-router-dom";
import AccessInterface from '../../store/interface/Access.interface'

interface Props {
    cookies: any
}

class Login extends Component<Props> {
    state = {
        username: '',
        password: '',
        warning: '',
        redirectToMain: false
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

    loginHandler = () => {
        const loginInfo = {
            username: this.state.username,
            password: this.state.password
        };
        /*get access token */
        LoginInstance.post('',loginInfo)
            .then(response => {
                const access: AccessInterface = response.data;

                const accessKey = access.AccessToken;
                /*store access token in cookies*/
                const {cookies} = this.props;
                cookies.set('AccessToken', accessKey, {path: '/'});
                /*redirect to main page*/
                this.setState({
                    redirectToMain: true
                });
            })
            .catch(err => {
                console.log(err.response);
                this.setState({warning: err.response.statusText})
            });
    };

    render() {
        if(this.state.redirectToMain) return(<Redirect to="/main"/>)

        return(
            <div className="form">
                <input type="text" onChange={this.usernameOnChangeHandler} placeholder="username"/>
                <input type="password" onChange={this.passwordOnChangeHandler} placeholder="password"/>
                <button onClick={this.loginHandler}>login</button>
                <p className="warning">{this.state.warning}</p>
                <p className="message">Not registered? <a href="/signup">Sign Up</a></p>
            </div>
        );
    }
}

export default Login;