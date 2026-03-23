// Plik: App.tsx
import React, { useState } from 'react';
import { TablesTestView } from './screens/TablesTestView';
import MenuScreen from "./screens/MenuScreen.tsx";
import CartSummary from "./screens/CartScreen.tsx"; // Użyto nazwy komponentu z pliku
import { CartProvider, useCart } from "./context/CartContext.tsx";
import './App.css'; // Pamiętaj o imporcie stylów!

// Osobny komponent dla przycisku koszyka, aby móc czytać z kontekstu
const CartNavButton = ({ isActive, onClick }: { isActive: boolean, onClick: () => void }) => {
    const { totalQuantity } = useCart();
    return (
        <button className={`nav-button ${isActive ? 'active' : ''}`} onClick={onClick}>
            Koszyk {totalQuantity > 0 && `(${totalQuantity})`}
        </button>
    );
};

export function App() {
    // Stan zarządzający aktualnym widokiem ('menu', 'cart', 'tables')
    const [currentTab, setCurrentTab] = useState<'menu' | 'cart' | 'tables'>('menu');

    return (
        <CartProvider>
            <div className="app-layout">
                {/* Główny obszar wyświetlania */}
                <div className="content-area">
                    {currentTab === 'menu' && <MenuScreen />}
                    {currentTab === 'cart' && <CartSummary />}
                    {currentTab === 'tables' && <TablesTestView />}
                </div>

                {/* Pasek nawigacji na dole ekranu */}
                <nav className="bottom-nav">
                    <button
                        className={`nav-button ${currentTab === 'menu' ? 'active' : ''}`}
                        onClick={() => setCurrentTab('menu')}
                    >
                        Menu
                    </button>

                    <CartNavButton
                        isActive={currentTab === 'cart'}
                        onClick={() => setCurrentTab('cart')}
                    />

                    <button
                        className={`nav-button ${currentTab === 'tables' ? 'active' : ''}`}
                        onClick={() => setCurrentTab('tables')}
                    >
                        Stoliki
                    </button>
                </nav>
            </div>
        </CartProvider>
    );
}

export default App;