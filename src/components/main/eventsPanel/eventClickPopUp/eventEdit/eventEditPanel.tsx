import React from 'react';
import {Component} from 'react';
import EventInterface from '../../../../../store/interface/Event.interface';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Col } from 'reactstrap';

interface Props {
    editing: boolean,
    event: EventInterface,
    editingToggle: () => void,
}

class EventEditPanel extends Component<Props> {
    
    render() {
        return (
            <Modal isOpen={this.props.editing} toggle={this.props.editingToggle} modalTransition={{ timeout: 300 }} >
                <ModalHeader toggle={this.props.editingToggle}>test</ModalHeader>
                <ModalBody>test</ModalBody>
                <ModalFooter>
                    <Button color="primary" > Submit </Button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default EventEditPanel;

