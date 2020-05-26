import Axios from 'axios';
import ServerUrl from './serverURL';

const updateProfileInstance = Axios.create({
    baseURL: ServerUrl + '/organization/updateProfile',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type' : 'application/json'
    }
});

export default updateProfileInstance;