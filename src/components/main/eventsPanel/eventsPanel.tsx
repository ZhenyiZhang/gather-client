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
            Organization: ''
        },
        currentDate : new Date(Date.now()),
        eventsNeverEnd: [],
        eventsNeverEndGenerated: [],
        regularEvents: [],
        /*indicator for the calendar is still in the default date*/
        calenderRangeNotChanged: true
    };

    shouldComponentUpdate = (nextProps: Props, nextState: any): boolean => {
        if(nextProps === this.props && nextState === this.state) return false;
        if(this.props.events.length === 0 && nextProps.events.length !== 0) {
            this.divideEventsHandler(nextProps.events);
            /*render will not be called because the render will be call in divideEventsHandler
            not necessary to render this time, the state is not ready yet*/
            return false;
        }
        if(this.props !== nextProps) {
            this.divideEventsHandler(nextProps.events);
        }
        return true;
    };

    /*divide events into two groups which are repeat never ends group and other*/
    divideEventsHandler = (events: eventInterface[]): void => {
        if(events.length !== 0) {
            console.log("testttt");
            let eventsNeverEnd: object[] = [{}];
            let regularEvents: object[]  = [{}];
            events.forEach((event) => {
                    if(event.repeatNeverEnds) {
                        eventsNeverEnd.push(event)
                    } else {
                        regularEvents.push(event);
                    }
                }
            );
            /*delete the empty object created when initialized*/
            eventsNeverEnd.shift();
            regularEvents.shift();
            this.setState({
                eventsNeverEnd: eventsNeverEnd,
                regularEvents: regularEvents,
            });
        } else {
            this.setState({
                eventsNeverEnd: [],
                regularEvents: [],
            })
        }
    };

    /*decide whether repeat never ends events are in current calendar or not*/
    timeRangeChangeHandler= (range: {start: string, end: string}): CalendarEvent[] => {
        const rangeStart = new Date(range.start);
        const rangeEnd = new Date(range.end);
        const eventsNeverEnd: eventInterface[] = this.state.eventsNeverEnd;
        let eventsNeverEndGenerated = [{
            name: '',
            startDate: new Date(),
            endDate: new Date(),
            description: '',
            repeat: '',
            repeatEnds: new Date(),
            repeatNeverEnds: false,
            _id: '',
            Organization: ''
        }];
        eventsNeverEnd.forEach(event => {
            if(new Date(event.start) > rangeEnd) return;
            let eventStartCount = new Date(event.start);
            let eventEndCount = new Date(event.end);
            if(event.repeat === 'Monthly') {
                while (eventStartCount < rangeStart) {
                    eventStartCount.setMonth(eventStartCount.getMonth() + 1);
                    eventEndCount.setMonth(eventEndCount.getMonth() + 1);
                }
                while (eventEndCount < rangeEnd && eventStartCount > rangeStart) {
                    eventsNeverEndGenerated.push({
                            startDate: eventStartCount,
                            endDate: eventEndCount,
                            ...event
                        }
                    );
                    eventStartCount.setMonth(eventStartCount.getMonth() + 1);
                    eventEndCount.setMonth(eventEndCount.getMonth() + 1);
                }
            }
            if(event.repeat === 'Weekly') {
                while (eventStartCount < rangeStart) {
                    eventStartCount.setDate(eventStartCount.getDate() + 7);
                    eventEndCount.setDate(eventEndCount.getDate() + 7);
                }
                while (eventEndCount < rangeEnd && eventStartCount > rangeStart) {
                    eventsNeverEndGenerated.push({
                            startDate: new Date(eventStartCount),
                            endDate: new Date(eventEndCount),
                            ...event
                        }
                    );
                    eventStartCount.setDate(eventStartCount.getDate() + 7);
                    eventEndCount.setDate(eventEndCount.getDate() + 7);
                }
            }
            if(event.repeat === 'Yearly') {
                while (eventStartCount < rangeStart) {
                    eventStartCount.setFullYear(eventStartCount.getFullYear() + 1);
                    eventEndCount.setFullYear(eventEndCount.getFullYear() + 1);
                }
                while (eventEndCount < rangeEnd && eventStartCount > rangeStart) {
                    eventsNeverEndGenerated.push({
                            startDate: new Date(eventStartCount),
                            endDate: new Date(eventEndCount),
                            ...event
                        }
                    );
                    eventStartCount.setFullYear(eventStartCount.getFullYear() + 1);
                    eventEndCount.setFullYear(eventEndCount.getFullYear() + 1);
                }
            }
            if(event.repeat === 'Biweekly') {
                while (eventStartCount < rangeStart) {
                    eventStartCount.setDate(eventStartCount.getDate() + 14);
                    eventEndCount.setDate(eventEndCount.getDate() + 14);
                }
                while (eventEndCount < rangeEnd && eventStartCount > rangeStart) {
                    eventsNeverEndGenerated.push({
                            startDate: new Date(eventStartCount),
                            endDate: new Date(eventEndCount),
                            ...event
                        }
                    );
                    eventStartCount.setDate(eventStartCount.getDate() + 14);
                    eventEndCount.setDate(eventEndCount.getDate() + 14);
                }
            }
            if(event.repeat === 'Daily') {
                while (eventStartCount < rangeStart) {
                    eventStartCount.setDate(eventStartCount.getDate() + 1);
                    eventEndCount.setDate(eventEndCount.getDate() + 1);
                }
                while (eventEndCount < rangeEnd && eventStartCount > rangeStart) {
                    eventsNeverEndGenerated.push({
                            startDate: new Date(eventStartCount),
                            endDate: new Date(eventEndCount),
                            ...event
                        }
                    );
                    eventStartCount.setDate(eventStartCount.getDate() + 1);
                    eventEndCount.setDate(eventEndCount.getDate() + 1);
                }
            }
        });
        eventsNeverEndGenerated.shift();
        return eventsNeverEndGenerated;
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
        let eventsListB: CalendarEvent[];
        if(this.state.calenderRangeNotChanged) {
            let currentCalenderStart = new Date(Date.now());
            currentCalenderStart.setMonth(currentCalenderStart.getMonth() - 1);
            let currentCalenderEnd = new Date(Date.now());
            currentCalenderEnd.setMonth(currentCalenderEnd.getMonth() + 1);
            eventsListB = this.timeRangeChangeHandler({start: currentCalenderStart.toString(), end: currentCalenderEnd.toString()});
        } else {
            eventsListB = this.state.eventsNeverEndGenerated;
        }
        /*events list in the display range*/
        const eventsListA: CalendarEvent[] = EventGenerator(this.state.regularEvents);
        const eventsList = [...eventsListA, ...eventsListB];
        return(
            <div>
                <Calendar
                    className="Calendar"
                    titleAccessor="name"
                    events={eventsList}
                    localizer={Localizer}
                    startAccessor="startDate"
                    endAccessor="endDate"
                    onRangeChange={(range) => {
                        if(this.state.eventsNeverEnd.length !== 0) {
                            const list: CalendarEvent[] = this.timeRangeChangeHandler(JSON.parse(JSON.stringify(range)));
                            this.setState({eventsNeverEndGenerated: list});
                        }
                        this.setState({calenderRangeNotChanged: false})
                    }
                    }
                    onNavigate={(data, views) => {
                        console.log('onNavs');
                    }}
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