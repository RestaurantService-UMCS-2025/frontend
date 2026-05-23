import { useCart } from '../context/CartContext';

interface CartSummaryProps {
    onNavigateToCheckout: () => void;
}

const CartSummary = ({ onNavigateToCheckout }: CartSummaryProps) => {
    const { cartItems, totalAmount, removeItem, updateItemQuantity, updateItemNote } = useCart();

    if (cartItems.length === 0) return <div style={{ padding: '20px' }}><h2>Koszyk jest pusty 🛒</h2></div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Twoje Zamówienie</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {cartItems.map(item => (
                    <li key={item.menuItemId} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                            <span>{item.menuItemName}</span>
                            <span>{(item.quantity * item.unitPrice).toFixed(2)} PLN</span>
                        </div>
                        <div style={{ marginTop: '10px' }}>
                            <button onClick={() => updateItemQuantity(item.menuItemId, item.quantity - 1)}>-</button>
                            <span style={{ margin: '0 15px' }}>{item.quantity}</span>
                            <button onClick={() => updateItemQuantity(item.menuItemId, item.quantity + 1)}>+</button>
                            <button onClick={() => removeItem(item.menuItemId)} style={{ marginLeft: '20px', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Usuń</button>
                        </div>
                        <input
                            type="text"
                            placeholder="Dodaj notatkę do dania..."
                            value={item.note}
                            onChange={(e) => updateItemNote(item.menuItemId, e.target.value)}
                            style={{ width: '100%', marginTop: '10px', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </li>
                ))}
            </ul>

            <div style={{ borderTop: '2px solid #333', marginTop: '20px', paddingTop: '10px' }}>
                <h3>Suma: {totalAmount.toFixed(2)} PLN</h3>
                <button
                    onClick={onNavigateToCheckout}
                    style={{ width: '100%', padding: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer' }}
                >
                    Wybierz stolik i zamów →
                </button>
            </div>
        </div>
    );
};

export default CartSummary;