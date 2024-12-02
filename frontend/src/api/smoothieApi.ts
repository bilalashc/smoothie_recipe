import axios from 'axios';

const API_URL = "http://localhost:5001/api/smoothies"

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type' : "application/json"
    }
});

export const getSmoothies = async () => {
    try {
        const response = await api.get("");
        return response.data  
    } catch (error){
        throw new Error("Failed to fetch smoothies")
    }
};

export const getSmoothieById = async (id: string) => {
    try {
        const response = await api.get(`/${id}`);
        return response.data;
    } catch (error) {
        throw new Error("Failed to fetch smoothie")
    }
};

export const createSmoothie = async (smoothie: any) => {
    try {
        const response = await api.post("",smoothie)
        return response.data;
    } catch (error){
        throw new Error("Failed to create new smoothie")
    }
}

