import { axiosConfigUser } from "./config/axiosConfig";
import axios from "axios";

export type User = {
    id: number,
    email: string,
    first_name: string,
    last_name: string,
    role: string
}

export const userAPI = {
    getUser: async() => {
        return (await axios.get<User>('/user/get', axiosConfigUser)).data;
    },
    updateUser: async (data: any) => {
        return (await axios.put('/user/update', data, axiosConfigUser)).data
    },
    getUsers: async () => {
        return (await axios.get<User[]>('/user/get/all', axiosConfigUser)).data;
    },
};