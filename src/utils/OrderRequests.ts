import axios from 'axios';
import type { Order } from '../models/Order';
import type { OrderItems } from '../models/OrderItems';
import { OrderStage } from '../models/enums/OrderStage';
import config from './../config.json';

const API_URL = config.apiURL;


export interface PostOrderBody {
    tableId: number | null;
}

export interface PatchOrderStatusBody {
    stage: OrderStage;
}


const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


export const createOrder = async (orderBody: PostOrderBody): Promise<number> => {
    const response = await api.post<number>('/Orders/order', orderBody);
    return response.data;
};


export const fetchAllOrders = async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/Orders/orders');
    return response.data;
};


export const addItemsToOrder = async (orderId: number, orderItems: OrderItems[]): Promise<void> => {
    await api.post('/Orders/items', orderItems, {
        params: { orderId }
    });
};


export const fetchOrderById = async (id: number): Promise<Order> => {
    const response = await api.get<Order>(`/Orders/orders/${id}`);
    return response.data;
};


export const fetchOrderStatus = async (id: number): Promise<OrderStage> => {
    const response = await api.get<OrderStage>(`/Orders/orders/${id}/status`);
    return response.data;
};


export const updateOrderStatus = async (id: number, stage: OrderStage): Promise<void> => {
    const body: PatchOrderStatusBody = { stage };
    await api.patch(`/Orders/orders/${id}/status`, body);
};


export const fetchOrderItems = async (id: number): Promise<OrderItems[]> => {
    const response = await api.get<OrderItems[]>(`/Orders/orders/${id}/items`);
    return response.data;
};