import type {OrderItemStatus} from "./enums/OrderItemStatus.ts";

export interface OrderItems {
    orderItemId: number;
    menuItemId: number;
    menuItemName: string;
    quantity: number;
    unitPrice: number;
    note: string;      // W C# string jest nullable tylko z '?', tu zakładam pusty string lub tekst
    status: OrderItemStatus;
}