import Axios from 'axios';
import ServerUrl from './serverURL';

const LoginInstance = Axios.create({
    baseURL: ServerUrl + '/auth/login',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type' : 'application/json'
    }
});

export default LoginInstance;