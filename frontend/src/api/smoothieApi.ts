import axios from 'axios';
import { UpdateSmoothieInput } from './types';

const API_URL = "http://localhost:5001/api/smoothies"

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type' : "application/json"
    }
});

export const getSmoothies = async () => {
    try {
        console.log("Making API request to:", API_URL)
        const response = await api.get("");
        return response.data  
    } catch (error){
        console.error("API error:", error)
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

export const updateSmoothie = async ({id, ...updates}: UpdateSmoothieInput) => {
    try {
        const response = await api.put(`/${id}`,updates);
        return response.data
    } catch (error){
        throw new Error("Failed to update smoothie")
    }
}

export const deleteSmoothie = async (id: string) => {
    try {
        await api.delete(`${id}`);
    } catch (error){
        throw new Error("Failed to delete smoothie")
    }
}


