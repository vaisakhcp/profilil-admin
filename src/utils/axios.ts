import axios from 'axios';

const axiosServices = axios.create({
  baseURL: 'http://157.245.105.48/api/app',
});

// interceptor for http
axiosServices.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject((error.response && error.response.data) || 'Wrong Services')
);

export default axiosServices;
