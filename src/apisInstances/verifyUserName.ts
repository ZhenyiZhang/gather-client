import Axios from 'axios';
import ServerUrl from './serverURL';

const verifyUserNameInstance = Axios.create({
    baseURL: ServerUrl + '/organization/verifyUserName',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type' : 'application/json'
    }
});

export default verifyUserNameInstance;