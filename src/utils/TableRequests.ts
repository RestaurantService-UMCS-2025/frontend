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

export const TableRequests = {

    getAll: async (): Promise<Table[]> => {
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
        // example: { "id": 1, "status": "Occupied" }
        await api.patch('Tables/status', statusRequest);
    },

    clearTableInfo: async (id: number): Promise<void> => {
        await api.patch(`Tables/${id}/clear`);
    }
};