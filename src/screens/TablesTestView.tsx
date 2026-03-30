import React, { useEffect, useState } from 'react';
import { TableRequests } from '../utils/TableRequests';
import { Table, Order } from '../models';

export const TablesTestView = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);

    const loadTables = async () => {
        setLoading(true);
        try {
            const data = await TableRequests.getAll();
            setTables(data);
        } finally { setLoading(false); }
    };

    useEffect(() => { loadTables(); }, []);

    const handleSelectTable = async (id: number) => {
        setLoading(true);
        try {
            const [tableData, ordersData] = await Promise.all([
                TableRequests.getById(id),
                TableRequests.getTableOrders(id)
            ]);
            setSelectedTable(tableData);
            setOrders(ordersData);
        } finally { setLoading(false); }
    };

    return (
        <div style={{ padding: '20px', display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
                <h2>Stoliki</h2>
                <button onClick={loadTables}>Odśwież</button>
                {tables.map(t => (
                    <div key={t.id} onClick={() => handleSelectTable(t.id)} style={{ padding: '10px', border: '1px solid #ccc', margin: '5px 0', cursor: 'pointer', backgroundColor: selectedTable?.id === t.id ? '#e3f2fd' : 'white' }}>
                        Stolik #{t.id} - {t.status}
                    </div>
                ))}
            </div>
            <div style={{ flex: 2, borderLeft: '1px solid #ccc', paddingLeft: '20px' }}>
                <h2>Szczegóły</h2>
                {selectedTable ? (
                    <div>
                        <h3>Stolik #{selectedTable.id}</h3>
                        <h4>Zamówienia:</h4>
                        {orders.map(o => (
                            <div key={o.id} style={{ border: '1px solid #ddd', padding: '10px', margin: '5px 0' }}>
                                <strong>Zamówienie #{o.id}</strong> - Status: {o.stage}
                                <ul>{o.items.map(i => <li key={i.orderItemId}>{i.menuItemName} x{i.quantity}</li>)}</ul>
                            </div>
                        ))}
                    </div>
                ) : <p>Wybierz stolik.</p>}
            </div>
        </div>
    );
};