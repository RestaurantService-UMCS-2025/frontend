import React, { useEffect, useState } from 'react';
// Upewnij się, że ścieżka do serwisu jest poprawna
import { TableRequests } from '../utils/TableRequests';
// Import typów
import { Table, Order } from '../models';

export const TablesTestView = () => {
    // Stan aplikacji
    const [tables, setTables] = useState<Table[]>([]);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Stan dla formularza zmiany statusu
    const [newStatus, setNewStatus] = useState<string>('');

    // 1. Pobieranie wszystkich stolików przy starcie (Test getAll)
    useEffect(() => {
        loadTables();
    }, []);

    const loadTables = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await TableRequests.getAll();
            setTables(data);
        } catch (err: any) {
            setError('Błąd pobierania listy: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    // 2. Pobieranie szczegółów i zamówień (Test getById i getTableOrders)
    const handleSelectTable = async (id: number) => {
        setLoading(true);
        setError(null);
        setOrders([]); // Reset zamówień przed ładowaniem nowych
        try {
            // Pobieramy równolegle dane stolika i jego zamówienia
            const [tableData, ordersData] = await Promise.all([
                TableRequests.getById(id),
                TableRequests.getTableOrders(id)
            ]);

            setSelectedTable(tableData);
            setOrders(ordersData);
            // Ustawiamy domyślny status w polu input na obecny status stolika
            setNewStatus(tableData.status.toString());
        } catch (err: any) {
            setError(`Błąd pobierania stolika ID ${id}: ` + err.message);
        } finally {
            setLoading(false);
        }
    };

    // 3. Zmiana statusu (Test setStatus)
    const handleChangeStatus = async () => {
        if (!selectedTable) return;

        try {
            await TableRequests.setStatus({
                id: selectedTable.id,
                status: newStatus
            });
            alert('Status zmieniony!');
            // Odświeżamy dane
            loadTables();
            handleSelectTable(selectedTable.id);
        } catch (err: any) {
            alert('Błąd zmiany statusu: ' + err.message);
        }
    };

    // 4. Czyszczenie stolika (Test clearTableInfo)
    const handleClearTable = async (id: number) => {
        if(!window.confirm(`Czy na pewno wyczyścić stolik #${id}?`)) return;

        try {
            await TableRequests.clearTableInfo(id);
            alert('Stolik wyczyszczony!');
            loadTables();
            if (selectedTable?.id === id) {
                handleSelectTable(id);
            }
        } catch (err: any) {
            alert('Błąd czyszczenia: ' + err.message);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Panel Testowy API Stolików</h1>

            {/* Pasek statusu */}
            {loading && <div style={{ color: 'blue' }}>Ładowanie danych...</div>}
            {error && <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>}

            <button
                onClick={loadTables}
                style={{ padding: '10px 20px', marginBottom: '20px', cursor: 'pointer' }}
            >
                Odśwież Listę Stolików
            </button>

            <div style={{ display: 'flex', gap: '20px' }}>

                {/* LEWA KOLUMNA: Lista stolików */}
                <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
                    <h2>Lista Stolików</h2>
                    {tables.length === 0 ? <p>Brak stolików.</p> : (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {tables.map(table => (
                                <li key={table.id} style={{
                                    borderBottom: '1px solid #eee',
                                    padding: '10px',
                                    backgroundColor: selectedTable?.id === table.id ? '#f0f8ff' : 'transparent'
                                }}>
                                    <strong>Stolik #{table.id}</strong> <br/>
                                    Status: {table.status} <br/>
                                    Info: {table.tableInfo || 'Brak info'} <br/>

                                    <div style={{ marginTop: '5px' }}>
                                        <button onClick={() => handleSelectTable(table.id)} style={{ marginRight: '5px' }}>
                                            Szczegóły & Zamówienia
                                        </button>
                                        <button onClick={() => handleClearTable(table.id)} style={{ backgroundColor: '#ffcccc' }}>
                                            Wyczyść (Clear)
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* PRAWA KOLUMNA: Szczegóły wybranego */}
                <div style={{ flex: 1, border: '1px solid #ccc', padding: '10px' }}>
                    <h2>Szczegóły Wybranego</h2>
                    {!selectedTable ? (
                        <p>Wybierz stolik z listy po lewej, aby zobaczyć szczegóły.</p>
                    ) : (
                        <div>
                            <h3>Stolik #{selectedTable.id}</h3>
                            <div style={{ backgroundColor: '#eee', padding: '10px', marginBottom: '20px' }}>
                                <h4>Akcje Testowe</h4>
                                <label>
                                    Nowy Status (wpisz tekst, np. Occupied): <br/>
                                    <input
                                        type="text"
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                    />
                                </label>
                                <button onClick={handleChangeStatus} style={{ marginLeft: '10px' }}>
                                    Wyślij PATCH status
                                </button>
                            </div>

                            <h4>Zamówienia ({orders.length})</h4>
                            {orders.length === 0 ? <p>Brak zamówień dla tego stolika.</p> : (
                                <ul>
                                    {orders.map(order => (
                                        <li key={order.id} style={{ marginBottom: '10px', border: '1px dashed gray', padding: '5px' }}>
                                            <strong>Zamówienie #{order.id}</strong> (Etap: {order.stage}) <br/>
                                            Suma: {order.billAmount} PLN
                                            <ul>
                                                {order.items.map(item => (
                                                    <li key={item.orderItemId}>
                                                        {item.menuItemName} x{item.quantity} - {item.status}
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};