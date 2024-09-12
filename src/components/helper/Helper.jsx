import { csrfToken } from '../components/authentication/GetCSRFToken';
const baseUrl = 'http://127.0.0.1:5000/';

export const Helper = async (data, method, endpoint, navigate) => {
    const url = `${baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    };
  
    if (endpoint === 'refresh-token') {
      const token = localStorage.getItem('refreshToken');
      headers['Authorization'] = `Bearer ${token}`;
    } else if (endpoint !== 'login' && endpoint !== 'signup') {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/login');
        return;
      }
      headers['Authorization'] = `Bearer ${token}`;
    }
  
    const requestOptions = {
      method: method,
      headers: headers
    };
  
    if (method !== 'GET') {
      requestOptions.body = JSON.stringify(data);
    }
  
    console.log("Helper request:", requestOptions);
    try {
      const res = await fetch(url, requestOptions);
      console.log("Helper response:", res);
  
    //   if (!res.ok) {
    //     throw new Error('Network response was not ok');
    //   }
  
      const responseData = await res.json();
      return responseData;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  