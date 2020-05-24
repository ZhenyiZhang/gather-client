import React, {Component} from 'react';
import EventInterface from '../../../../store/interface/Event.interface';
import {Modal, ModalBody, ModalHeader} from 'reactstrap';
import dateformat from 'dateformat';
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
        endTimeReformat: dateformat(this.props.event.end,"dddd, mmmm dS, yyyy, h:MM:ss TT")
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
                        this.props.event.repeatNeverEnds ? <p><p className="label">Repeat:</p> Never Ends</p> :
                            <p><p className="label">Event repeats {this.props.event.repeat} until {' '}</p>
                                {dateformat(new Date(this.props.event.repeatEnds),"dddd, mmmm dS, yyyy, h:MM TT")}</p>}
                    {this.props.event.contacts.email ?
                        <p><p className="label">{'Email: '}</p> {this.props.event.contacts.email}</p> : null}
                    {this.props.event.contacts.phone ?
                        <p><p className="label">{'Phone: '}</p> {this.props.event.contacts.phone}</p> : null}
                    {this.props.event.contacts.link ?
                        <p><p className="label">{'Link: '}</p> {this.props.event.contacts.link}</p> : null}
                    {this.props.event.contacts.location ?
                        <p><p className="label">{'Location: '}</p> {this.props.event.contacts.location}</p> : null}
                </ModalBody>
            </Modal>
        );
    }
};

export default EventClickPopUp;


