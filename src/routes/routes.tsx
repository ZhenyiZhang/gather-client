import React from 'react';
import {
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Login from "../components/account/login";
import SignUp from "../components/account/signUp";
import Main from "../components/main/main"

const Routes = (props: any) => {
    return(
            <div>
                <Switch>
                    <Route path="/login" exact>
                        {(props.cookies.get('AccessToken'))? <Redirect to="/main"/> : null}
                        <Login cookies={props.cookies}/>
                    </Route>
                    <Route path="/signup" exact>
                        {(props.cookies.get('AccessToken'))? <Redirect to="/main"/> : null}
                        <SignUp/>
                    </Route>
                    <Route path="/main" exact>
                        {(props.cookies.get('AccessToken'))? null : <Redirect to="/login"/>}
                        <Main cookies={props.cookies}/>
                    </Route>
                    {/*if access token is not found always redirect to /login*/}
                    {(props.cookies.get('AccessToken'))? <Redirect to="/main"/> : <Redirect to="/login"/> }
                </Switch>
            </div>
    );
};

export default Routes;