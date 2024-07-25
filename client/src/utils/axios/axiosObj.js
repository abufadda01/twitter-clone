import axios from "axios";

export const axiosObj = axios.create({
    baseURL : "http://localhost:8000" ,
    withCredentials: true
})