import React from 'react';
import {Component } from 'react';
import eventInterface from '../../../store/interface/Event.interface';
import CalendarEvent from "./interface/calendarEvent.interface";
import EventGenerator from "./functions/eventGenerator";
import OrganizationStateInterface from '../../../store/interface/OrganizationState.interface'
import EventClickPopUp from './eventClickPopUp/eventClickPopUp'
import getProfileInstance from '../../../apisInstances/getProfile';
import './eventsPanel.css'

/*Redux*/
import {connect} from 'react-redux';

/*time format set up*/
import { Calendar } from 'react-big-calendar'
import Localizer from './localizer/localizer'
import {Dispatch} from "redux";
import getProfileAction from "../topPanel/actions/getProfileAction";

/*component*/
interface Props {
    events: eventInterface[],
    AccessToken: string,
    getProfileDispatch: (organizationData: OrganizationStateInterface) => void
}

class EventsPanel extends Component<Props> {
    state = {
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
            Organization: ''},
    };


    eventOnClickHandler = (calendarEvent: CalendarEvent) => {
        const event: eventInterface = {
            start: calendarEvent.startDate,
            end: calendarEvent.endDate,
            ...calendarEvent
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
                this.props.getProfileDispatch(profile);})
            .catch(() => {alert('failed to access user profile')});
    };

    popUpToggle = () => {
        this.setState({
            popUp: !this.state.popUp
        })
    };

    render() {
        /*events list in the display range*/
        const eventsList = EventGenerator(this.props.events);
        eventsList.shift();
        return(
            <div>
                <Calendar
                    className="Calendar"
                    titleAccessor="name"
                    events={eventsList}
                    localizer={Localizer}
                    startAccessor="startDate"
                    endAccessor="endDate"
                    step={60}
                    onSelectEvent={event => {this.eventOnClickHandler(event)}}
                />
                <EventClickPopUp
                    event={this.state.popUpEvent}
                    popUp={this.state.popUp}
                    popUpToggle={this.popUpToggle}
                    refreshHandler={this.refreshHandler}
                    AccessToken={this.props.AccessToken}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: OrganizationStateInterface) => {
    return{
        events: state.events
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