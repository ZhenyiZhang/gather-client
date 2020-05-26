import React from 'react';
import eventInterface from '../../../../store/interface/Event.interface';
import CalendarEvent from "../interface/calendarEvent.interface";
import EventsGenerator from "../../../main/eventsPanel/functions/eventGenerator";
import './sharedCalendarPanel.css'

/*time format set up*/
import { Calendar } from 'react-big-calendar'
import Localizer from '../localizer/localizer'


interface Props {
    startDate: Date,
    endDate: Date,
    eventsList: eventInterface[],
    onRangeChangeHandler: (start: Date, end: Date) => void
    eventOnClickHandler: (calendarEvent: CalendarEvent) => void
}

const SharedCalendarPanel = (props: Props) => {
    const eventsListGendered: CalendarEvent[] = EventsGenerator(props.eventsList, props.startDate, props.endDate);
    return (
        <div>
            <Calendar
                popup
                className='Calendar'
                titleAccessor="name"
                timeslots={8}
                events={eventsListGendered}
                localizer={Localizer}
                startAccessor="startDate"
                endAccessor="endDate"
                step={15}
                selectable
                onSelectEvent={event => {props.eventOnClickHandler(event)}}
                onRangeChange={(range) => {
                    let rangeParsed = JSON.parse(JSON.stringify(range));
                    if(rangeParsed.start && rangeParsed.end) {
                        rangeParsed = {start: rangeParsed.start, end: rangeParsed.end};
                    } else {
                        let end = new Date(rangeParsed[rangeParsed.length - 1]);
                        end.setDate(end.getDate() + 1);
                        rangeParsed = {start: rangeParsed[0], end: end}
                    }
                    props.onRangeChangeHandler(new Date(rangeParsed.start), new Date(rangeParsed.end))}
                }
            />
        </div>
    );
};

export default SharedCalendarPanel;