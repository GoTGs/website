import { axiosConfigAssignment } from "./config/axiosConfig";
import axios from "axios";

export type SubmisssionDataType = {
    id?: number,
    text: string,
    file_links: string[],
}

export type AssignmentDataType = {
    id?: number
    title: string,
    description: string,
    files: string[],
    dueDate: string,
    submissions?: SubmisssionDataType[],
    completed?: boolean 
}

export type AssignmentCreateDataType = {
    title: string,
    description: string,
    dueDate: string,
}

export const assignmentAPI = {
    getAssignments: async (classroomId: string | null) => {
        return (await axios.get<AssignmentDataType[]>(`/assignment/classroom/${classroomId}/get/all`, axiosConfigAssignment)).data;
    },
    getAssignment: async (assignmentId: string | null) => {
        return (await axios.get<AssignmentDataType>(`/assignment/${assignmentId}/get`, axiosConfigAssignment)).data;
    },
    createAssignment: async ({classroomId, data }: {classroomId: string | null, data: AssignmentCreateDataType}) => {
        return (await axios.post(`/assignment/classroom/${classroomId}/create`, data, axiosConfigAssignment)).data;
    }
};