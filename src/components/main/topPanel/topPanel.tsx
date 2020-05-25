import React from 'react';
import {Component }from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import NewEvent from './newEvent/newEvent';
import {Cookies} from 'react-cookie';
import { instanceOf } from 'prop-types';
import getProfileAction from './actions/getProfileAction';
import getProfileInstance from '../../../apisInstances/getProfile';
import OrganizationStateInterface from '../../../store/interface/OrganizationState.interface';

import {Button} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import './topPanel.css';


interface Props {
    name: string,
    description: string,
    organizationName: string,
    cookies: Cookies
    getProfileDispatch: (organizationData: OrganizationStateInterface) => void
}

class TopPanel extends Component<Props> {
    state = {
        newEvent: false,
        AccessToken: this.props.cookies.get('AccessToken'),
        cookies: instanceOf(Cookies).isRequired
    };

    newEventHandler = () => {
        this.setState({newEvent: !this.state.newEvent});
        getProfileInstance.get('',
            {headers:{Authorization: 'Bearer ' + this.state.AccessToken}})
            .then(res => {
                const profile: OrganizationStateInterface = res.data;
                this.props.getProfileDispatch(profile);})
            .catch(() => {alert('failed to access user profile')});
    };

    render() {
        return(
            <div className="topPanel">
                <Button className="NewButton" color="info" onClick={this.newEventHandler}> New Event</Button>
                <NewEvent
                    AccessToken={this.state.AccessToken}
                    newEvent={this.state.newEvent}
                    newEventHandler={this.newEventHandler}/>
            </div>
        );
    }
}


const mapStateToProps = (state: OrganizationStateInterface) => {
    return{
        name: state.name,
        organizationName: state.organizationName,
        description: state.description,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return{
        getProfileDispatch: (organizationData: OrganizationStateInterface) => {
            const action: getProfileAction = {type: 'getProfile', organization: organizationData};
            dispatch(action);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopPanel);