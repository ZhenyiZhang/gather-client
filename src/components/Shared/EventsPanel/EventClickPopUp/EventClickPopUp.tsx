// eslint-disable-next-line
import React from 'react';
import dateformat from 'dateformat';
import ICalendarLink from 'react-icalendar-link';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import EventInterface from '../../../../store/interface/Event.interface';

import 'bootstrap/dist/css/bootstrap.min.css';
import './EventClickPopUp.css';

interface Props {
  popUp: boolean;
  event: EventInterface;
  popUpToggle: () => void;
}
const EventClickPopUp = (props: Props): any => {
  return (
    <Modal
      isOpen={props.popUp}
      toggle={props.popUpToggle}
      modalTransition={{ timeout: 300 }}
    >
      <ModalHeader className="lead" toggle={props.popUpToggle}>
        {props.event.name}
      </ModalHeader>
      <ModalBody>
        <p className="lead">{props.event.description}</p>
        <p className="label">Start Date:</p>
        <p>
          {dateformat(
            new Date(props.event.start),
            'dddd, mmmm dS, yyyy, h:MM TT'
          )}
        </p>
        <p className="label">End Date:</p>
        <p>
          {dateformat(
            new Date(props.event.end),
            'dddd, mmmm dS, yyyy, h:MM TT'
          )}
        </p>
        {props.event.repeat !== 'none' && props.event.repeatNeverEnds ? (
          <p>
            <strong className="label">Repeat:</strong>
            Never Ends
          </p>
        ) : (
          <p>
            <strong className="label">
              Event repeats
              {props.event.repeat}
              until
            </strong>
            {dateformat(
              new Date(props.event.repeatEnds),
              'dddd, mmmm dS, yyyy, h:MM TT'
            )}
          </p>
        )}
        {props.event.contacts.email && (
          <p>
            <strong className="label">{'Email: '}</strong>
            {props.event.contacts.email}
          </p>
        )}
        {props.event.contacts.phone && (
          <p>
            <strong className="label">{'Phone: '}</strong>
            {props.event.contacts.phone}
          </p>
        )}
        {props.event.contacts.link && (
          <p>
            <strong className="label">{'Link: '}</strong>
            {props.event.contacts.link}
          </p>
        )}
        {props.event.contacts.location && (
          <p>
            <strong className="label">{'Location: '}</strong>
            {props.event.contacts.location}
          </p>
        )}
      </ModalBody>
      <ModalFooter>
        {props.popUp && (
          <ICalendarLink
            event={{
              title: props.event.name,
              description: props.event.description,
              startTime: dateformat(props.event.start, "yyyy-mm-dd'T'HH:MM:ss"),
              endTime: dateformat(props.event.end, "yyyy-mm-dd'T'HH:MM:ss"),
              location: props.event.contacts.location,
            }}
          >
            Download Event File
          </ICalendarLink>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default EventClickPopUp;
