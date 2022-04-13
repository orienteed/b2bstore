import axios from 'axios';

const getToken = async (username, password) => {
    const params = {
        username: username,
        password: password,
        service: 'pruebas_2'
    };

    return await axios
        .get(`https://34.246.201.179:8443/login/token.php`, { params: params })
        .then(tokenResponse => {
            return tokenResponse.data.token;
        })
        .catch(error => console.error(error));
};

export default getToken;
