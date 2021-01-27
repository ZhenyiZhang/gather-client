import React, { Component } from 'react';
import dateformat from 'dateformat';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PopUpEvent from './interface/PopUpEvent.interface';
import deleteEventInstance from '../../../../lib/apisInstances/deleteEvent';
import eventRepeatExceptionInstance from '../../../../lib/apisInstances/eventRepeatException';
import EventEditPanel from './EventEditPanel/EventEditPanel';

import 'bootstrap/dist/css/bootstrap.min.css';
import './EventClickPopUp.css';

interface Props {
  popUp: boolean;
  event: PopUpEvent;
  AccessToken: string;
  popUpToggle: () => void;
  refreshHandler: () => void;
}

class EventClickPopUp extends Component<Props> {
  state = {
    editing: false,
    startTimeReformat: dateformat(
      this.props.event.start,
      'dddd, mmmm dS, yyyy, h:MM:ss TT'
    ),
    endTimeReformat: dateformat(
      this.props.event.end,
      'dddd, mmmm dS, yyyy, h:MM:ss TT'
    ),
  };

  /* toggle event editing option */
  editingToggle = (): void => {
    this.setState({ editing: !this.state.editing });
  };

  /* refresh the page */
  refreshHandler = (): void => {
    this.props.refreshHandler();
  };

  /* submit event delete */
  deleteEventHandler = (): void => {
    deleteEventInstance
      .delete(this.props.event._id, {
        headers: { Authorization: `Bearer ${this.props.AccessToken}` },
      })
      .then(() => {
        this.props.popUpToggle();
        this.props.refreshHandler();
      })
      .catch(() => {
        alert('failed to delete the event');
      });
  };

  /* delete one time of repeated events */
  deleteOneTimeHandler = (): void => {
    eventRepeatExceptionInstance
      .post(
        this.props.event._id,
        { date: this.props.event.start },
        { headers: { Authorization: `Bearer ${this.props.AccessToken}` } }
      )
      .then(() => {
        this.props.popUpToggle();
        this.refreshHandler();
      })
      .catch((err) => {
        alert(err);
      });
  };

  render() {
    const { contacts } = this.props.event;
    return (
      <Modal
        className="PopUpModal"
        isOpen={this.props.popUp}
        toggle={this.props.popUpToggle}
        modalTransition={{ timeout: 300 }}
      >
        <ModalHeader className="lead" toggle={this.props.popUpToggle}>
          {this.props.event.name}
        </ModalHeader>
        <ModalBody>
          <p className="lead">{this.props.event.description}</p>
          <p className="label">Start Date:</p>
          <p>
            {dateformat(this.props.event.start, 'dddd, mmmm dS, yyyy, h:MM TT')}
          </p>
          <p className="label">End Date:</p>
          <p>
            {dateformat(this.props.event.end, 'dddd, mmmm dS, yyyy, h:MM TT')}
          </p>
          {this.props.event.repeat === 'None' &&
          this.props.event.repeatNeverEnds ? (
            <p>
              <strong className="label">Repeat:</strong>
              Never Ends
            </p>
          ) : (
            <p>
              <strong className="label">
                {' '}
                {`Event repeats ${this.props.event.repeat} until`}
              </strong>
              <br />
              {dateformat(
                this.props.event.repeatEnds,
                'dddd, mmmm dS, yyyy, h:MM TT'
              )}
            </p>
          )}
          {contacts !== undefined &&
            Object.entries(contacts).map(([key, value]) => {
              return (
                value.length > 0 && (
                  <p key={key}>
                    <strong className="label">{`${key}: `}</strong>
                    {value}
                  </p>
                )
              );
            })}
        </ModalBody>
        <ModalFooter>
          <Button
            className="InfoButton"
            color="info"
            onClick={this.editingToggle}
          >
            Edit
          </Button>
          <Button
            className="DangerButton"
            color="danger"
            onClick={() => {
              this.deleteEventHandler();
            }}
          >
            Delete
          </Button>
          {this.props.event.repeat !== 'None' && (
            <div>
              <Button
                className="DangerButton"
                color="danger"
                onClick={() => {
                  this.deleteOneTimeHandler();
                }}
              >
                Delete This Time
              </Button>
            </div>
          )}
        </ModalFooter>
        <EventEditPanel
          AccessToken={this.props.AccessToken}
          refreshHandler={this.refreshHandler}
          editing={this.state.editing}
          event={this.props.event}
          editingToggle={this.editingToggle}
          popUpToggle={this.props.popUpToggle}
        />
      </Modal>
    );
  }
}

export default EventClickPopUp;
