import { useCart } from '../context/CartContext';

interface CartSummaryProps {
    onNavigateToCheckout: () => void;
}

const CartSummary = ({ onNavigateToCheckout }: CartSummaryProps) => {
    const { cartItems, totalAmount, removeItem, updateItemQuantity, updateItemNote } = useCart();

    if (cartItems.length === 0) return (
        <div className="animated-view" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2 style={{ color: 'var(--text-muted)' }}>Twój koszyk jest pusty 🛒</h2>
            <p>Dodaj coś pysznego z menu!</p>
        </div>
    );

    return (
        <div className="animated-view">
            <h1>Twoje Zamówienie</h1>
            <ul className="cart-list">
                {cartItems.map((item, idx) => (
                    <li key={item.menuItemId} className="cart-item" style={{ animationDelay: `${idx * 0.05}s` }}>
                        <div className="cart-item-header">
                            <span>{item.menuItemName}</span>
                            <span style={{ color: 'var(--primary)' }}>{(item.quantity * item.unitPrice).toFixed(2)} PLN</span>
                        </div>
                        <div className="cart-controls" style={{ marginBottom: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <button className="qty-btn" onClick={() => updateItemQuantity(item.menuItemId, item.quantity - 1)}>-</button>
                                <span style={{ fontWeight: 'bold', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                <button className="qty-btn" onClick={() => updateItemQuantity(item.menuItemId, item.quantity + 1)}>+</button>
                            </div>
                            <button
                                onClick={() => removeItem(item.menuItemId)}
                                style={{ marginLeft: 'auto', color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                Usuń
                            </button>
                        </div>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Dodaj notatkę (np. bez cebuli)..."
                            value={item.note}
                            onChange={(e) => updateItemNote(item.menuItemId, e.target.value)}
                        />
                    </li>
                ))}
            </ul>

            <div className="summary-panel">
                <h2 style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <span>Suma:</span>
                    <span style={{ color: 'var(--primary)' }}>{totalAmount.toFixed(2)} PLN</span>
                </h2>
                <button className="btn btn-primary" onClick={onNavigateToCheckout} style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
                    Wybierz stolik i zamów →
                </button>
            </div>
        </div>
    );
};

export default CartSummary;