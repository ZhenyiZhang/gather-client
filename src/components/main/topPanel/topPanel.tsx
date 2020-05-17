import React from 'react';
import {Component }from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import NewEvent from './newEvent/newEvent';
import getProfileAction from './actions/getProfileAction';
import getProfileInstance from '../../../apisInstances/getProfile';
import OrganizationStateInterface from '../../../store/interface/OrganizationState.interface';
import './topPanel.css';

/*styling imports*/
import { Button } from 'reactstrap';


interface Props {
    name: string,
    description: string,
    organizationName: string,
    AccessToken: string,
    getProfileDispatch: (organizationData: OrganizationStateInterface) => void
}

class TopPanel extends Component<Props> {
    state = {
        newEvent: false
    };

    componentDidMount(): void {
        getProfileInstance.get('',
            {headers:{Authorization: 'Bearer ' + this.props.AccessToken}})
            .then(res => {
                    const profile: OrganizationStateInterface = res.data;
                    this.props.getProfileDispatch(profile);})
            .catch(() => {alert('failed to access user profile')});
    }

    newEventHandler = () => {
        this.setState({newEvent: !this.state.newEvent});
        getProfileInstance.get('',
            {headers:{Authorization: 'Bearer ' + this.props.AccessToken}})
            .then(res => {
                const profile: OrganizationStateInterface = res.data;
                this.props.getProfileDispatch(profile);})
            .catch(() => {alert('failed to access user profile')});
    };

    render() {
        return(
            <div className="topPanel">
                <h2>{this.props.organizationName}</h2>
                <p>{this.props.description}</p>
                <Button color="primary" onClick={this.newEventHandler}> New Event</Button>
                <NewEvent
                    AccessToken={this.props.AccessToken}
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