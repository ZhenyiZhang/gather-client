import React from 'react';
import {Component } from 'react';
import eventInterface from '../../../store/interface/Event.interface';
import OrganizationStateInterface from '../../../store/interface/OrganizationState.interface'
import EventClickPopUp from '../eventClickPopUp/eventClickPopUp'
import './eventsPanel.css'

/*Redux*/
import {connect} from 'react-redux';

/*time format set up*/
import { Calendar } from 'react-big-calendar'
import Localizer from './localizer/localizer'

/*component*/
interface Props {
    events: eventInterface[],
    AccessToken: string
}

class EventsPanel extends Component<Props> {
    state = {
        popUp: false,
        popUpEvent: {
            name: '',
            description: '',
            start: new Date(),
            end: new Date(),
            repeat: '',
            _id: '',
            Organization: ''}
    };

    eventOnClickHandler = (event: eventInterface) => {
        this.setState({
            popUpEvent: event,
            popUp: !this.state.popUp
        });
    };

    popUpHandler = () => {
        this.setState({
            popUp: !this.state.popUp
        })
    };

    render() {

        const events = this.props.events.map(event => {
            return {
                title: event.name,
                startDate: new Date(event.start),
                endDate: new Date(event.end),
                ...event
            }
        });

        return(
            <div>
                <Calendar
                    className="Calendar"
                    events={events}
                    localizer={Localizer}
                    startAccessor="startDate"
                    endAccessor="endDate"
                    onSelectEvent={event => {this.eventOnClickHandler(event)}}
                />
                <EventClickPopUp
                    event={this.state.popUpEvent}
                    popUp={this.state.popUp}
                    popUpHandler={this.popUpHandler}
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

export default connect(mapStateToProps)(EventsPanel);