import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import * as OrdersApi from '../utils/OrderRequests.ts';
import { TableRequests } from '../utils/TableRequests';
import type { Table } from '../models/Table';
import { ErrorMessage } from '../components/ErrorMessage';

interface CreateOrderScreenProps {
    onOrderSuccess: () => void;
    onBack: () => void;
    preselectedTableId: number | null;
}

export const CreateOrderScreen: React.FC<CreateOrderScreenProps> = ({ onOrderSuccess, onBack, preselectedTableId }) => {
    const { cartItems, totalAmount, clearCart } = useCart();
    const [tables, setTables] = useState<Table[]>([]);
    const [selectedTableId, setSelectedTableId] = useState<number | "">(preselectedTableId !== null ? preselectedTableId : "");
    const [isLoading, setIsLoading] = useState(false);

    const [errorData, setErrorData] = useState<{message: string, debug?: string} | null>(null);

    useEffect(() => {
        TableRequests.getAll()
            .then(setTables)
            .catch((err) => setErrorData({ message: "Nie udało się pobrać listy dostępnych stolików.", debug: err.message }));
    }, []);

    const handlePlaceOrder = async () => {
        if (selectedTableId === "") return alert("Wybierz stolik!");
        setIsLoading(true);
        setErrorData(null);

        try {
            const newOrderId = await OrdersApi.createOrder({ tableId: selectedTableId as number });
            if (newOrderId === -1) throw new Error("API zwróciło kod błędu (-1). Prawdopodobnie odrzucono żądanie.");

            const itemsToSubmit = cartItems.map(item => ({ ...item, orderItemId: 0 }));
            await OrdersApi.addItemsToOrder(newOrderId, itemsToSubmit);

            localStorage.setItem('myActiveOrderId', newOrderId.toString());
            clearCart();
            onOrderSuccess();
        } catch (err: any) {
            setErrorData({
                message: "Wystąpił problem podczas przetwarzania Twojego zamówienia.",
                debug: err.message || JSON.stringify(err)
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="animated-view">
            <button className="btn btn-outline" onClick={onBack} style={{ marginBottom: '24px' }}>
                ← Wróć do koszyka
            </button>
            <h1>Finalizacja zamówienia</h1>

            <div className="summary-panel">
                {errorData && (
                    <ErrorMessage
                        title="Błąd zamówienia"
                        message={errorData.message}
                        debugDetails={errorData.debug}
                    />
                )}

                <h2 style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '24px' }}>
                    Do zapłaty: <span style={{ color: 'var(--primary)' }}>{totalAmount.toFixed(2)} PLN</span>
                </h2>

                {preselectedTableId !== null ? (
                    <div style={{ padding: '16px', backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)', marginBottom: '24px' }}>
                        <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Skanowany stolik:</span>
                        <strong style={{ fontSize: '1.4rem', color: 'var(--secondary)' }}>Stolik #{preselectedTableId}</strong>
                    </div>
                ) : (
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>Wybierz swój stolik:</label>
                        <select
                            className="input-field"
                            value={selectedTableId}
                            onChange={(e) => setSelectedTableId(Number(e.target.value))}
                            style={{ cursor: 'pointer', fontSize: '1rem' }}
                        >
                            <option value="">-- Wybierz z listy --</option>
                            {tables.map(t => <option key={t.id} value={t.id}>Stolik #{t.id} ({t.status})</option>)}
                        </select>
                    </div>
                )}

                <button
                    className="btn btn-success"
                    onClick={handlePlaceOrder}
                    disabled={isLoading || selectedTableId === ""}
                    style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
                >
                    {isLoading ? "Przetwarzanie..." : "Potwierdzam zamówienie"}
                </button>
            </div>
        </div>
    );
};