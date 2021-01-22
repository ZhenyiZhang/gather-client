import Axios from 'axios';
import ServerUrl from './serverURL';

const updatePasswordInstance = Axios.create({
    baseURL: ServerUrl + '/reset-password/reset',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type' : 'application/json'
    }
});

export default updatePasswordInstance;