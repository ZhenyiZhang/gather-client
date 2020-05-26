import React from 'react';
import {Component }from 'react';
import {connect} from 'react-redux';
import OrganizationStateInterface from '../../../store/interface/OrganizationState.interface';

import 'bootstrap/dist/css/bootstrap.min.css'
import './topPanel.css';


interface Props {
    name: string,
    description: string,
    organizationName: string,
}

class TopPanel extends Component<Props> {
    render() {
        return(
            <div className="topPanel">
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


export default connect(mapStateToProps)(TopPanel);