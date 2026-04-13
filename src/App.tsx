import { useState } from 'react';
import { CartProvider } from "./context/CartContext.tsx";
import MenuScreen from "./screens/MenuScreen.tsx";
import CartSummary from "./screens/CartScreen.tsx";
import { CreateOrderScreen } from "./screens/CreateOrderView.tsx";
import { TablesTestView } from './screens/TablesTestView';
import { ActiveOrderScreen } from './screens/ActiveOrderScreen';
import './App.css';

export function App() {

    // Check if OrderId is in the memory
    const [currentTab, setCurrentTab] = useState<'menu' | 'cart' | 'tables' | 'checkout' | 'activeOrder'>(() => {
        const savedOrderId = localStorage.getItem('myActiveOrderId');
        return savedOrderId ? 'activeOrder' : 'menu';
    });

    // New state to know if to dislay 'myActiveOrderId' view
    const [hasActiveOrder, setHasActiveOrder] = useState<boolean>(!!localStorage.getItem('myActiveOrderId'));

    // On Success
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
                    {currentTab === 'checkout' && (
                        <CreateOrderScreen
                            onOrderSuccess={handleOrderSuccess}
                            onBack={() => setCurrentTab('cart')}
                        />
                    )}
                    {currentTab === 'tables' && <TablesTestView />}

                    {/* ⬅️ NOWY WIDOK: Ekran aktywnego zamówienia */}
                    {currentTab === 'activeOrder' && <ActiveOrderScreen />}
                </div>

                <nav className="bottom-nav">
                    <button onClick={() => setCurrentTab('menu')} className={currentTab === 'menu' ? 'active' : ''}>Menu</button>
                    <button onClick={() => setCurrentTab('cart')} className={currentTab === 'cart' ? 'active' : ''}>Koszyk</button>
                    <button onClick={() => setCurrentTab('tables')} className={currentTab === 'tables' ? 'active' : ''}>Stoliki</button>

                    {/*Button shows if there is active order*/}
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