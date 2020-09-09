import React from 'react';
import {Component } from 'react';
import eventInterface from '../../../store/interface/Event.interface';
import CalendarEvent from "./interface/calendarEvent.interface";
import OrganizationStateInterface from '../../../store/interface/OrganizationState.interface'
import EventClickPopUp from './eventClickPopUp/eventClickPopUp';
import NewEvent from './newEvent/newEvent'
import getProfileInstance from '../../../apisInstances/getProfile';
import CalendarPanel from "./calenderPanel/calendarPanel";
import {Dispatch} from "redux";
import getProfileAction from "../topPanel/actions/getProfileAction";
import CopyToClipboard from "react-copy-to-clipboard";
import ClientURL from "../../../apisInstances/clientURL";

/*Redux*/
import {connect} from 'react-redux';

/*Style*/
import {Alert, Button, Col} from "reactstrap";
import './calenderPanel/calendarPanel.css';
import './eventsPanel.css';

/*component*/
interface Props {
    events: eventInterface[],
    userId: string,
    share: boolean,
    AccessToken: string,
    getProfileDispatch: (organizationData: OrganizationStateInterface) => void
}

class EventsPanel extends Component<Props> {
    state = {
        alert: false,
        copy: false,
        /*control whether event is clicked or not*/
        popUp: false,
        /*controller for refreshing page*/
        refresh: false,
        /*content in the pop up modal*/
        popUpEvent: {
            name: '',
            description: '',
            start: new Date(),
            end: new Date(),
            repeat: '',
            repeatEnds: new Date(),
            repeatNeverEnds: false,
            _id: '',
            Organization: '',
            contacts: {email: '', link: '', phone: '', location: ''}
        },
        /*new event modal controller*/
        newEvent: false,
        newEventSelectedStart: new Date(Date.now()),
        newEventSelectedEnd: new Date(Date.now()),
        /*the time range current calender view covers*/
        calendarStart: new Date(Date.now()).setMonth(new Date(Date.now()).getMonth() - 1),
        calendarEnd: new Date(Date.now()).setMonth(new Date(Date.now()).getMonth() + 1),
    };
    /*update calendar time range state*/
    onRangeChangeHandler = (start: Date, end: Date) => {
        this.setState({
            calendarStart: start,
            calendarEnd: end
        })
    };

    newEventHandler = () => {
        this.setState({newEvent: !this.state.newEvent});
        getProfileInstance.get('',
            {headers:{Authorization: 'Bearer ' + this.props.AccessToken}})
            .then(res => {
                const profile: OrganizationStateInterface = res.data;
                this.props.getProfileDispatch(profile);})
            .catch(() => {alert('failed to access user profile')});
    };

    eventOnClickHandler = (calendarEvent: CalendarEvent) => {
        const event: eventInterface = {
            ...calendarEvent,
            start: calendarEvent.startDate,
            end: calendarEvent.endDate,
        };
        this.setState({
            popUpEvent: event,
            popUp: !this.state.popUp
        });
    };

    refreshHandler = () => {
        getProfileInstance.get('',
            {headers:{Authorization: 'Bearer ' + this.props.AccessToken}})
            .then(res => {
                const profile: OrganizationStateInterface = res.data;
                this.props.getProfileDispatch(profile);
            })
            .catch(() => {alert('failed to access user profile')});
    };

    popUpToggle = () => {
        this.setState({
            popUp: !this.state.popUp
        })
    };

    linkOnCopyHandler = () => {
        setTimeout(() => {this.setState({alert: false})}, 1000);
        this.setState({copy: true, alert: true});
    };

    slotOnClickHandler = (start: Date, end: Date) => {
        this.setState({newEventSelectedStart: new Date(start), newEventSelectedEnd: new Date(end)});
        this.newEventHandler();
    };

    render() {
        return(
            <div>
                {this.props.share?
                    <Col>
                        <CopyToClipboard text={ClientURL + `/shared/${this.props.userId}`} onCopy={this.linkOnCopyHandler}>
                            <Button className="Share" color="primary">Sharable Link</Button>
                        </CopyToClipboard>
                        <Alert className="CopyAlert"
                               color="success" isOpen={this.state.alert} fade={true}>
                            Copied to clipboard
                        </Alert>
                    </Col>
                    : null}
                <Button className="NewEventButton" color="primary" onClick={this.newEventHandler}> New Event</Button>
                <CalendarPanel
                    startDate = {new Date(this.state.calendarStart)}
                    endDate = {new Date(this.state.calendarEnd)}
                    eventsList={this.props.events}
                    onRangeChangeHandler={this.onRangeChangeHandler}
                    eventOnClickHandler={this.eventOnClickHandler}
                    slotOnClickHandler={this.slotOnClickHandler}
                />
                <EventClickPopUp
                    event={this.state.popUpEvent}
                    popUp={this.state.popUp}
                    popUpToggle={this.popUpToggle}
                    refreshHandler={this.refreshHandler}
                    AccessToken={this.props.AccessToken}
                />
                <NewEvent
                    AccessToken={this.props.AccessToken}
                    newEvent={this.state.newEvent}
                    newEventHandler={this.newEventHandler}
                    startSelected={this.state.newEventSelectedStart}
                    endSelected={this.state.newEventSelectedEnd}/>
            </div>

        );
    }
}

const mapStateToProps = (state: OrganizationStateInterface) => {
    return{
        events: state.events,
        userId: state._id,
        share: state.share
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

export default connect(mapStateToProps, mapDispatchToProps)(EventsPanel);