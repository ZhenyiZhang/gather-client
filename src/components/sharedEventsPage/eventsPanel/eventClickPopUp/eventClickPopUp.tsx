import React, {Component} from 'react';
import dateformat from 'dateformat';
import ICalendarLink from "react-icalendar-link";
import EventInterface from '../../../../store/interface/Event.interface';

import { Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './eventClickPopUp.css';

interface Props {
    popUp: boolean,
    event: EventInterface,
    popUpToggle: () => void,
}

class EventClickPopUp extends Component<Props> {
    state = {
        startTimeReformat: dateformat(this.props.event.start,"dddd, mmmm dS, yyyy, h:MM:ss TT"),
        endTimeReformat: dateformat(this.props.event.end,"dddd, mmmm dS, yyyy, h:MM:ss TT"),
    };

    render() {
        return(
            <Modal isOpen={this.props.popUp} toggle={this.props.popUpToggle} modalTransition={{ timeout: 300 }} >
                <ModalHeader className='lead' toggle={this.props.popUpToggle}>{this.props.event.name}</ModalHeader>
                <ModalBody>
                    <p className="lead">{this.props.event.description}</p>
                    <p className="label">Start Date:</p>
                    <p>{dateformat(new Date(this.props.event.start),"dddd, mmmm dS, yyyy, h:MM TT")}</p>
                    <p className="label">End Date:</p>
                    <p>{dateformat(new Date(this.props.event.end),"dddd, mmmm dS, yyyy, h:MM TT")}</p>
                    {this.props.event.repeat === 'none' ? null :
                        this.props.event.repeatNeverEnds ? <p><strong className="label">Repeat:</strong> Never Ends</p> :
                            <p><strong className="label">Event repeats {this.props.event.repeat} until {' '}</strong>
                                {dateformat(new Date(this.props.event.repeatEnds),"dddd, mmmm dS, yyyy, h:MM TT")}</p>}
                    {this.props.event.contacts.email ?
                        <p><strong className="label">{'Email: '}</strong> {this.props.event.contacts.email}</p> : null}
                    {this.props.event.contacts.phone ?
                        <p><strong className="label">{'Phone: '}</strong> {this.props.event.contacts.phone}</p> : null}
                    {this.props.event.contacts.link ?
                        <p><strong className="label">{'Link: '}</strong> {this.props.event.contacts.link}</p> : null}
                    {this.props.event.contacts.location ?
                        <p><strong className="label">{'Location: '}</strong> {this.props.event.contacts.location}</p> : null}
                </ModalBody>
                <ModalFooter>
                    {this.props.popUp ? <ICalendarLink event={
                        {title: this.props.event.name,
                        description: this.props.event.description,
                        startTime: dateformat(this.props.event.start,"yyyy-mm-dd'T'HH:MM:ss"),
                        endTime: dateformat(this.props.event.end,"yyyy-mm-dd'T'HH:MM:ss"),
                        location: this.props.event.contacts.location
                    }}>Download Event File</ICalendarLink> : null}
                </ModalFooter>
            </Modal>
        );
    }
};

export default EventClickPopUp;


