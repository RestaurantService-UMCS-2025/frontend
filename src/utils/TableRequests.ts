// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { Order, Table, TablesStatusRequest } from '../models';
import axios from 'axios';

const API_URL = 'http://localhost:5077/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((request) => {
    console.groupCollapsed(`Send request: [${request.method?.toUpperCase()}] ${request.url}`);

    console.log('Body:', request.data);

    console.log('Url:', request.baseURL + '/' + request.url);
    console.groupEnd();

    return request;
}, (error) => {
    console.error('Send Error:', error);
    return Promise.reject(error);
});

api.interceptors.response.use((response) => {
    console.groupCollapsed(`Sukces: [${response.config.url}]`);
    console.log('📦 backend data:', response.data);
    console.groupEnd();
    return response;
}, (error) => {
    console.groupCollapsed(`Error: [${error.response?.config.url || 'Network Error'}]`);
    console.error('Status:', error.response?.status);
    console.error('Text:', error.response?.data);
    console.groupEnd();
    return Promise.reject(error);
});

// =================================================================

export const TableRequests = {

    getAll: async (): Promise<Table[]> => {
        // Usunąłem ukośnik z początku, aby pasowało do baseURL
        const response = await api.get<Table[]>('Tables/all');
        return response.data;
    },

    getById: async (id: number): Promise<Table> => {
        const response = await api.get<Table>(`Tables/${id}`);
        return response.data;
    },

    getTableOrders: async (id: number): Promise<Order[]> => {
        const response = await api.get<Order[]>(`Tables/${id}/orders`);
        return response.data;
    },

    setStatus: async (statusRequest: TablesStatusRequest): Promise<void> => {
        await api.patch('Tables/status', statusRequest);
    },

    clearTableInfo: async (id: number): Promise<void> => {
        await api.patch(`Tables/${id}/clear`);
    }
};