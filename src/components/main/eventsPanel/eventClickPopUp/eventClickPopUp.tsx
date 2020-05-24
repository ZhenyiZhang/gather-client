import React, {Component} from 'react';
import EventInterface from '../../../../store/interface/Event.interface';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import deleteEventInstance from '../../../../apisInstances/deleteEvent';
import dateformat from 'dateformat';
import EventEditPanel from './eventEdit/eventEditPanel';
import 'bootstrap/dist/css/bootstrap.min.css';
import './eventClickPopUp.css';

interface Props {
    popUp: boolean,
    event: EventInterface,
    AccessToken: string,
    popUpToggle: () => void,
    refreshHandler: () => void
}

class EventClickPopUp extends Component<Props> {
    state = {
        editing : false,
        startTimeReformat: dateformat(this.props.event.start,"dddd, mmmm dS, yyyy, h:MM:ss TT"),
        endTimeReformat: dateformat(this.props.event.end,"dddd, mmmm dS, yyyy, h:MM:ss TT")
    };

    editingToggle = () => {
        this.setState({ editing: !this.state.editing });
    };

    refreshHandler = () => {
        this.props.refreshHandler();
    };

    deleteEventHandler = () => {
        deleteEventInstance.delete(this.props.event._id,
            {headers:{Authorization: 'Bearer ' + this.props.AccessToken}})
            .then(() => {
                this.props.popUpToggle();
                this.props.refreshHandler();
            })
            .catch(() => {
                alert('failed to delete the event');
            });
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
                <ModalFooter>
                    <Button color="info" onClick={this.editingToggle}> Edit </Button>
                    <Button color="danger"
                            onClick={() => {this.deleteEventHandler()}}> Delete </Button>
                </ModalFooter>
                <EventEditPanel
                    AccessToken={this.props.AccessToken}
                    refreshHandler={this.refreshHandler}
                    editing={this.state.editing}
                    event={this.props.event}
                    editingToggle={this.editingToggle}
                    popUpToggle={this.props.popUpToggle}/>
            </Modal>
        );
    }
};

export default EventClickPopUp;


