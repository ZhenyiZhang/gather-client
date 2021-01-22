import React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';
import Routes from "../../routes/routes";

interface Props {
    cookies: any
    children: any
}
class Home extends Component<Props> {
    render() {
        return (<Routes cookies={this.props.cookies}/>);
    }
}

const mapStateToProps = (state: any, ownProps: any) => {
    return({
        state: state,
        cookies: ownProps.cookies,
    });
};

export const HomeContainer = connect(
    mapStateToProps,
    null
)(Home);

export default HomeContainer;
