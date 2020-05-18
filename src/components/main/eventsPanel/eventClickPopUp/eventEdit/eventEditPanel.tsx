import React from 'react';
import {Component} from 'react';
import updateEventInstance from '../../../../../apisInstances/updateEvent'
import EventInterface from '../../../../../store/interface/Event.interface';
import NewEvent from '../../../topPanel/newEvent/interface/event.interface'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Col } from 'reactstrap';
import DatePicker from "react-datepicker";

interface Props {
    editing: boolean,
    AccessToken: string,
    event: EventInterface,
    editingToggle: () => void,
    popUpToggle: () => void,
    refreshHandler: () => void
}

class EventEditPanel extends Component<Props> {
    state = {
        repeat: this.props.event.repeat,
        name: this.props.event.name,
        description: this.props.event.description,
        repeatEnds: this.props.event.repeatEnds,
        start: new Date(this.props.event.start),
        end: new Date(this.props.event.end),
        repeatNeverEnds: this.props.event.repeatNeverEnds,
        warning: '',
    };

    submitHandler = () => {
        const updateData: NewEvent = {
            repeat: this.state.repeat,
            name: this.state.name,
            description: this.state.description,
            repeatEnds: this.state.repeatEnds,
            repeatNeverEnds: this.state.repeatNeverEnds,
            start: this.state.start,
            end: this.state.end,
        };
        updateEventInstance.post(this.props.event._id, updateData,
            {headers:{Authorization: 'Bearer ' + this.props.AccessToken}})
            .then(() => {
                this.props.refreshHandler();
                this.props.editingToggle();
                this.props.popUpToggle();
            })
            .catch((err) => {alert(err)});
    };

    render() {
        return (
            <Modal isOpen={this.props.editing} toggle={this.props.editingToggle} modalTransition={{ timeout: 300 }} >
                <ModalHeader toggle={this.props.editingToggle}>{this.props.event.name}</ModalHeader>
                <ModalBody>
                    <FormGroup className="FormGroupDate" row>
                        <Label sm={2}>Select Start Time</Label>
                        <DatePicker className="form-control"
                                    selected={this.state.start}
                                    onChange={date => this.setState({start: date})}
                                    showTimeSelect
                                    timeIntervals={15}
                                    timeCaption="time"
                                    dateFormat="MMMM d, yyyy h:mm aa"
                        />
                    </FormGroup>
                    <FormGroup className="FormGroupDate" row>
                        <Label sm={2}>Select End Time</Label>
                        <DatePicker className="form-control"
                                    selected={this.state.end}
                                    onChange={date => this.setState({end: date})}
                                    showTimeSelect
                                    timeIntervals={15}
                                    timeCaption="time"
                                    dateFormat="MMMM d, yyyy h:mm aa"
                        />
                    </FormGroup>
                    <FormGroup className="FormGroup" row>
                        <Label sm={2}>Event Name</Label>
                        <Col sm={10}>
                            <Input type="text" name="name" id="name" placeholder={this.props.event.name}
                                   onChange={event => this.setState({name: event.target.value})}/>
                        </Col>
                    </FormGroup>
                    <FormGroup className="FormGroup" row>
                        <Label for="examplePassword" sm={2}>Description</Label>
                        <Col sm={10}>
                            <Input type="textarea" name="description" id="description" placeholder={this.props.event.description}
                                   onChange={event => this.setState({description: event.target.value})}/>
                        </Col>
                    </FormGroup>
                    <FormGroup className="FormGroup" row>
                        <Label sm={2}>Repeat</Label>
                        <Col sm={10}>
                            <Input type="select" name="repeat" id="repeat" value={this.state.repeat}
                                   onChange={event => this.setState({repeat: event.target.value})}>
                                <option>None</option>
                                <option>Weekly</option>
                                <option>Monthly</option>
                                <option>Biweekly</option>
                                <option>Daily</option>
                                <option>Yearly</option>
                            </Input>
                        </Col>
                    </FormGroup>
                    {this.state.repeat !== 'None' ? <FormGroup className="FormGroupDate" row>
                        <Label sm={2}>Select Repeat End Time</Label>
                        <DatePicker className="form-control"
                                    selected={new Date()}
                                    onChange={date => this.setState({repeatEnds: date})}
                                    dateFormat="yyyy/MM/dd"
                        />
                    </FormGroup> : null}
                    <p className="warning">{this.state.warning}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.submitHandler}> Submit </Button>
                </ModalFooter>
            </Modal>
        )
    }
}

export default EventEditPanel;

