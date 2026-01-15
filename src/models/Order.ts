import { OrderStage } from './enums/OrderStage.ts';
import type {OrderItems} from "./OrderItems.ts";
import type {Table} from "./Table.ts";

export interface Order {
    id: number;
    tableId: number | null; // int?
    items: OrderItems[];     // List<OrderItems>
    billAmount: number | null; // decimal?
    stage: OrderStage;
    table?: Table | null; // Relacja (opcjonalna, bo backend może jej nie zwracać, żeby uniknąć pętli)
}