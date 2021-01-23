import React from 'react';
import {Component }from 'react';
import {connect} from 'react-redux';
import {Button, Collapse, CardBody, Card, Row} from 'reactstrap';
import OrganizationStateInterface from '../../../store/interface/OrganizationState.interface';

import 'bootstrap/dist/css/bootstrap.min.css'
import './TopPanel.css';


interface Props {
    name: string,
    description: string,
    organizationName: string,
}

class TopPanel extends Component<Props> {
    state = {
        dropdownOpen: false,
    };
    render() {
        return(
            <div className="TopPanel">
                <Row>
                    <h2>{this.props.organizationName}</h2>
                    <Button
                        color="primary"
                        onClick={() => {this.setState({dropdownOpen: !this.state.dropdownOpen})}}
                        className="ButtonAbout">About</Button>
                </Row>
                <Collapse isOpen={this.state.dropdownOpen}>
                    <Card className="Card">
                        <CardBody>
                            {this.props.description}
                        </CardBody>
                    </Card>
                </Collapse>
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