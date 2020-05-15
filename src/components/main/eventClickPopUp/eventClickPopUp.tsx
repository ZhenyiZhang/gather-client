import React, {useState} from 'react';
import {connect} from 'react-redux';
import EventInterface from '../../../store/interface/Event.interface';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css'

interface Props {
    popUp: boolean,
    event: EventInterface,
    popUpHandler: () => void
}

const EventClickPopUp = (props: Props) => {
    return(
        <Modal isOpen={props.popUp} toggle={props.popUpHandler} modalTransition={{ timeout: 300 }} >
            <ModalHeader toggle={props.popUpHandler}>{props.event.name}</ModalHeader>
            <ModalBody>{props.event.description}</ModalBody>
            <ModalFooter>
                <Button color="primary" >Edit</Button>
                <Button color="danger">Delete</Button>
            </ModalFooter>
        </Modal>
    );
};

export default EventClickPopUp;


