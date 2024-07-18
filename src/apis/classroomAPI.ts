import { axiosConfigClassrooms } from "./config/axiosConfig";
import axios from "axios";

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
    }
};