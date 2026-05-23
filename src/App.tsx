import { useState } from 'react';
import { CartProvider, useCart } from "./context/CartContext.tsx"; // <-- Dodano import useCart
import MenuScreen from "./screens/MenuScreen.tsx";
import CartSummary from "./screens/CartScreen.tsx";
import { CreateOrderScreen } from "./screens/CreateOrderView.tsx";
import { TablesTestView } from './screens/TablesTestView';
import { ActiveOrderScreen } from './screens/ActiveOrderScreen';
import './App.css';

// ⬇️ NOWE: Mały komponent wyświetlający czerwoną kropkę z ilością, jeśli koszyk nie jest pusty
const CartBadgeHelper = () => {
    const { cartItems } = useCart();
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (totalItems === 0) return null;

    return <span className="cart-badge">{totalItems}</span>;
};

export function App() {
    const getTableIdFromUrl = () => {
        const pathValue = window.location.pathname.replace('/', '');
        const parsed = parseInt(pathValue, 10);
        return isNaN(parsed) ? null : parsed;
    };

    const [scannedTableId] = useState<number | null>(getTableIdFromUrl());

    const [currentTab, setCurrentTab] = useState<'menu' | 'cart' | 'tables' | 'checkout' | 'activeOrder'>(() => {
        const savedOrderId = localStorage.getItem('myActiveOrderId');
        return savedOrderId ? 'activeOrder' : 'menu';
    });

    const [hasActiveOrder, setHasActiveOrder] = useState<boolean>(!!localStorage.getItem('myActiveOrderId'));

    const handleOrderSuccess = () => {
        setHasActiveOrder(true);
        setCurrentTab('activeOrder');
    };

    return (
        <CartProvider>
            <div className="app-layout">
                <div className="content-area animated-view">
                    {currentTab === 'menu' && <MenuScreen />}
                    {currentTab === 'cart' && <CartSummary onNavigateToCheckout={() => setCurrentTab('checkout')} />}
                    {currentTab === 'checkout' && (
                        <CreateOrderScreen
                            onOrderSuccess={handleOrderSuccess}
                            onBack={() => setCurrentTab('cart')}
                            preselectedTableId={scannedTableId}
                        />
                    )}
                    {currentTab === 'tables' && <TablesTestView />}
                    {currentTab === 'activeOrder' && <ActiveOrderScreen />}
                </div>

                <nav className="bottom-nav">
                    <button onClick={() => setCurrentTab('menu')} className={currentTab === 'menu' ? 'active' : ''}>
                        🍴 Menu
                    </button>

                    {/* ⬇️ ZMODYFIKOWANE: Dodano komponent CartBadgeHelper do przycisku koszyka */}
                    <button onClick={() => setCurrentTab('cart')} className={currentTab === 'cart' ? 'active' : ''}>
                        🛒 Koszyk
                        <CartBadgeHelper />
                    </button>

                    <button onClick={() => setCurrentTab('tables')} className={currentTab === 'tables' ? 'active' : ''}>
                        🪑 Stoliki
                    </button>
                    {hasActiveOrder && (
                        <button
                            onClick={() => setCurrentTab('activeOrder')}
                            className={`active-order-btn ${currentTab === 'activeOrder' ? 'active' : ''}`}
                        >
                            📋 Moje zamówienie
                        </button>
                    )}
                </nav>
            </div>
        </CartProvider>
    );
}

export default App;