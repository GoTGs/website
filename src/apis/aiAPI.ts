import { axiosConfigAI } from "./config/axiosConfig";
import axios from "axios";

export type AIResponseDataType = {
    id: number,
    text: string,
}

export const aiAPI = {
    getRecommendation: async (keyword: string) => {
        return (await axios.post<AIResponseDataType>('/assignment/recommend', {keyword}, axiosConfigAI)).data;
    }
}
