import { useEffect, useState } from 'react';
import { TableRequests } from '../utils/TableRequests';
import {Order} from "../models/Order.ts";
import {Table} from "../models/Table.ts";

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
        <div className="animated-view">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1>Zarządzanie Salą</h1>
                <button className="btn btn-outline" onClick={loadTables} disabled={loading}>
                    {loading ? 'Odświeżanie...' : 'Odśwież'}
                </button>
            </div>

            <div className="tables-layout">
                <div className="summary-panel" style={{ marginTop: 0 }}>
                    <h2 style={{ marginBottom: '16px' }}>Stoliki</h2>
                    {tables.map(t => (
                        <div
                            key={t.id}
                            onClick={() => handleSelectTable(t.id)}
                            className={`table-item ${selectedTable?.id === t.id ? 'selected' : ''}`}
                        >
                            <strong>Stolik #{t.id}</strong>
                            <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Status: {t.status}</div>
                        </div>
                    ))}
                </div>

                <div className="summary-panel" style={{ marginTop: 0 }}>
                    <h2>Szczegóły</h2>
                    {selectedTable ? (
                        <div className="animated-view">
                            <h3 style={{ color: 'var(--primary)', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                                Wybrany: Stolik #{selectedTable.id}
                            </h3>
                            <h4 style={{ marginTop: '20px' }}>Aktywne zamówienia:</h4>
                            {orders.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>Brak zamówień dla tego stolika.</p> : null}

                            {orders.map(o => (
                                <div key={o.id} className="card" style={{ marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <strong>ID Zamówienia: #{o.id}</strong>
                                        <span style={{ backgroundColor: 'var(--background)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.9rem' }}>{o.stage}</span>
                                    </div>
                                    <ul style={{ paddingLeft: '20px', margin: 0, color: 'var(--text-muted)' }}>
                                        {o.items.map(i => (
                                            <li key={i.orderItemId}>{i.menuItemName} <strong>x{i.quantity}</strong></li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px' }}>Wybierz stolik z listy po lewej stronie, aby zobaczyć szczegóły.</p>
                    )}
                </div>
            </div>
        </div>
    );
};