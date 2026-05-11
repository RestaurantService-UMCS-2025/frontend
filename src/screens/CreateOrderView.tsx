import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import * as OrdersApi from '../utils/OrderRequests.ts';
import { TableRequests } from '../utils/TableRequests';
import type { Table } from '../models/Table';

interface CreateOrderScreenProps {
    onOrderSuccess: () => void;
    onBack: () => void;
    preselectedTableId: number | null;
}

export const CreateOrderScreen: React.FC<CreateOrderScreenProps> = ({ onOrderSuccess, onBack, preselectedTableId }) => {
    const { cartItems, totalAmount, clearCart } = useCart();
    const [tables, setTables] = useState<Table[]>([]);

    const [selectedTableId, setSelectedTableId] = useState<number | "">(
        preselectedTableId !== null ? preselectedTableId : ""
    );

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        TableRequests.getAll().then(setTables).catch(() => setError("Nie udało się pobrać stolików"));
    }, []);

    const handlePlaceOrder = async () => {
        if (selectedTableId === "") return alert("Wybierz stolik!");
        setIsLoading(true);
        setError(null);

        try {
            const newOrderId = await OrdersApi.createOrder({ tableId: selectedTableId as number });
            if (newOrderId === -1) throw new Error("Błąd serwera przy tworzeniu zamówienia");

            const itemsToSubmit = cartItems.map(item => ({ ...item, orderItemId: 0 }));
            await OrdersApi.addItemsToOrder(newOrderId, itemsToSubmit);

            localStorage.setItem('myActiveOrderId', newOrderId.toString());

            clearCart();
            alert("Zamówienie złożone!");
            onOrderSuccess();
        } catch (err: any) {
            setError(err.message || "Wystąpił błąd");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <button onClick={onBack} style={{ marginBottom: '20px' }}>← Wróć do koszyka</button>
            <h1>Finalizacja zamówienia</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
                <h3>Suma: {totalAmount.toFixed(2)} PLN</h3>

                {preselectedTableId !== null ? (
                    // Widok dla opcji ze wskazanym z góry stolikiem (np. przez kod QR z linkiem)
                    <div style={{ margin: '15px 0 20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px', border: '1px solid #ced4da' }}>
                        <span style={{ display: 'block', fontSize: '0.9rem', color: '#6c757d' }}>Twój stolik:</span>
                        <strong style={{ fontSize: '1.2rem' }}>Stolik #{preselectedTableId}</strong>
                    </div>
                ) : (
                    // Standardowy widok z rozwijaną listą
                    <>
                        <label style={{ display: 'block', margin: '15px 0 5px' }}>Wybierz stolik:</label>
                        <select
                            value={selectedTableId}
                            onChange={(e) => setSelectedTableId(Number(e.target.value))}
                            style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
                        >
                            <option value="">-- Wybierz --</option>
                            {tables.map(t => <option key={t.id} value={t.id}>Stolik #{t.id} ({t.status})</option>)}
                        </select>
                    </>
                )}

                <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading || selectedTableId === ""}
                    style={{ width: '100%', padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}
                >
                    {isLoading ? "Przetwarzanie..." : "Potwierdzanie zamówienia"}
                </button>
            </div>
        </div>
    );
};