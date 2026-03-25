import axios from "axios";
const API=import.meta.env.VITE_BACKEND_URL;
export const api=axios.create({
    baseURL:API,
});