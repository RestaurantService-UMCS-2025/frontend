import { useState } from 'react';
import { CartProvider } from "./context/CartContext.tsx";
import MenuScreen from "./screens/MenuScreen.tsx";
import CartSummary from "./screens/CartScreen.tsx";
import { CreateOrderScreen } from "./screens/CreateOrderView.tsx";
import { TablesTestView } from './screens/TablesTestView';
import { ActiveOrderScreen } from './screens/ActiveOrderScreen';
import './App.css';

export function App() {
    // ⬇️ NOWE: Funkcja odczytująca ID stolika z adresu URL (np. /5 zwraca 5)
    const getTableIdFromUrl = () => {
        const pathValue = window.location.pathname.replace('/', '');
        const parsed = parseInt(pathValue, 10);
        return isNaN(parsed) ? null : parsed;
    };

    // ⬇️ NOWE: Stan przechowujący odczytany stolik (null jeśli brak w linku)
    const [scannedTableId] = useState<number | null>(getTableIdFromUrl());

    // Check if OrderId is in the memory
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
                <div className="content-area">
                    {currentTab === 'menu' && <MenuScreen />}
                    {currentTab === 'cart' && <CartSummary onNavigateToCheckout={() => setCurrentTab('checkout')} />}

                    {/* ⬇️ ZMODYFIKOWANE: Przekazujemy scannedTableId do widoku zamówienia */}
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
                    <button onClick={() => setCurrentTab('menu')} className={currentTab === 'menu' ? 'active' : ''}>Menu</button>
                    <button onClick={() => setCurrentTab('cart')} className={currentTab === 'cart' ? 'active' : ''}>Koszyk</button>
                    <button onClick={() => setCurrentTab('tables')} className={currentTab === 'tables' ? 'active' : ''}>Stoliki</button>

                    {hasActiveOrder && (
                        <button
                            onClick={() => setCurrentTab('activeOrder')}
                            className={currentTab === 'activeOrder' ? 'active' : ''}
                            style={{ fontWeight: 'bold', color: '#28a745' }}
                        >
                            Moje zamówienie
                        </button>
                    )}
                </nav>
            </div>
        </CartProvider>
    );
}

export default App;