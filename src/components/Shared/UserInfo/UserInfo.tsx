// eslint-disable-next-line
import React, { Component } from 'react';
import { Button, Collapse, CardBody, Card } from 'reactstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../Home/EventsPanel/UserInfo/UserInfo.css';

interface Props {
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

export default UserInfo;
