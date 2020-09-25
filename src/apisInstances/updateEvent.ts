import Axios from 'axios';
import ServerUrl from './serverURL';

const updateEventInstance = Axios.create({
    baseURL: ServerUrl + '/organization/event/',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type' : 'application/json'
    }
});

export default updateEventInstance;