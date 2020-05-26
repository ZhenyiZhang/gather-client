import React, { Component } from 'react';
import OrganizationStateInterface from '../../../store/interface/OrganizationState.interface';
import updateProfileInstance from "../../../apisInstances/updateProfile";
import getProfileInstance from "../../../apisInstances/getProfile";
import { Badge, Button, Form, Col, Row, FormGroup, Label, Input} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Switch from "react-switch";
import {connect} from "react-redux";
import './profilePage.css';
import {Dispatch} from "redux";
import getProfileAction from "../topPanel/actions/getProfileAction";

interface Props {
    organization: OrganizationStateInterface,
    AccessToken: string,
    getProfileDispatch: (organizationData: OrganizationStateInterface) => void
}

class ProfilePage extends Component<Props> {
    state = {
        edit: false,
        organizationName: this.props.organization.organizationName,
        description: this.props.organization.description,
        share: this.props.organization.share,
        link: `/shared/`
    };

    submitHandler = () => {
        const {link, edit, ...updateProfile} = this.state;
        console.log(this.props.AccessToken);
        updateProfileInstance.post('', updateProfile,
            {headers:{Authorization: 'Bearer ' + this.props.AccessToken}})
            .then(() => {
                this.setState({edit: false});
                getProfileInstance.get('',
                    {headers:{Authorization: 'Bearer ' + this.props.AccessToken}})
                    .then(res => {
                        const profile: OrganizationStateInterface = res.data;
                        this.props.getProfileDispatch(profile);
                    })
            })
            .catch((err) => {alert(err)});
    };

    render() {
        return(
            (!this.state.edit) ?
                (<div className="ProfilePage">
                    <h3>User/Group Name:</h3>
                    <h4>{this.props.organization.organizationName}</h4>
                    <h3>Description:</h3>
                    <h4>{this.props.organization.description}</h4>
                    <h3>Share Events:</h3>
                    <h4>{this.props.organization.share? 'Yes' : 'No'}</h4>
                    {this.props.organization.share?
                        <Badge className="LinkBadge"
                               href={this.state.link + this.props.organization._id}
                               color="primary">Shared Link: {this.state.link + this.props.organization._id}</Badge> : null}
                    <br/> <br/>
                    <Button onClick={() => {this.setState({edit: !this.state.edit})}} color="info">Edit</Button>
                </div>) :
                <div>
                    <Form>
                        <FormGroup>
                            <Label>User/Group Name</Label>
                            <Input
                                onChange={(event) => {
                                    this.setState({organizationName: event.currentTarget.value})
                                }}
                                placeholder={this.props.organization.organizationName} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Description</Label>
                            <Input
                                onChange={(event) => {
                                    this.setState({description: event.currentTarget.value})
                                }}
                                placeholder={this.props.organization.description} />
                        </FormGroup>
                        <FormGroup>
                            <Label>Share Events</Label>
                            <br/>
                            <Switch checked={this.state.share} onChange={() => this.setState({share: !this.state.share})}/>
                        </FormGroup>
                        <Button
                            onClick={this.submitHandler}
                            color="info">Submit</Button>
                        <Button color="secondary"
                                onClick={() => {this.setState({edit: !this.state.edit})}}>Cancel</Button>
                    </Form>
                </div>

        );
    }
}

const mapStateToProps = (state: OrganizationStateInterface) => {
    return{
        organization: state
    };
};
const mapDispatchToProps = (dispatch: Dispatch) => {
    return{
        getProfileDispatch: (organizationData: OrganizationStateInterface) => {
            const action: getProfileAction = {type: 'getProfile', organization: organizationData};
            dispatch(action);
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);