import { axiosConfigAI } from "./config/axiosConfig";
import axios from "axios";

export type AIResponseDataType = {
    id: number,
    text: string,
}

export const aiAPI = {
    getRecommendation: async (keywords: string) => {
        return (await axios.post<AIResponseDataType>('/assignment/recommend', {keywords}, axiosConfigAI)).data;
    }
}
