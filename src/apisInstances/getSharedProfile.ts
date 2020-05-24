import Axios from 'axios';
import ServerUrl from './serverURL';

const getSharedProfileInstance = Axios.create({
    baseURL: ServerUrl + '/organization/sharedProfile/',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type' : 'application/json'
    }
});

export default getSharedProfileInstance;