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
    description?: string,
    dueDate: string,
    files: File[]
}

export type SubmitAssignmentDataType = {
    text: string,
    files: File[]
}

export type AssignmentEditDataType = {
    title?: string,
    description?: string,
    dueDate?: string,
    files?: File[]
    stringFiles?: string[]
}

export type GradeSubmissionDataType = {
    id: number,
    files?: string[],
    submission_time: string,
    text: string,
}

export const assignmentAPI = {
    getAssignments: async (classroomId: string | null) => {
        return (await axios.get<AssignmentDataType[]>(`/assignment/classroom/${classroomId}/get/all`, axiosConfigAssignment)).data;
    },
    getAssignment: async (assignmentId: string | null) => {
        return (await axios.get<AssignmentDataType>(`/assignment/${assignmentId}/get`, axiosConfigAssignment)).data;
    },
    createAssignment: async ({classroomId, data }: {classroomId: string | null, data: AssignmentCreateDataType}) => {
        const formData = new FormData();

        formData.append('title', data.title);
        formData.append('description', data.description || '');
        formData.append('dueDate', data.dueDate);

        for (let i = 0; i < data.files.length; i++) {
            formData.append('files ' + i, data.files[i]);
        }

        return (await axios.post(`/assignment/classroom/${classroomId}/create`, 
            formData,
            {
                ...axiosConfigAssignment,
                headers: {
                    ...axiosConfigAssignment.headers,
                    'Content-Type': 'multipart/form-data'
                }
            }
        )).data;
    },
    addSubmission: async ({assignmentId, data}: {assignmentId: string | null, data: SubmitAssignmentDataType}) => {
        const formData = new FormData();
        formData.append('text', data.text);

        for (let i = 0; i < data.files.length; i++) {
            formData.append('files ' + i, data.files[i]);
        }

        return (await axios.post(`/assignment/${assignmentId}/submit`, 
            formData,
            {
                ...axiosConfigAssignment,
                headers: {
                    ...axiosConfigAssignment.headers,
                    'Content-Type': 'multipart/form-data'
                }
            }
        )).data;
    },
    deleteAssignment: async (assignmentId: string | null) => {
        return (await axios.delete(`/assignment/${assignmentId}/delete`, axiosConfigAssignment)).data;
    },
    editAssignment: async ({assignmentId, data}: {assignmentId: string | null, data: AssignmentEditDataType | null}) => {
        const formData = new FormData();

        formData.append('title', data?.title || '');
        formData.append('description', data?.description || '');
        formData.append('dueDate', data?.dueDate || '');
        formData.append('links', data?.stringFiles?.join('\n')!);

        for (let i = 0; i < data?.files?.length!; i++) {
            // @ts-ignore
            formData.append('files ' + i, data?.files![i]);
        }

        return (await axios.put(`/assignment/${assignmentId}/edit`, 
            formData, 
            {
                ...axiosConfigAssignment,
                headers: {
                    ...axiosConfigAssignment.headers,
                    'Content-Type': 'multipart/form-data'
                }
            }
        )).data
    },
    getAllSubmissions: async (assignmentId: string | null) => {
        return (await axios.get<{userId:string, email: string, firstName: string, grade?: number, lastName: string, submission: GradeSubmissionDataType}[]>(`/assignment/${assignmentId}/submission/get/all`, axiosConfigAssignment)).data;
    },
    addGrade: async ({assignmentId, userId, grade, feedback}: {assignmentId: string | null, userId: string | undefined, grade: number, feedback: string}) => {
        return (await axios.post(`/assignment/${assignmentId}/user/${userId}/grade`, {grade, feedback}, axiosConfigAssignment)).data;
    },
    deleteGrade: async (gradeId: string | null) => {
        return (await axios.delete(`/grade/${gradeId}/delete`, axiosConfigAssignment)).data;
    },
    editGrade: async ({gradeId, grade, feedback}: {gradeId: string | null, grade: number | undefined, feedback: string | undefined}) => {
        return (await axios.put(`/grade/${gradeId}/edit`, {grade, feedback}, axiosConfigAssignment)).data;
    },
};