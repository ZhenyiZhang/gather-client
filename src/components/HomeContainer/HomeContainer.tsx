// eslint-disable-next-line
import React from 'react';

import { connect } from 'react-redux';
import Routes from '../../routes/routes';

interface Props {
  cookies: any;
}
const Home = (props: Props) => {
  const { cookies } = props;
  return <Routes cookies={cookies} />;
};

const mapStateToProps = (state: any, ownProps: any) => {
  return {
    state,
    cookies: ownProps.cookies,
  };
};

export const HomeContainer = connect(mapStateToProps, null)(Home);

export default HomeContainer;
