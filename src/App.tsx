import React from 'react';
import './App.css';
import {Route} from "react-router-dom";
import {withCookies} from 'react-cookie';
import HomeContainer from './components/homeContainer/homeContainer'

function App(props: any) {
    return (
        <div className="App">
            <Route
                path="/"
                render={() => (<HomeContainer cookies={props.cookies}/>)}>
            </Route>
        </div>
    );
}

export default withCookies(App);
