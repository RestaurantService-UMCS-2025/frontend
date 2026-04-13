import axios from 'axios';
import type { MenuItemType } from '../models/Menu'; // Upewnij się, że ścieżka jest poprawna

const API_URL = 'http://localhost:5077/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


// Pobieranie całego menu
export const fetchAllMenuItems = async (): Promise<MenuItemType[]> => {
    const response = await api.get<MenuItemType[]>('/Menu/all');
    return response.data;
};


// Pobieranie tylko dostępnego menu
export const fetchAvailableMenuItems = async (): Promise<MenuItemType[]> => {
    const response = await api.get<MenuItemType[]>('/Menu/availableMenu');
    return response.data;
};