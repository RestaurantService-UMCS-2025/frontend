import axios from 'axios';
import type { MenuItemType } from '../models/Menu'; // Upewnij się, że ścieżka jest poprawna

const API_URL = 'http://localhost:5077/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Pobiera wszystkie pozycje z menu.
 * Endpoint: GET /api/Menu/all
 */
export const fetchAllMenuItems = async (): Promise<MenuItemType[]> => {
    const response = await api.get<MenuItemType[]>('/Menu/all');
    return response.data;
};

/**
 * Pobiera tylko dostępne pozycje z menu.
 * Endpoint: GET /api/Menu/availableMenu
 */
export const fetchAvailableMenuItems = async (): Promise<MenuItemType[]> => {
    const response = await api.get<MenuItemType[]>('/Menu/availableMenu');
    return response.data;
};

/**
 * Zmienia status dostępności dania.
 * Endpoint: PATCH /api/Menu/available
 */
export const updateMenuAvailability = async (id: number, mode: boolean): Promise<void> => {
    await api.patch('/Menu/available', { id, mode });
};