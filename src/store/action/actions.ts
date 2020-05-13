import OrganizationStateInterface from '../interface/OrganizationState.interface';

export interface loginAction {
    type: 'login',
    organization: OrganizationStateInterface
}