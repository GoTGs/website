import { axiosConfigClassrooms } from "./config/axiosConfig";
import axios from "axios";
import { User } from "./userAPI";

type Classroom = {
    id: number,
    name: string,
    owner_id: number,
}

export const classroomAPI = {
    getUserClassrooms: async () => {
        return (await axios.get<Classroom[]>('/classroom/user/get', axiosConfigClassrooms)).data;
    },
    getClassroom: async (id: string | unknown) => {
        return (await axios.get<Classroom>(`/classroom/${id}/get`, axiosConfigClassrooms)).data;
    },
    createClassroom: async (name: string) => {
        return (await axios.post<Classroom>('/classroom/create', {name}, axiosConfigClassrooms)).data;
    },
    getMembers: async (id: string | unknown) => {
        return (await axios.get<User[]>(`/classroom/${id}/member/get/all`, axiosConfigClassrooms)).data;
    },
};