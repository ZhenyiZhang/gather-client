import Axios from 'axios';
import ServerUrl from './serverURL';

const resetPasswordRequest = Axios.create({
    baseURL: ServerUrl + '/reset-password/request',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type' : 'application/json'
    }
});

export default resetPasswordRequest;