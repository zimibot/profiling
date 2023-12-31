import axios from "axios";
import Swal from "sweetalert2";

export const api = () => {


    const instance = axios.create({
        baseURL: process.env.NODE_ENV === 'production' ? 'https://k17tech.com/users' : "http://localhost:3000/users",
        timeout: 30000
    });

    // Alter defaults after instance has been created
    instance.defaults.headers.common['Authorization'] = localStorage.getItem("token");
    instance.defaults.headers.common['Content-Type'] = "application/json";

    instance.interceptors.request.use(function (config) {
        // Do something before request is sent
        return config;
    }, function (error) {
        console.log(error)
        // Do something with request error
        return Promise.reject(error);
    });

    // Add a response interceptor
    instance.interceptors.response.use(function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
    }, function (error) {
        if (error?.code !== "ERR_BAD_REQUEST") {

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Session Expired',
                didClose: () => {
                    localStorage.removeItem("token")
                    window.location.reload()
                }
            })
        }

        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
    });

    return instance
}