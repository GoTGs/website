import { axiosConfigAuth } from "./config/axiosConfig";
import axios from "axios";

export type SignUpData = {
    email: string,
    password: string,
    first_name?: string,
    last_name?: string
}

export const authenticationAPI = {
    signUp: async (data: SignUpData) => {
        return (await axios.post('/register', data, axiosConfigAuth));
    },
    signIn: async (data: SignUpData) => {
        return (await axios.post('/login', data, axiosConfigAuth)).data;
    }
};