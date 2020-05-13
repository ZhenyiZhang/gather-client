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
                        <Login cookies={props.cookies}/>
                    </Route>
                    <Route path="/signup" exact>
                        <SignUp/>
                    </Route>
                    <Route path="/main" exact>
                        <Main cookies={props.cookies}/>
                    </Route>
                    <Redirect from="/" to="login"/>
                </Switch>
            </div>
    );
};

export default Routes;