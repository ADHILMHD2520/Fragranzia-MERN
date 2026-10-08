import axios from "axios";


const apiUrl = import.meta.env.VITE_BACKEND_URL;


export const BASE_URL = apiUrl;

  export const axiosPrivate = axios.create({
    baseURL: BASE_URL,

  });