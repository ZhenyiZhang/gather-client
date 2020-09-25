import Axios from 'axios';
import ServerUrl from './serverURL';

const getProfileInstance = Axios.create({
    baseURL: ServerUrl + '/organization/profile/',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type' : 'application/json'
    }
});

export default getProfileInstance;