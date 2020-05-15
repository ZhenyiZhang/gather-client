import React from 'react';
import {Component }from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {Link} from 'react-router-dom';
import getProfileAction from './actions/getProfileAction';
import getProfileInstance from '../../../apisInstances/getProfile';
import OrganizationStateInterface from '../../../store/interface/OrganizationState.interface';


interface Props {
    name: string,
    description: string,
    organizationName: string,
    AccessToken: string,
    getProfileDispatch: (organizationData: OrganizationStateInterface) => void
}

class TopPanel extends Component<Props> {

    componentDidMount(): void {
        getProfileInstance.get('',
            {headers:{Authorization: 'Bearer ' + this.props.AccessToken}})
            .then(res => {
                    const profile: OrganizationStateInterface = res.data;
                    this.props.getProfileDispatch(profile);
                }
            );
    }

    render() {
        return(
            <div>
                <p>{this.props.organizationName}</p>
                <p>{this.props.description}</p>
                <Link to="/newEvent">New Event</Link>
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