import React from 'react';
import {Component }from 'react';
import './auth.css';
import LoginInstance from '../../apisInstances/login';
import AccessInterface from '../../store/interface/Access.interface'

interface Props {
    cookies: any
}

class Login extends Component<Props> {
    state = {
        username: '',
        password: '',
        warning: '',
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

    loginHandler = async () => {
        const loginInfo = {
            username: this.state.username,
            password: this.state.password
        };
        /*get access token */
        const response = await LoginInstance.post('',loginInfo)
            .catch(err => {
                console.log(err.response);
                this.setState({warning: err.response.statusText})
            });
        /*log in failed*/
        if(!response) return;
        const access: AccessInterface = response.data;
        const accessKey = access.AccessToken;
        /*store access token in cookies*/
        const {cookies} = this.props;
        const cookieSet = await cookies.set('AccessToken', accessKey, {path: '/'});
        if(cookieSet) {this.setState({redirectToMain: true});}
        window.location.href="/main";
    };

    render() {
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