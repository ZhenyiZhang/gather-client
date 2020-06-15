import Axios from 'axios';
import ServerUrl from './serverURL';

const deleteEventInstance = Axios.create({
    baseURL: ServerUrl + '/auth/',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type' : 'application/json'
    }
});

export default deleteEventInstance;