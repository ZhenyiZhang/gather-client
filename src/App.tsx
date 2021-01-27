// eslint-disable-next-line
import React, { useEffect } from 'react';
import Cookies from 'universal-cookie';
import { Route } from 'react-router-dom';

import { withCookies } from 'react-cookie';
import HomeContainer from './components/HomeContainer/HomeContainer';

import './App.css';
import './lib/styles/button.css';

interface Props {
  cookies: Cookies;
}

function App(props: Props) {
  const { cookies } = props;
  /* import google geo api for location searching */
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `${process.env.REACT_APP_GOOGLE_GEO_API}`;
    document.head.appendChild(script);
  });

  return (
    <div className="App">
      <Route path="/" render={() => <HomeContainer cookies={cookies} />} />
    </div>
  );
}

export default withCookies(App);
