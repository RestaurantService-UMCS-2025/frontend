import { useCart } from '../context/CartContext';

const CartSummary = () => {
    const {
        cartItems,
        totalAmount,
        removeItem,
        updateItemQuantity,
        updateItemNote
    } = useCart();

    if (cartItems.length === 0) return <p>Koszyk jest pusty</p>;

    return (
        <div className="cart">
            <h2>Twoje Zamówienie</h2>
            <ul>
                {cartItems.map(item => (
                    <li key={item.menuItemId} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong>{item.menuItemName}</strong>
                            <span>{item.quantity * item.unitPrice} PLN</span>
                        </div>

                        {/* Zmiana ilości */}
                        <div>
                            <button onClick={() => updateItemQuantity(item.menuItemId, item.quantity - 1)}>-</button>
                            <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                            <button onClick={() => updateItemQuantity(item.menuItemId, item.quantity + 1)}>+</button>
                            <button onClick={() => removeItem(item.menuItemId)} style={{ marginLeft: '10px', color: 'red' }}>Usuń</button>
                        </div>

                        {/* Notatka */}
                        <input
                            type="text"
                            placeholder="Notatka (np. bez cebuli)"
                            value={item.note}
                            onChange={(e) => updateItemNote(item.menuItemId, e.target.value)}
                            style={{ width: '100%', marginTop: '5px' }}
                        />
                    </li>
                ))}
            </ul>
            <h3>Do zapłaty: {totalAmount.toFixed(2)} PLN</h3>
        </div>
    );
};

export default CartSummary;