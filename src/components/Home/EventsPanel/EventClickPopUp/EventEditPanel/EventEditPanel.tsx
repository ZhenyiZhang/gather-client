// eslint-disable-next-line
import React, { Component } from 'react';

import Switch from 'react-switch';
import DatePicker from 'react-datepicker';
import Geosuggest, { Suggest } from 'react-geosuggest';

import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Col,
  Form,
  ModalHeader,
  Spinner,
} from 'reactstrap';
import NewEvent from '../../NewEvent/interface/event.interface';
import EventInterface from '../../../../../store/interface/Event.interface';
import updateEventInstance from '../../../../../lib/apisInstances/updateEvent';
import 'react-datepicker/dist/react-datepicker.css';
import './EventEditPanel.css';

interface Props {
  editing: boolean;
  AccessToken: string;
  event: EventInterface;
  editingToggle: () => void;
  popUpToggle: () => void;
  refreshHandler: () => void;
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
    spinner: false,
    warning: '',
  };

  static getDerivedStateFromProps(
    nextProps: Readonly<Props>,
    state: any
  ): EventInterface | null {
    if (nextProps.event.name !== state.name) {
      return { ...nextProps.event };
    }
    return null;
  }

  componentWillUnmount(): void {
    Array.from(document.querySelectorAll('input')).forEach((input) => {
      input.value = '';
    });
  }

  /* submit event modification form */
  submitHandler = (): void => {
    const { warning, spinner, ...others } = this.state;
    const updateData: NewEvent = others;
    this.setState({ spinner: true });
    updateEventInstance
      .put(this.props.event._id, updateData, {
        headers: { Authorization: `Bearer ${this.props.AccessToken}` },
      })
      .then(() => {
        this.setState({ spinner: false });
        this.props.refreshHandler();
        this.props.editingToggle();
        this.props.popUpToggle();
      })
      .catch((err) => {
        this.setState({ spinner: false });
        alert(err);
      });
  };

  /* update location state */
  onSuggestSelect = (place: Suggest): void => {
    if (!place) return;
    this.setState({
      contacts: {
        ...this.state.contacts,
        location: place.label,
      },
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
        console.log(this.state.contacts);
        break;
      case 'Phone':
        this.setState({
          contacts: {
            ...this.state.contacts,
            phone: event.currentTarget.value,
          },
        });
        break;
      case 'Location':
        this.setState({
          contacts: {
            ...this.state.contacts,
            location: event.currentTarget.value,
          },
        });
        break;
      case 'Link':
        this.setState({
          contacts: {
            ...this.state.contacts,
            location: event.currentTarget.value,
          },
        });
        break;
      default: {
        break;
      }
    }
  };

  render() {
    return (
      <Modal
        className="CusModal"
        isOpen={this.props.editing}
        toggle={this.props.editingToggle}
      >
        <ModalHeader className="lead" toggle={this.props.editingToggle}>
          Edit Event
        </ModalHeader>
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
                    value={this.state.name}
                    id="name"
                    placeholder={this.props.event.name}
                    onChange={(event) =>
                      this.setState({ name: event.target.value })
                    }
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
                    value={this.state.description}
                    id="description"
                    placeholder="description"
                    onChange={(event) =>
                      this.setState({ description: event.target.value })
                    }
                  />
                </Col>
              </FormGroup>
              <FormGroup className="FormGroup" row>
                <Label sm={2}>Contacts</Label>
              </FormGroup>
              <FormGroup className="FormGroup" row>
                <Label sm={2}>Email</Label>
                <Col sm={10}>
                  <Input
                    placeholder="Email"
                    value={this.state.contacts.email}
                    onChange={(event: React.FormEvent<HTMLInputElement>) => {
                      this.contactInfoHandler(event, 'Email');
                    }}
                  />
                </Col>
                <br />
                <br />
                <Label sm={2}>Phone</Label>
                <Col sm={10}>
                  <Input
                    placeholder="Phone"
                    value={this.state.contacts.phone}
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
                    value={this.state.contacts.link}
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
                    onSuggestSelect={this.onSuggestSelect}
                    placeholder={this.state.contacts.location}
                  />
                </Col>
                <br />
                <br />
              </FormGroup>
              <FormGroup className="FormGroup" row>
                <Label sm={2}>Repeat</Label>
                <Col sm={10}>
                  <Input
                    type="select"
                    name="repeat"
                    id="repeat"
                    value={this.state.repeat}
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
              {this.state.repeat !== 'None' ? (
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
                      this.setState({ repeatNeverEnds: event })
                    }
                    checked={this.state.repeatNeverEnds}
                  />
                </FormGroup>
              ) : null}
            </Col>
          </Form>
          <ModalFooter>
            <Button
              className="InfoButton"
              color="info"
              onClick={this.submitHandler}
            >
              Submit
            </Button>
            {this.state.spinner ? <Spinner color="info" /> : null}
          </ModalFooter>
          <p className="warning">{this.state.warning}</p>
        </ModalBody>
      </Modal>
    );
  }
}

export default EventEditPanel;
