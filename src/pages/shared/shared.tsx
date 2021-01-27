import React, { Component } from 'react';
import OrganizationStateInterface from '../../store/interface/OrganizationState.interface';
import TopPanel from '../../components/Shared/TopPanel/TopPanel';
import EventsPanel from '../../components/Shared/EventsPanel/EventsPanel';
import getSharedProfileInstance from '../../lib/apisInstances/getSharedProfile';

class Shared extends Component<any> {
  state = {
    organizationData: {} as OrganizationStateInterface,
    showPage: false,
    pageError: false,
  };

  componentDidMount() {
    getSharedProfileInstance
      .get(`${this.props.match.params.userId}`)
      .then((response) => {
        const organization: OrganizationStateInterface = response.data;
        this.setState({
          organizationData: organization,
          showPage: true,
        });
      })
      .catch(() => {
        this.setState({ pageError: true });
      });
  }

  render() {
    return (
      <div>
        {this.state.showPage ? (
          <div>
            <TopPanel organization={this.state.organizationData} />
            <EventsPanel events={this.state.organizationData.events} />
          </div>
        ) : (
          this.state.pageError && (
            <p>The page does not exist or the user is not sharing</p>
          )
        )}
      </div>
    );
  }
}

export default Shared;
