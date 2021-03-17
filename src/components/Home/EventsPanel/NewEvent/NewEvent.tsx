// eslint-disable-next-line
import React, { Component } from 'react';

import Switch from 'react-switch';
import { Redirect } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Geosuggest, { Suggest } from 'react-geosuggest';

import {
  Button,
  FormGroup,
  Label,
  Input,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Spinner,
} from 'reactstrap';
import eventInterface from './interface/event.interface';
import newEventInstance from '../../../../lib/apisInstances/newEvent';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './NewEvent.css';

interface Props {
  AccessToken: string;
  newEvent: boolean;
  newEventHandler: () => void;
  startSelected: Date;
  endSelected: Date;
}

class NewEvent extends Component<Props> {
  state = {
    name: '',
    initial: true,
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

  static getDerivedStateFromProps(
    nextProps: Readonly<Props>,
    state: any
  ): { start: Date; end: Date; initial: boolean } | null {
    if (state.initial) {
      return {
        start: nextProps.startSelected,
        end: nextProps.endSelected,
        initial: false,
      };
    }
    return null;
  }

  componentWillUnmount(): void {
    Array.from(document.querySelectorAll('input')).forEach((input) => {
      input.value = '';
    });
  }

  /* update location state */
  onSuggestSelect = (place: Suggest) => {
    if (!place) return;
    this.setState({
      contacts: {
        ...this.state.contacts,
        location: place.label,
      },
    });
  };

  /* submit event form */
  submitEvent = (): void => {
    /* event end time must be greater than start time */
    if (new Date(this.state.start) >= new Date(this.state.end)) {
      this.setState({
        warning: 'event start time must be greater than end time',
      });
      return;
    }
    const { warning, spinner, ...others } = this.state;
    const event: eventInterface = others;
    this.setState({ spinner: true });
    newEventInstance
      .post('', event, {
        headers: { Authorization: `Bearer ${this.props.AccessToken}` },
      })
      .then(() => {
        this.setState({ spinner: false });
        this.setState({ warning: <Redirect to="/main" exact /> });
        this.props.newEventHandler();
      })
      .catch((error) => {
        this.setState({
          spinner: false,
          warning: error.response.statusText,
        });
      });
  };

  /* update contact state except location */
  contactInfoHandler = (
    event: React.FormEvent<HTMLInputElement>,
    type: string
  ): void => {
    switch (type) {
      case 'Email':
        this.setState({
          contacts: {
            ...this.state.contacts,
            email: event.currentTarget.value,
          },
        });
        break;
      case 'Phone':
        this.setState({
          contacts: {
            ...this.state.contacts,
            phone: event.currentTarget.value,
          },
        });
        break;
      case 'Link':
        this.setState({
          contacts: {
            ...this.state.contacts,
            link: event.currentTarget.value,
          },
        });
        break;
      default:
        break;
    }
  };

  render() {
    return (
      <Modal
        className="CusModal"
        isOpen={this.props.newEvent}
        toggle={this.props.newEventHandler}
      >
        <ModalHeader className="CusModalFooter">Add New Event</ModalHeader>
        <ModalBody>
          <Form>
            <Col>
              <FormGroup className="FormGroupDate" row>
                <Label sm={2}>Select Start Time</Label>
                <DatePicker
                  className="form-control"
                  selected={this.state.start}
                  onChange={(date: Date) => {
                    this.setState({
                      start: new Date(date),
                      end: new Date(date.setMinutes(date.getMinutes() + 30)),
                    });
                  }}
                  showTimeSelect
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                />
              </FormGroup>
              <FormGroup className="FormGroupDate" row>
                <Label sm={2}>Select End Time</Label>
                <DatePicker
                  className="form-control"
                  selected={this.state.end}
                  onChange={(date: Date) => {
                    if (date < new Date(this.state.start)) {
                      this.setState({
                        warning:
                          'event start time must be greater than end time',
                      });
                      return;
                    }
                    this.setState({ warning: null });
                    this.setState({ end: new Date(date) });
                  }}
                  showTimeSelect
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                />
              </FormGroup>
              <FormGroup className="FormGroup" row>
                <Label sm={2}>Event Name</Label>
                <Col sm={10}>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="name"
                    onChange={(event) =>
                      this.setState({ name: event.target.value })}
                  />
                </Col>
              </FormGroup>
              <FormGroup className="FormGroup" row>
                <Label for="examplePassword" sm={2}>
                  Description
                </Label>
                <Col sm={10}>
                  <Input
                    type="textarea"
                    name="description"
                    id="description"
                    placeholder="description"
                    onChange={(event) =>
                      this.setState({ description: event.target.value })}
                  />
                </Col>
              </FormGroup>
              <FormGroup className="FormGroup" row>
                <Label sm={2}>Contacts (optional)</Label>
              </FormGroup>
              <FormGroup className="FormGroup" row>
                <Label sm={2}>Email</Label>
                <Col sm={10}>
                  <Input
                    placeholder="Email"
                    onChange={(event: React.FormEvent<HTMLInputElement>) => {
                      this.contactInfoHandler(event, 'Email');
                    }}
                  />
                </Col>
                <br />
                <br />
                <br />
                <Label sm={2}>Phone</Label>
                <Col sm={10}>
                  <Input
                    placeholder="Phone"
                    onChange={(event: React.FormEvent<HTMLInputElement>) => {
                      this.contactInfoHandler(event, 'Phone');
                    }}
                  />
                </Col>
                <br />
                <br />
                <Label sm={2}>Link</Label>
                <Col sm={10}>
                  <Input
                    placeholder="Link"
                    onChange={(event: React.FormEvent<HTMLInputElement>) => {
                      this.contactInfoHandler(event, 'Link');
                    }}
                  />
                </Col>
                <br />
                <br />
                <Label sm={2}>Location</Label>
                <Col sm={10}>
                  <Geosuggest
                    placeholder="Search for location"
                    onSuggestSelect={this.onSuggestSelect}
                  />
                </Col>
              </FormGroup>
              <FormGroup className="FormGroup" row>
                <Label sm={2}>Repeat</Label>
                <Col sm={10}>
                  <Input
                    type="select"
                    name="repeat"
                    id="repeat"
                    onChange={(event) =>
                      this.setState({ repeat: event.target.value })}
                  >
                    <option>None</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Biweekly</option>
                    <option>Daily</option>
                    <option>Yearly</option>
                  </Input>
                </Col>
              </FormGroup>
              {this.state.repeat !== 'None' && (
                <FormGroup className="FormGroupDate" row>
                  <Label sm={2}>Select Repeat End Time</Label>
                  <DatePicker
                    className="form-control"
                    selected={this.state.repeatEnds}
                    onChange={(date) => this.setState({ repeatEnds: date })}
                    dateFormat="yyyy/MM/dd"
                  />
                  <Label className="NeverEndsLabel" sm={2}>
                    Never Ends
                  </Label>
                  <Switch
                    onChange={(event: boolean) =>
                      this.setState({ repeatNeverEnds: event })}
                    checked={this.state.repeatNeverEnds}
                  />
                </FormGroup>
              )}
            </Col>
          </Form>
          <ModalFooter>
            <Button
              className="InfoButton"
              color="info"
              onClick={this.submitEvent}
            >
              Submit
            </Button>
            <Button
              className="SecondaryButton"
              color="secondary"
              onClick={this.props.newEventHandler}
            >
              Cancel
            </Button>
            {this.state.spinner && <Spinner color="info" />}
          </ModalFooter>
          <p className="warning">{this.state.warning}</p>
        </ModalBody>
      </Modal>
    );
  }
}

export default NewEvent;
