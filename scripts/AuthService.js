import { axios } from 'axios';

const API_BASE_URL = "http://localhost:8080/auth";

class AuthService {
   login(credentials){
    // const data = axios.post(`${API_BASE_URL}/login`, credentials);
    // console.log("data", API_BASE_URL)

    // return data;

    const response =  fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      const data =  response.json();
      const token = data.token;
      
      return data;
   }
   getUser (credentials) {
    // const data = axios.get(`http://localhost:8080/user/`, credentials);
    const response = fetch('http://localhost:8080/user/', credentials)
    console.log(response)
  
   }
    getID = async (credentials) => {
    const response = await fetch('http://localhost:8080/user/', credentials)
    console.log(response)
   }
}

export default  AuthService();