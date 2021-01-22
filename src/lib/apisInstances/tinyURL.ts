import Axios from 'axios';

const tinyUrlInstance = Axios.create({
    baseURL: 'https://damp-temple-05652.herokuapp.com/api/tiny',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type' : 'application/json'
    }
});

export default tinyUrlInstance;