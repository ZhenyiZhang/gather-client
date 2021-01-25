import React, { Component } from "react";

import { Dispatch } from "redux";
import CopyToClipboard from "react-copy-to-clipboard";
import { connect } from "react-redux";
import { Alert, Button } from "reactstrap";
import eventInterface from "../../../store/interface/Event.interface";
import CalendarEvent from "./interface/calendarEvent.interface";
import OrganizationStateInterface from "../../../store/interface/OrganizationState.interface";
import EventClickPopUp from "./EventClickPopUp/EventClickPopUp";
import NewEvent from "./NewEvent/NewEvent";
import CalendarPanel from "./CalenderPanel/CalendarPanel";
import getProfileAction from "../TopPanel/actions/getProfileAction";
import ClientURL from "../../../lib/apisInstances/clientURL";
import getProfileInstance from "../../../lib/apisInstances/getProfile";
import tinyUrlInstance from "../../../lib/apisInstances/tinyURL";

/* Redux */

/* Style */
import "./CalenderPanel/CalendarPanel.css";
import "./EventsPanel.css";

/* component */
interface Props {
  events: eventInterface[];
  userId: string;
  share: boolean;
  AccessToken: string;
  getProfileDispatch: (organizationData: OrganizationStateInterface) => void;
}

class EventsPanel extends Component<Props> {
  state = {
    alert: false,
    copy: false,
    /* control whether event is clicked or not */
    popUp: false,
    /* controller for refreshing page */
    refresh: false,
    /* content in the pop up modal */
    shareUrl: "",
    popUpEvent: {
      name: "",
      description: "",
      start: new Date(),
      end: new Date(),
      repeat: "",
      repeatEnds: new Date(),
      repeatNeverEnds: false,
      _id: "",
      Organization: "",
      contacts: { email: "", link: "", phone: "", location: "" },
    },
    /* new event modal controller */
    newEvent: false,
    newEventSelectedStart: new Date(Date.now()),
    newEventSelectedEnd: new Date(Date.now()),
    /* the time range current calender view covers */
    calendarStart: new Date(Date.now()).setMonth(
      new Date(Date.now()).getMonth() - 1
    ),
    calendarEnd: new Date(Date.now()).setMonth(
      new Date(Date.now()).getMonth() + 1
    ),
  };

  /* update calendar time range state */
  onRangeChangeHandler = (start: Date, end: Date) => {
    this.setState({
      calendarStart: start,
      calendarEnd: end,
    });
  };

  newEventHandler = () => {
    this.setState({ newEvent: !this.state.newEvent });
    getProfileInstance
      .get("", {
        headers: { Authorization: `Bearer ${this.props.AccessToken}` },
      })
      .then((res) => {
        const profile: OrganizationStateInterface = res.data;
        this.props.getProfileDispatch(profile);
      })
      .catch(() => {
        alert("failed to access user profile");
      });
  };

  eventOnClickHandler = (calendarEvent: CalendarEvent) => {
    const event: eventInterface = {
      ...calendarEvent,
      start: calendarEvent.startDate,
      end: calendarEvent.endDate,
    };
    this.setState({
      popUpEvent: event,
      popUp: !this.state.popUp,
    });
  };

  refreshHandler = () => {
    getProfileInstance
      .get("", {
        headers: { Authorization: `Bearer ${this.props.AccessToken}` },
      })
      .then((res) => {
        const profile: OrganizationStateInterface = res.data;
        this.props.getProfileDispatch(profile);
      })
      .catch(() => {
        alert("failed to access user profile");
      });
  };

  popUpToggle = () => {
    this.setState({
      popUp: !this.state.popUp,
    });
  };

  linkOnCopyHandler = async () => {
    const shareUrl = await tinyUrlInstance.post("", {
      longURL: `${ClientURL}/shared/${this.props.userId}`,
    });
    this.setState({ shareUrl: shareUrl.data.shortURL });
    setTimeout(() => {
      this.setState({ alert: false });
    }, 1000);
    this.setState({ copy: true, alert: true });
  };

  slotOnClickHandler = (start: Date, end: Date) => {
    this.setState({
      newEventSelectedStart: new Date(start),
      newEventSelectedEnd: new Date(end),
    });
    this.newEventHandler();
  };

  render() {
    return (
      <div>
        <div className="TopControl">
          <Button
            className="NewEventButton"
            color="info"
            onClick={this.newEventHandler}
          >
            New Event
          </Button>
          {this.props.share && (
            <CopyToClipboard
              text={this.state.shareUrl}
              onCopy={this.linkOnCopyHandler}
            >
              <Button className="Share" color="info">
                Link to Share
              </Button>
            </CopyToClipboard>
          )}
          <Alert
            className="CopyAlert"
            color="success"
            isOpen={this.state.alert}
            fade
          >
            Copied
          </Alert>
        </div>
        <CalendarPanel
          startDate={new Date(this.state.calendarStart)}
          endDate={new Date(this.state.calendarEnd)}
          eventsList={this.props.events}
          onRangeChangeHandler={this.onRangeChangeHandler}
          eventOnClickHandler={this.eventOnClickHandler}
          slotOnClickHandler={this.slotOnClickHandler}
        />
        <EventClickPopUp
          event={this.state.popUpEvent}
          popUp={this.state.popUp}
          popUpToggle={this.popUpToggle}
          refreshHandler={this.refreshHandler}
          AccessToken={this.props.AccessToken}
        />
        <NewEvent
          AccessToken={this.props.AccessToken}
          newEvent={this.state.newEvent}
          newEventHandler={this.newEventHandler}
          startSelected={this.state.newEventSelectedStart}
          endSelected={this.state.newEventSelectedEnd}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: OrganizationStateInterface) => {
  return {
    events: state.events,
    userId: state._id,
    share: state.share,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getProfileDispatch: (organizationData: OrganizationStateInterface) => {
      const action: getProfileAction = {
        type: "getProfile",
        organization: organizationData,
      };
      dispatch(action);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventsPanel);
