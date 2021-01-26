import React, { Component } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import Switch from 'react-switch';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Alert, Button, Form, FormGroup, Label, Input, Row } from 'reactstrap';
import tinyUrlInstance from '../../lib/apisInstances/tinyURL';
import OrganizationStateInterface from '../../store/interface/OrganizationState.interface';
import ClientURL from '../../lib/apisInstances/clientURL';
import updateProfileInstance from '../../lib/apisInstances/updateProfile';
import getProfileInstance from '../../lib/apisInstances/getProfile';
import getProfileAction from '../../components/Home/EventsPanel/UserInfo/actions/getProfileAction';

import 'bootstrap/dist/css/bootstrap.min.css';
import './profilePage.css';

interface Props {
  organization: OrganizationStateInterface;
  AccessToken: string;
  getProfileDispatch: (organizationData: OrganizationStateInterface) => void;
}

interface DerivedPropsState {
  organizationName: string;
  email: string;
  description: string;
  share: boolean;
}

interface State {
  edit: boolean;
  copied: boolean;
  alert: boolean;
  link: string;
  organizationName: string;
  email: string;
  description: string;
  share: boolean;
}

class ProfilePage extends Component<Props> {
  state = {
    edit: false,
    organizationName: this.props.organization.organizationName || '',
    email: this.props.organization.email || '',
    description: this.props.organization.description || '',
    share: this.props.organization.share || false,
    copied: false,
    alert: false,
    link: '',
  };

  static getDerivedStateFromProps(
    nextProps: Props,
    prevState: State
  ): DerivedPropsState | null {
    if (prevState.organizationName === '') {
      return {
        organizationName: nextProps.organization.organizationName,
        email: nextProps.organization.email,
        description: nextProps.organization.description,
        share: nextProps.organization.share,
      };
    }
    return null;
  }

  componentDidMount() {
    tinyUrlInstance
      .post('', {
        longURL: `${ClientURL}/shared/${this.props.organization._id}`,
      })
      .then((response) => {
        const { shortURL } = response.data;
        this.setState({ link: shortURL });
      });
  }

  /* submit profile modification form */
  submitHandler = () => {
    const { link, edit, ...updateProfile } = this.state;
    updateProfileInstance
      .post('', updateProfile, {
        headers: { Authorization: `Bearer ${this.props.AccessToken}` },
      })
      .then(() => {
        this.setState({ edit: false });
        getProfileInstance
          .get('', {
            headers: { Authorization: `Bearer ${this.props.AccessToken}` },
          })
          .then((res) => {
            const profile: OrganizationStateInterface = res.data;
            this.props.getProfileDispatch(profile);
          });
      })
      .catch((err) => {
        alert(err);
      });
  };

  /* copy share link to clipboard */
  linkOnCopyHandler = (): boolean => {
    this.setState({ copied: true });
    setTimeout(() => {
      this.setState({ alert: true });
    }, 300);
    setTimeout(() => {
      this.setState({ alert: false });
    }, 2000);
    return this.state.copied;
  };

  render() {
    return (
      <div className="ProfilePageContainer">
        {!this.state.edit ? (
          <div className="ProfileContainer">
            <h4>User/Group Name:</h4>
            <h5>{this.props.organization.organizationName}</h5>
            <h4>Registered Email</h4>
            <h5>{this.props.organization.email}</h5>
            <h4>Description:</h4>
            <h5>{this.props.organization.description}</h5>
            <h4>Share Events:</h4>
            <h5>{this.props.organization.share ? 'Yes' : 'No'}</h5>
            <h4>Link to share:</h4>
            <a href={this.state.link}>{this.state.link}</a>
            <br />
            <Row>
              <Button
                className="ProfileEditBtn"
                onClick={() => {
                  this.setState({ edit: !this.state.edit });
                }}
                color="info"
              >
                Edit
              </Button>
              {this.props.organization.share && (
                <CopyToClipboard
                  text={this.state.link}
                  onCopy={() => {
                    this.linkOnCopyHandler();
                  }}
                >
                  <Button className="LinkBadge" color="primary">
                    Copy link
                  </Button>
                </CopyToClipboard>
              )}
            </Row>
            <br />
            <Alert
              className="CopyAlert"
              color="success"
              isOpen={this.state.alert}
              fade
            >
              Copied to clipboard
            </Alert>
          </div>
        ) : (
          <div className="EditProfile">
            <Form>
              <FormGroup className="EditProfileFormGroup">
                <h6>User/Group Name</h6>
                <Input
                  value={this.state.organizationName}
                  onChange={(event) => {
                    this.setState({
                      organizationName: event.currentTarget.value,
                    });
                  }}
                  placeholder="User/Group name"
                />
              </FormGroup>
              <FormGroup className="EditProfileFormGroup">
                <h6>Email</h6>
                <Input
                  value={this.state.email}
                  onChange={(event) => {
                    this.setState({ email: event.currentTarget.value });
                  }}
                  placeholder="Email"
                />
              </FormGroup>
              <FormGroup className="EditProfileFormGroup">
                <h6>Description</h6>
                <Input
                  type="textarea"
                  value={this.state.description}
                  onChange={(event) => {
                    this.setState({ description: event.currentTarget.value });
                  }}
                  placeholder="Description"
                />
              </FormGroup>
              <FormGroup>
                <h6>Share Events</h6>
                <br />
                <Switch
                  checked={this.state.share}
                  onChange={() => this.setState({ share: !this.state.share })}
                />
              </FormGroup>
              <Button onClick={this.submitHandler} color="info">
                Submit
              </Button>
              <Button
                color="secondary"
                className="ButtonCancel"
                onClick={() => {
                  this.setState({ edit: !this.state.edit });
                }}
              >
                Cancel
              </Button>
            </Form>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: OrganizationStateInterface) => {
  return {
    organization: state,
  };
};
const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    getProfileDispatch: (organizationData: OrganizationStateInterface) => {
      const action: getProfileAction = {
        type: 'getProfile',
        organization: organizationData,
      };
      dispatch(action);
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
