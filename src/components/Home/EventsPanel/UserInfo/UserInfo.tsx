// eslint-disable-next-line
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Collapse, CardBody, Card } from 'reactstrap';
import OrganizationStateInterface from '../../../../store/interface/OrganizationState.interface';

import 'bootstrap/dist/css/bootstrap.min.css';
import './UserInfo.css';

interface Props {
  name: string;
  description: string;
  organizationName: string;
}

class UserInfo extends Component<Props> {
  state = {
    dropdownOpen: false,
  };

  render() {
    return (
      <div className="UserInfoContainer">
        <div className="UserInfoControl">
          <h2>{this.props.organizationName}</h2>
          <Button
            className="PrimaryButton"
            color="primary"
            onClick={() => {
              this.setState({ dropdownOpen: !this.state.dropdownOpen });
            }}
          >
            About
          </Button>
        </div>
        <Collapse className="Collspse" isOpen={this.state.dropdownOpen}>
          <Card className="Card">
            <CardBody>{this.props.description}</CardBody>
          </Card>
        </Collapse>
      </div>
    );
  }
}

const mapStateToProps = (state: OrganizationStateInterface) => {
  return {
    name: state.name,
    organizationName: state.organizationName,
    description: state.description,
  };
};

export default connect(mapStateToProps)(UserInfo);
