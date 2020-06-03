import React from 'react';
import {Component} from 'react';
import newEventInstance from '../../../../apisInstances/newEvent'
import eventInterface from './interface/event.interface';
import Switch from "react-switch";
import {Redirect} from "react-router-dom";
import DatePicker from 'react-datepicker';

import {Button, FormGroup, Label, Input, Col, Modal, ModalBody, ModalFooter, Form, Spinner} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-datepicker/dist/react-datepicker.css';
import './newEvent.css';

interface Props {
    AccessToken: string,
    newEvent: boolean,
    newEventHandler: () => void
    startSelected: Date,
    endSelected: Date,
}

class NewEvent extends Component<Props> {
    state = {
        name: '',
        start: new Date(this.props.startSelected),
        end: new Date(this.props.endSelected),
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
        spinner: false,
    };

    componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
        if(nextProps.startSelected !== this.state.start) {
            this.setState({
                start: nextProps.startSelected,
                end: nextProps.endSelected
            })
        }
    };

    submitEvent = () => {
        if(new Date(this.state.start) >= new Date(this.state.end)) {
            this.setState({warning: 'event start time must be greater than end time'});
            return
        }
        const {warning, spinner, ...others} = this.state;
        const event: eventInterface = others;
        this.setState({spinner: true});
        newEventInstance.post('', event,
            {headers:{Authorization: 'Bearer ' + this.props.AccessToken}})
            .then(() => {
                this.setState({spinner: false});
                this.setState({warning : (<Redirect to={'/main'} exact/>)});
                this.props.newEventHandler();
            })
            .catch(error => {this.setState({
                spinner: false,
                warning: error.response.statusText})})
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
                                            onChange={(date: Date) => {
                                                this.setState({
                                                    start: new Date(date),
                                                    end: new Date(date.setMinutes(date.getMinutes() + 30))
                                                })}}
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
                                            onChange={(date: Date) => {
                                                if(date < new Date(this.state.start)) {
                                                    this.setState({warning: 'event start time must be greater than end time'});
                                                    return;
                                                }
                                                this.setState({warning: null});
                                                this.setState({end: new Date(date)})}}
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
                                <Label sm={2}>Contacts (optional)</Label>
                            </FormGroup>
                            <FormGroup className="FormGroup" row>
                                    <Label sm={2}>Email</Label>
                                    <Col sm={10}>
                                        <Input placeholder="Email"
                                               onChange={(event:  React.FormEvent<HTMLInputElement>) => {
                                                   this.contactInfoHandler(event, 'Email');
                                               }}/>
                                    </Col>
                                <br/><br/>
                                    <Label sm={2}>Phone</Label>
                                    <Col sm={10}>
                                        <Input placeholder="Phone"
                                               onChange={(event:  React.FormEvent<HTMLInputElement>) => {
                                                   this.contactInfoHandler(event, 'Phone');
                                               }}/>
                                    </Col>
                                <br/><br/>
                                <Label sm={2}>Link</Label>
                                <Col sm={10}>
                                    <Input placeholder="Link"
                                           onChange={(event:  React.FormEvent<HTMLInputElement>) => {
                                               this.contactInfoHandler(event, 'Link');
                                           }}/>
                                </Col>
                                <br/><br/>
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
                        {this.state.spinner? <Spinner color="info"/> : null}
                    </ModalFooter>
                    <p className="warning">{this.state.warning}</p>
                </ModalBody>
            </Modal>
        );
    }
}

export default NewEvent;