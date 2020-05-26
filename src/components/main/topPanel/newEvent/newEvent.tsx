import React from 'react';
import {Component} from 'react';
import newEventInstance from '../../../../apisInstances/newEvent'
import eventInterface from './interface/event.interface';
import {Button, FormGroup, Label, Input, Col, Modal, ModalBody, ModalFooter, Form} from 'reactstrap';
import Switch from "react-switch";
import {Redirect} from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-datepicker/dist/react-datepicker.css';
import './newEvent.css';

interface Props {
    AccessToken: string,
    newEvent: boolean,
    newEventHandler: () => void
}

class NewEvent extends Component<Props> {
    state = {
        name: '',
        start: new Date(),
        end: new Date(),
        repeatEnds: new Date(),
        contacts: {
            email: '',
            link: '',
            phone: '',
            location: '',
        },
        repeatNeverEnds: false,
        repeat: 'None',
        description: '',
        warning: null,
    };

    submitEvent = () => {
        const {warning, ...others} = this.state;
        const event: eventInterface = others;
        console.log(event);
        newEventInstance.post('', event,
            {headers:{Authorization: 'Bearer ' + this.props.AccessToken}})
            .then(() => {
                this.setState({warning : (<Redirect to={'/main'} exact/>)});
                this.props.newEventHandler();
            })
            .catch(error => {this.setState({warning: error.response.statusText})})
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
                        ...this.state.contacts,
                        phone: event.currentTarget.value,
                    }
                });
                break;
            case 'Location':
                this.setState({
                    contacts: {
                        ...this.state.contacts,
                        location: event.currentTarget.value,
                    }
                });
                break;
            case 'Link':
                this.setState({
                    contacts: {
                        ...this.state.contacts,
                        link: event.currentTarget.value,
                    }
                });
                break;
        }
    };

    render() {
        return (
            <Modal className="CusModal" isOpen={this.props.newEvent} toggle={this.props.newEventHandler}>
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
                                    <Input type="text" name="name" id="name" placeholder="name"
                                           onChange={event => this.setState({name: event.target.value})}/>
                                </Col>
                            </FormGroup>
                            <FormGroup className="FormGroup" row>
                                <Label for="examplePassword" sm={2}>Description</Label>
                                <Col sm={10}>
                                    <Input type="textarea" name="description" id="description" placeholder="description"
                                           onChange={event => this.setState({description: event.target.value})}/>
                                </Col>
                            </FormGroup>
                            <FormGroup className="FormGroup" row>
                                <Label sm={2}>Contacts</Label>
                            </FormGroup>
                            <FormGroup className="FormGroup" row>
                                    <Label sm={2}>Email</Label>
                                    <Col sm={10}>
                                        <Input placeholder="Email"
                                               onChange={(event:  React.FormEvent<HTMLInputElement>) => {
                                                   this.contactInfoHandler(event, 'Email');
                                               }}/>
                                    </Col>
                                    <Label sm={2}>Phone</Label>
                                    <Col sm={10}>
                                        <Input placeholder="Phone"
                                               onChange={(event:  React.FormEvent<HTMLInputElement>) => {
                                                   this.contactInfoHandler(event, 'Phone');
                                               }}/>
                                    </Col>
                                <Label sm={2}>Link</Label>
                                <Col sm={10}>
                                    <Input placeholder="Link"
                                           onChange={(event:  React.FormEvent<HTMLInputElement>) => {
                                               this.contactInfoHandler(event, 'Link');
                                           }}/>
                                </Col>
                                <Label sm={2}>Location</Label>
                                <Col sm={10}>
                                    <Input placeholder="Location"
                                           onChange={(event:  React.FormEvent<HTMLInputElement>) => {
                                               this.contactInfoHandler(event, 'Location');
                                           }}/>
                                </Col>
                            </FormGroup>
                            <FormGroup className="FormGroup" row>
                                <Label sm={2}>Repeat</Label>
                                <Col sm={10}>
                                    <Input type="select" name="repeat" id="repeat"
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
                                    checked={this.state.repeatNeverEnds}/>
                            </FormGroup> : null}
                        </Col>
                    </Form>
                    <ModalFooter>
                        <Button color="info" onClick={this.submitEvent}>Submit</Button>
                        <Button color="secondary" onClick={this.props.newEventHandler}>Cancel</Button>
                    </ModalFooter>
                    <p className="warning">{this.state.warning}</p>
                </ModalBody>
            </Modal>
        );
    }
}

export default NewEvent;