import OrganizationStateInterface from '../store/interface/OrganizationState.interface';

const initialState: OrganizationStateInterface = {
    name : 'initial',
    description: '',
    organizationName: '',
    events: [],
    _id: ''
};

const OrganizationReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case 'getProfile':
            return {
                ...action.organization
            }
    }
    return state;
};

export default OrganizationReducer;