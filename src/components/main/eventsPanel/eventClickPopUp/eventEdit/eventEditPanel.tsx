import React from 'react';
import {Component} from 'react';
import updateEventInstance from '../../../../../apisInstances/updateEvent'
import EventInterface from '../../../../../store/interface/Event.interface';
import NewEvent from '../../../topPanel/newEvent/interface/event.interface'
import {Button, Modal, ModalBody, ModalFooter, FormGroup, Label, Input, Col, Form} from 'reactstrap';
import Switch from "react-switch";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import './eventEditPanel.css';

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
        repeatEnds: new Date(this.props.event.repeatEnds),
        start: new Date(this.props.event.start),
        end: new Date(this.props.event.end),
        repeatNeverEnds: this.props.event.repeatNeverEnds,
        contacts: this.props.event.contacts,
        warning: '',
    };

    submitHandler = () => {
        const {warning,  ...others} = this.state;
        const updateData: NewEvent = others;
        updateEventInstance.post(this.props.event._id, updateData,
            {headers:{Authorization: 'Bearer ' + this.props.AccessToken}})
            .then(() => {
                this.props.refreshHandler();
                this.props.editingToggle();
                this.props.popUpToggle();
            })
            .catch((err) => {alert(err)});
    };

    contactInfoHandler = (event: React.FormEvent<HTMLInputElement>, type: string) => {
        switch (type) {
            case 'Email':
                this.setState({
                    contacts: {
                        ...this.state.contacts,
                        email: event.currentTarget.value,
                    }
                });
                console.log(this.state.contacts);
                break;
            case 'Phone':
                this.setState({
                    contacts: {
                        phone: event.currentTarget.value,
                        ...this.state.contacts
                    }
                });
                break;
            case 'Location':
                this.setState({
                    contacts: {
                        location: event.currentTarget.value,
                        ...this.state.contacts
                    }
                });
                break;
            case 'Link':
                this.setState({
                    contacts: {
                        link: event.currentTarget.value,
                        ...this.state.contacts
                    }
                });
                break;
        }
    };

    render() {
        return (
            <Modal className="CusModal" isOpen={this.props.editing} toggle={this.props.editingToggle}>
                <ModalBody>
                    <Form>
                        <Col>
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
                                <Label sm={2}>Contacts</Label>
                            </FormGroup>
                            <FormGroup className="FormGroup" row>
                                <Label sm={2}>Email</Label>
                                <Col sm={10}>
                                    <Input placeholder={this.props.event.contacts.email}
                                           onChange={(event:  React.FormEvent<HTMLInputElement>) => {
                                               this.contactInfoHandler(event, 'Email');
                                           }}> </Input>
                                </Col>
                                <Label sm={2}>Phone</Label>
                                <Col sm={10}>
                                    <Input placeholder={this.props.event.contacts.phone}
                                           onChange={(event:  React.FormEvent<HTMLInputElement>) => {
                                               this.contactInfoHandler(event, 'Phone');
                                           }}> </Input>
                                </Col>
                                <Label sm={2}>Link</Label>
                                <Col sm={10}>
                                    <Input placeholder={this.props.event.contacts.link}
                                           onChange={(event:  React.FormEvent<HTMLInputElement>) => {
                                               this.contactInfoHandler(event, 'Link');
                                           }}> </Input>
                                </Col>
                                <Label sm={2}>Location</Label>
                                <Col sm={10}>
                                    <Input placeholder={this.props.event.contacts.location}
                                           onChange={(event:  React.FormEvent<HTMLInputElement>) => {
                                               this.contactInfoHandler(event, 'Location');
                                           }}> </Input>
                                </Col>
                            </FormGroup>
                            <FormGroup className="FormGroup" row>
                                <Label sm={2}>Repeat</Label>
                                <Col sm={10}>
                                    <Input type="select" name="repeat" id="repeat" value={this.props.event.repeat}
                                           onChange={event => this.setState({repeat: event.target.value})}>
                                        <option>None</option>
                                        <option>Weekly</option>
                                        <option>Monthly</option>
                                        <option>Biweekly</option>
                                        <option>Daily</option>
                                        <option>Yearly</option>
                                    </Input>
                                </Col>
                            </FormGroup >
                            {this.state.repeat !== 'None' ? <FormGroup className="FormGroupDate" row>
                                <Label sm={2}>Select Repeat End Time</Label>
                                <DatePicker className="form-control"
                                            selected={this.state.repeatEnds}
                                            onChange={date => this.setState({repeatEnds: date})}
                                            dateFormat="yyyy/MM/dd"
                                />
                                <Label className="NeverEndsLabel" sm={2}>Never Ends</Label>
                                <Switch
                                    onChange={(event: boolean) => this.setState({repeatNeverEnds: event})}
                                    checked={this.props.event.repeatNeverEnds}/>
                            </FormGroup> : null}
                        </Col>
                    </Form>
                    <ModalFooter>
                        <Button color="info" onClick={this.submitHandler}>Submit</Button>
                    </ModalFooter>
                    <p className="warning">{this.state.warning}</p>
                </ModalBody>
            </Modal>
        )
    }
}

export default EventEditPanel;

