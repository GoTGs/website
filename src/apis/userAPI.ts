import { axiosConfigUser } from "./config/axiosConfig";
import axios from "axios";

type User = {
    email: string,
    first_name: string,
    last_name: string
}

export const userAPI = {
    getUser: async () => {
        return (await axios.get<User>('/user/get', axiosConfigUser)).data;
    }
};