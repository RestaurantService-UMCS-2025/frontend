import { useEffect, useState } from 'react';
import * as OrdersApi from '../utils/OrderRequests';
import type { Order } from '../models/Order';
import type { OrderItems } from '../models/OrderItems';
import { ErrorMessage } from '../components/ErrorMessage';

export const ActiveOrderScreen = () => {
    const [order, setOrder] = useState<Order | null>(null);
    const [items, setItems] = useState<OrderItems[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorData, setErrorData] = useState<{message: string, debug?: string} | null>(null);

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
            } catch (err: any) {
                console.error("Błąd", err);
                setErrorData({
                    message: "Nie udało się pobrać statusu Twojego zamówienia. Może zostało już zakończone?",
                    debug: err.message
                });
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

    if (isLoading) return <div className="animated-view">Pobieranie statusu...</div>;
    if (!order && !errorData) return <div className="animated-view" style={{ textAlign: 'center', marginTop: '50px' }}><h3>Brak aktywnego zamówienia.</h3></div>;

    return (
        <div className="animated-view">
            <h1>Twoje Zamówienie {order && <span style={{ color: 'var(--text-muted)' }}>#{order.id}</span>}</h1>

            {errorData && (
                <ErrorMessage
                    message={errorData.message}
                    debugDetails={errorData.debug}
                />
            )}

            {order && (
                <div className="summary-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                        <div>
                            <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Status</span>
                            <strong style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>{order.stage}</strong>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Stolik</span>
                            <strong style={{ fontSize: '1.2rem' }}>#{order.tableId}</strong>
                        </div>
                    </div>

                    <h3 style={{ marginTop: '24px' }}>Zamówione pozycje:</h3>
                    <ul className="cart-list" style={{ marginTop: '16px' }}>
                        {items.map(item => (
                            <li key={item.orderItemId} className="cart-item" style={{ boxShadow: 'none', border: '1px solid var(--border)', padding: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                    <span>{item.menuItemName}</span>
                                    <span>x{item.quantity}</span>
                                </div>
                                {item.note && <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>Notatka: {item.note}</div>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button className="btn btn-outline" onClick={handleClearLocalOrder} style={{ width: '100%', marginTop: '24px', color: 'var(--danger)', borderColor: 'var(--danger)' }}>
                Zakończ podgląd (ukryj)
            </button>
        </div>
    );
};