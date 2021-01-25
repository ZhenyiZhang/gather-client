import React, { Component } from 'react';

import eventInterface from '../../../store/interface/Event.interface';
import CalendarEvent from './interface/calendarEvent.interface';
import EventClickPopUp from './EventClickPopUp/EventClickPopUp';
import CalendarPanel from './CalendarPanel/CalendarPanel';
import '../../Home/EventsPanel/CalenderPanel/CalendarPanel.css';

/* component */
interface Props {
  events: eventInterface[];
}

class EventsPanel extends Component<Props> {
  state = {
    /* control whether event is clicked or not */
    popUp: false,
    /* content in the pop up modal */
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
      contacts: { email: '', link: '', phone: '', location: '' },
    },
    /* the time range current calender view covers */
    calendarStart: new Date(Date.now()).setMonth(
      new Date(Date.now()).getMonth() - 1
    ),
    calendarEnd: new Date(Date.now()).setMonth(
      new Date(Date.now()).getMonth() + 1
    ),
  };

  onRangeChangeHandler = (start: Date, end: Date): void => {
    this.setState({
      calendarStart: start,
      calendarEnd: end,
    });
  };

  eventOnClickHandler = (calendarEvent: CalendarEvent) => {
    const event: eventInterface = {
      start: calendarEvent.startDate,
      end: calendarEvent.endDate,
      ...calendarEvent,
    };
    this.setState({
      popUpEvent: event,
      popUp: !this.state.popUp,
    });
  };

  popUpToggle = () => {
    this.setState({
      popUp: !this.state.popUp,
    });
  };

  render() {
    return (
      <div>
        <CalendarPanel
          startDate={new Date(this.state.calendarStart)}
          endDate={new Date(this.state.calendarEnd)}
          eventsList={this.props.events}
          onRangeChangeHandler={this.onRangeChangeHandler}
          eventOnClickHandler={this.eventOnClickHandler}
        />
        <EventClickPopUp
          event={this.state.popUpEvent}
          popUp={this.state.popUp}
          popUpToggle={this.popUpToggle}
        />
      </div>
    );
  }
}

export default EventsPanel;
