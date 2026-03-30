import React, { useState } from 'react';
import { CartProvider } from "./context/CartContext.tsx";
import MenuScreen from "./screens/MenuScreen.tsx";
import CartSummary from "./screens/CartScreen.tsx";
import { CreateOrderScreen } from "./screens/CreateOrderView.tsx";
import { TablesTestView } from './screens/TablesTestView';
import './App.css';

export function App() {
    const [currentTab, setCurrentTab] = useState<'menu' | 'cart' | 'tables' | 'checkout'>('menu');

    return (
        <CartProvider>
            <div className="app-layout">
                <div className="content-area">
                    {currentTab === 'menu' && <MenuScreen />}
                    {currentTab === 'cart' && <CartSummary onNavigateToCheckout={() => setCurrentTab('checkout')} />}
                    {currentTab === 'checkout' && (
                        <CreateOrderScreen
                            onOrderSuccess={() => setCurrentTab('tables')}
                            onBack={() => setCurrentTab('cart')}
                        />
                    )}
                    {currentTab === 'tables' && <TablesTestView />}
                </div>

                <nav className="bottom-nav">
                    <button onClick={() => setCurrentTab('menu')} className={currentTab === 'menu' ? 'active' : ''}>Menu</button>
                    <button onClick={() => setCurrentTab('cart')} className={currentTab === 'cart' ? 'active' : ''}>Koszyk</button>
                    <button onClick={() => setCurrentTab('tables')} className={currentTab === 'tables' ? 'active' : ''}>Stoliki</button>
                </nav>
            </div>
        </CartProvider>
    );
}

export default App;