import React from 'react';
import {
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Login from "../pages/authorization/Login/Login";
import Signup from "../pages/authorization/Signup/Signup";
import SharedEventsPage from "../pages/shared/sharedEventsPage";
import ResetPassword from "../pages/authorization/ResetPassword/ResetPassword";
import Main from "../pages/home/main"

const Routes = (props: any) => {
    return(
            <div>
                <Switch>
                    <Route path='/shared/:userId' component={SharedEventsPage}/>
                    <Route path="/signup" exact component={Signup}/>
                    <Route path="/login" exact>
                        {(props.cookies.get('AccessToken'))? <Redirect to="/main"/> : null}
                        <Login cookies={props.cookies}/>
                    </Route>
                    <Route path="/main" >
                        {(props.cookies.get('AccessToken'))? null : <Redirect to="/login"/>}
                        <Main cookies={props.cookies}/>
                    </Route>
                    <Route path="/reset" >
                        <ResetPassword/>
                    </Route>
                    {/*if access token is not found always redirect to /login*/}
                    {(props.cookies.get('AccessToken'))? <Redirect to="/main"/> : <Redirect to="/signup"/> }
                </Switch>
            </div>
    );
};

export default Routes;