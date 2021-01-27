// eslint-disable-next-line
import React from 'react';
import { Calendar } from 'react-big-calendar';
import eventInterface from '../../../../store/interface/Event.interface';
import CalendarEvent from '../interface/calendarEvent.interface';
import EventsGenerator from '../functions/eventGenerator';
import './CalendarPanel.css';

/* time format set up */
import Localizer from '../localizer/localizer';

interface Props {
  startDate: Date;
  endDate: Date;
  eventsList: eventInterface[];
  onRangeChangeHandler: (start: Date, end: Date) => void;
  eventOnClickHandler: (calendarEvent: CalendarEvent) => void;
  slotOnClickHandler: (start: Date, end: Date) => void;
}

const CalendarPanel = (props: Props) => {
  const {
    startDate,
    endDate,
    eventsList,
    eventOnClickHandler,
    slotOnClickHandler,
  } = props;
  /* handle displayed calendar time range change */
  const onRangeChangeHandler = (range: any) => {
    let rangeParsed = JSON.parse(JSON.stringify(range));
    if (rangeParsed.start && rangeParsed.end) {
      rangeParsed = { start: rangeParsed.start, end: rangeParsed.end };
    } else {
      const end = new Date(rangeParsed[rangeParsed.length - 1]);
      end.setDate(end.getDate() + 1);
      rangeParsed = { start: rangeParsed[0], end };
    }
    props.onRangeChangeHandler(
      new Date(rangeParsed.start),
      new Date(rangeParsed.end)
    );
  };
  /* generate calendar readable events list */
  const eventsListGendered: CalendarEvent[] = EventsGenerator(
    eventsList,
    startDate,
    endDate
  );

  return (
    <div>
      <Calendar
        popup
        className="Calendar"
        titleAccessor="name"
        timeslots={8}
        events={eventsListGendered}
        localizer={Localizer}
        startAccessor="startDate"
        endAccessor="endDate"
        step={15}
        selectable
        onSelectSlot={(slotInfo) => {
          const slotInfoParsed = JSON.parse(JSON.stringify(slotInfo));
          slotOnClickHandler(slotInfoParsed.start, slotInfoParsed.end);
        }}
        onSelectEvent={(event) => {
          eventOnClickHandler(event);
        }}
        onRangeChange={(range) => {
          onRangeChangeHandler(range);
        }}
      />
    </div>
  );
};

export default CalendarPanel;
