import Axios from 'axios';
import ServerUrl from './serverURL';

const eventRepeatExceptionInstance = Axios.create({
    baseURL: ServerUrl + '/organization/addEventException/',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type' : 'application/json'
    }
});

export default eventRepeatExceptionInstance;