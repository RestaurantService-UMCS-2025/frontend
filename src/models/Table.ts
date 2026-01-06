import { TableStatus } from './enums/TableStatus.ts';
import type {Order} from "./Order.ts";

export interface Table {
    id: number;
    tableInfo: string | null; // string?
    status: TableStatus;
    // Relacja (opcjonalna)
    orders?: Order[]; // ICollection<Order>
}