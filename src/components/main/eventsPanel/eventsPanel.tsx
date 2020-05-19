import React from 'react';
import {Component } from 'react';
import eventInterface from '../../../store/interface/Event.interface';
import CalendarEvent from "./interface/calendarEvent.interface";
import EventsGenerator from "./functions/eventGenerator";
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
    eventsInitial: CalendarEvent[],
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
            Organization: ''
        },
        calendarStart: new Date(Date.now()).setMonth(new Date(Date.now()).getMonth() - 1),
        calendarEnd: new Date(Date.now()).setMonth(new Date(Date.now()).getMonth() + 1),
        eventsDisplay: []
    };

    onRangeChangeHandler = (range: {start: string, end: string}) => {
        const list: CalendarEvent[] = EventsGenerator(this.props.events, new Date(range.start), new Date(range.end));
        this.setState({eventsDisplay: list});
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
        return(
            <div>
                {new Date(this.state.calendarStart).toDateString()}
                <Calendar
                    className="Calendar"
                    titleAccessor="name"
                    events={this.state.eventsDisplay.length === 0 ? this.props.eventsInitial : this.state.eventsDisplay}
                    localizer={Localizer}
                    startAccessor="startDate"
                    endAccessor="endDate"
                    onRangeChange={(range) => {
                        const rangeParsed: {start: string, end: string} = JSON.parse(JSON.stringify(range));
                        this.onRangeChangeHandler(rangeParsed)}
                    }
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
    const calendarStart: Date = new Date(new Date(Date.now()).setMonth(new Date(Date.now()).getMonth() - 1));
    const calendarEnd: Date =  new Date (new Date(Date.now()).setMonth(new Date(Date.now()).getMonth() + 1));
    const eventsInitial: CalendarEvent[] = EventsGenerator(state.events, calendarStart, calendarEnd);
    return{
        events: state.events,
        eventsInitial: eventsInitial
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