import { useEffect, useState } from 'react';
import * as OrdersApi from '../utils/OrderRequests';
import type { Order } from '../models/Order';
import type { OrderItems } from '../models/OrderItems';

export const ActiveOrderScreen = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const [items, setItems] = useState<OrderItems[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const savedOrderId = localStorage.getItem('myActiveOrderId');

        if (!savedOrderId) {
            setIsLoading(false);
            return;
        }

        const fetchMyOrder = async () => {
            try {
                const orderIdNum = parseInt(savedOrderId, 10);
                const fetchedOrder = await OrdersApi.fetchOrderById(orderIdNum);
                const fetchedItems = await OrdersApi.fetchOrderItems(orderIdNum);

                setOrder(fetchedOrder);
                setItems(fetchedItems);
            } catch (err) {
                console.error("Błąd podczas pobierania zamówienia", err);
                setError("Nie udało się pobrać Twojego zamówienia. Może zostało już zakończone?");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyOrder();
    }, []);

    const handleClearLocalOrder = () => {
        localStorage.removeItem('myActiveOrderId');
        window.location.reload();
    };

    if (isLoading) return <div>Ładowanie Twojego zamówienia...</div>;

    // Jeśli nie ma zapisanego ID
    if (!order) return <div>Nie masz obecnie aktywnego zamówienia.</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>Twoje Zamówienie #{order.id}</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                <p><strong>Status:</strong> {order.stage}</p>
                <p><strong>Stolik:</strong> {order.tableId}</p>

                <h3>Pozycje:</h3>
                <ul>
                    {items.map(item => (
                        <li key={item.orderItemId}>
                            {item.menuItemName} x{item.quantity} (Note: {item.note || 'Brak'})
                        </li>
                    ))}
                </ul>

                <button
                    onClick={handleClearLocalOrder}
                    style={{ marginTop: '20px', padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                    Zakończ podgląd
                </button>
            </div>
        </div>
    );
};