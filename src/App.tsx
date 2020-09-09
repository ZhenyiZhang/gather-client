import React,  {useEffect} from 'react';
import './App.css';
import {Route} from "react-router-dom";
import {withCookies} from 'react-cookie';
import HomeContainer from './components/homeContainer/homeContainer';

function App(props: any) {
    useEffect(() => {
        const script = document.createElement("script");
        script.async = true;
        script.src = `${process.env.REACT_APP_GOOGLE_GEO_API}`;
        console.log(process.env.REACT_APP_GOOGLE_GEO_API);
        document.head.appendChild(script);
    });
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
