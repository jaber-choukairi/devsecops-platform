import axios from "axios";

const API_URL = "/api/ai";

export const askAI = async (question) => {

    const response = await axios.post(API_URL, {
        question: question
    });

    return response.data;
};