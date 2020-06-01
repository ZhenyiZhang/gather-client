import React, { Component } from 'react';
import OrganizationStateInterface from '../../../store/interface/OrganizationState.interface';
import ClientURL from "../../../apisInstances/clientURL";
import updateProfileInstance from "../../../apisInstances/updateProfile";
import getProfileInstance from "../../../apisInstances/getProfile";
import CopyToClipboard from 'react-copy-to-clipboard';
import Switch from "react-switch";
import {connect} from "react-redux";
import {Dispatch} from "redux";
import getProfileAction from "../topPanel/actions/getProfileAction";

import {Alert, Button, Form, FormGroup, Label, Input} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './profilePage.css';

interface Props {
    organization: OrganizationStateInterface,
    AccessToken: string,
    getProfileDispatch: (organizationData: OrganizationStateInterface) => void
}

class ProfilePage extends Component<Props> {
    state = {
        edit: false,
        organizationName: this.props.organization.organizationName,
        email: this.props.organization.email,
        description: this.props.organization.description,
        share: this.props.organization.share,
        copy: false,
        alert: false,
        link: ''
    };

    componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
        if(nextProps.organization.organizationName !== this.state.organizationName) {
            this.setState({
                organizationName: nextProps.organization.organizationName,
                description: nextProps.organization.description,
                email: nextProps.organization.email,
                share: nextProps.organization.share,
                link: ClientURL + `/shared/${nextProps.organization._id}`
            })
        }
    }

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

    linkOnCopyHandler = () => {
        setTimeout(() => {this.setState({alert: false})}, 1000);
        this.setState({copy: true, alert: true});
    };

    render() {
        return(
            (!this.state.edit) ?
                (<div className="ProfilePage">
                    <h3>Displayed User/Group Name:</h3>
                    <h4>{this.props.organization.organizationName}</h4>
                    <h3>Registered Email</h3>
                    <h4>{this.props.organization.email}</h4>
                    <h3>Description:</h3>
                    <h4>{this.props.organization.description}</h4>
                    <h3>Share Events:</h3>
                    <h4>{this.props.organization.share? 'Yes' : 'No'}</h4>
                    <Button onClick={() => {this.setState({edit: !this.state.edit})}} color="info">Edit</Button><br/><br/>
                    {this.props.organization.share?
                        <CopyToClipboard text={this.state.link} onCopy={this.linkOnCopyHandler}>
                            <Button className="LinkBadge" color="primary">Click to copy sharable link</Button>
                        </CopyToClipboard>
                        : null} <br/><br/>
                    <Alert className="CopyAlert"
                           color="success" isOpen={this.state.alert} fade={true}>
                        Copied to clipboard
                    </Alert>
                    </div>) :
                    <div className="EditProfile">
                        <Form>
                            <FormGroup>
                                <Label>User/Group Name</Label>
                                <Input value={this.state.organizationName}
                                       onChange={(event) => {
                                           this.setState({organizationName: event.currentTarget.value})
                                       }}
                                       placeholder="User/Group name" />
                            </FormGroup>
                            <FormGroup>
                                <Label>Email</Label>
                                <Input value={this.state.email}
                                       onChange={(event) => {
                                           this.setState({email: event.currentTarget.value})
                                       }}
                                       placeholder="Email"/>
                            </FormGroup>
                            <FormGroup>
                                <Label>Description</Label>
                                <Input type="textarea"
                                       value={this.state.description}
                                       onChange={(event) => {
                                           this.setState({description: event.currentTarget.value})
                                       }}
                                       placeholder="Description"/>
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
                                    className="ButtonCancel"
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