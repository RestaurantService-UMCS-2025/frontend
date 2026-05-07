import axios from 'axios';
import type { MenuItemType } from '../models/Menu'; // Upewnij się, że ścieżka jest poprawna
import config from './../config.json';

const API_URL = config.apiURL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


export const fetchAllMenuItems = async (): Promise<MenuItemType[]> => {
    const response = await api.get<MenuItemType[]>('/Menu/all');
    return response.data;
};


export const fetchAvailableMenuItems = async (): Promise<MenuItemType[]> => {
    const response = await api.get<MenuItemType[]>('/Menu/availableMenu');
    return response.data;
};