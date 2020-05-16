import React, {Component} from 'react';
import EventInterface from '../../../../store/interface/Event.interface';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import deleteEventInstance from '../../../../apisInstances/deleteEvent';
import EventEditPanel from './eventEdit/eventEditPanel'
import 'bootstrap/dist/css/bootstrap.min.css'

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
    };

    editingToggle = () => {
        this.setState({ editing: !this.state.editing });
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
                <ModalHeader toggle={this.props.popUpToggle}>{this.props.event.name}</ModalHeader>
                <ModalBody>{this.props.event.description}</ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.editingToggle}> Edit </Button>
                    <Button color="danger"
                            onClick={() => {this.deleteEventHandler()}}> Delete </Button>
                </ModalFooter>
                <EventEditPanel editing={this.state.editing} event={this.props.event} editingToggle={this.editingToggle}/>
            </Modal>
        );
    }
};

export default EventClickPopUp;


