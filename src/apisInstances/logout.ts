import Axios from 'axios';
import ServerUrl from './serverURL';

const LogoutInstance = Axios.create({
    baseURL: ServerUrl + '/auth/logout',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type' : 'application/json'
    }
});

export default LogoutInstance;