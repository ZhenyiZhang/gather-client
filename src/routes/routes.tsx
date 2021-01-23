import React from 'react';
import {
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Login from "../pages/authorization/Login/Login";
import Signup from "../pages/authorization/Signup/Signup";
import Shared from "../pages/shared/shared";
import ResetPassword from "../pages/authorization/ResetPassword/ResetPassword";
import Home from "../pages/home/home"

const Routes = (props: any) => {
    return(
            <div>
                <Switch>
                    <Route path='/shared/:userId' component={Shared}/>
                    <Route path="/signup" exact component={Signup}/>
                    <Route path="/login" exact>
                        {(props.cookies.get('AccessToken'))? <Redirect to="/home"/> : null}
                        <Login cookies={props.cookies}/>
                    </Route>
                    <Route path="/home" >
                        {(props.cookies.get('AccessToken'))? null : <Redirect to="/login"/>}
                        <Home cookies={props.cookies}/>
                    </Route>
                    <Route path="/reset" >
                        <ResetPassword/>
                    </Route>
                    {/*if access token is not found always redirect to /login*/}
                    {(props.cookies.get('AccessToken'))? <Redirect to="/home"/> : <Redirect to="/signup"/> }
                </Switch>
            </div>
    );
};

export default Routes;