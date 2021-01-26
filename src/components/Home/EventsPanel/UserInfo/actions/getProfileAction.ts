import OrganizationStateInterface from '../../../../../store/interface/OrganizationState.interface';

export default interface getProfileAction {
  type: string;
  organization: OrganizationStateInterface;
}
