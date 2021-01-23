import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { withCookies } from "react-cookie";
import HomeContainer from "./components/HomeContainer/HomeContainer";

import "./App.css";

function App(props: any) {
  /* import google geo api for location searching */
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `${process.env.REACT_APP_GOOGLE_GEO_API}`;
    document.head.appendChild(script);
  });

  return (
    <div className="App">
      <Route
        path="/"
        render={() => <HomeContainer cookies={props.cookies} />}
      />
    </div>
  );
}

export default withCookies(App);
