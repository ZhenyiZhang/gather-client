import React, {Component} from 'react';
import OrganizationStateInterface from "../../store/interface/OrganizationState.interface";
import TopPanel from './topPanel/topPanel';
import EventsPanel from './eventsPanel/eventsPanel';
import getSharedProfileInstance from "../../apisInstances/getSharedProfile";

class SharedEventsPage extends Component<any> {
    state = {
        organizationData: {} as OrganizationStateInterface,
        showPage: false,
    };
    componentDidMount() {
        console.log('haha');
        getSharedProfileInstance.get(`${this.props.match.params.userId}`)
            .then(response => {
                const organization: OrganizationStateInterface = response.data;
                this.setState({
                    organizationData: organization,
                    showPage: true})
            })
            .catch(() => {
                this.setState({
                    invalidPage: (<p>The page does not exist or the user profile is not shared </p>)
                })
            });
    }
    render() {
        return(
            <div>
                {this.state.showPage ? <div>
                    <TopPanel organization={this.state.organizationData}/>
                    <EventsPanel events={this.state.organizationData.events}/>
                </div> : null}
            </div>
        )
    }
}

export default SharedEventsPage;