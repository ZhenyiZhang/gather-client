import React, { Component } from 'react';
import OrganizationStateInterface from '../../../store/interface/OrganizationState.interface';
import 'bootstrap/dist/css/bootstrap.min.css';
import {connect} from "react-redux";

interface Props {
    organization: OrganizationStateInterface,
    AccessToken: string
}

class ProfilePage extends Component<Props> {
    render() {
        return(
            <div>
                <p>{this.props.organization.organizationName}</p>
                <p>hhh</p>
            </div>
        );
    }
}

const mapStateToProps = (state: OrganizationStateInterface) => {
    return{
        organization: state
    };
};

export default connect(mapStateToProps)(ProfilePage);