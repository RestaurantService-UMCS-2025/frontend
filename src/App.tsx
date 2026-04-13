import { useState } from 'react';
import { CartProvider } from "./context/CartContext.tsx";
import MenuScreen from "./screens/MenuScreen.tsx";
import CartSummary from "./screens/CartScreen.tsx";
import { CreateOrderScreen } from "./screens/CreateOrderView.tsx";
import { TablesTestView } from './screens/TablesTestView';
import { ActiveOrderScreen } from './screens/ActiveOrderScreen'; // ⬅️ NOWY IMPORT (upewnij się, że ścieżka jest poprawna)
import './App.css';

export function App() {
    // 1. Inicjalizacja stanu: sprawdzamy, czy w pamięci jest zamówienie.
    // Jeśli jest, od razu otwieramy zakładkę 'activeOrder'. Jeśli nie, domyślnie 'menu'.
    const [currentTab, setCurrentTab] = useState<'menu' | 'cart' | 'tables' | 'checkout' | 'activeOrder'>(() => {
        const savedOrderId = localStorage.getItem('myActiveOrderId');
        return savedOrderId ? 'activeOrder' : 'menu';
    });

    // 2. Dodatkowy stan, żeby wiedzieć, czy wyświetlać przycisk "Moje Zamówienie" w nawigacji
    const [hasActiveOrder, setHasActiveOrder] = useState<boolean>(!!localStorage.getItem('myActiveOrderId'));

    // 3. Funkcja wywoływana po udanym złożeniu zamówienia
    const handleOrderSuccess = () => {
        setHasActiveOrder(true); // Pokazujemy przycisk w menu
        setCurrentTab('activeOrder'); // Przełączamy widok na aktywne zamówienie
    };

    return (
        <CartProvider>
            <div className="app-layout">
                <div className="content-area">
                    {currentTab === 'menu' && <MenuScreen />}
                    {currentTab === 'cart' && <CartSummary onNavigateToCheckout={() => setCurrentTab('checkout')} />}
                    {currentTab === 'checkout' && (
                        <CreateOrderScreen
                            onOrderSuccess={handleOrderSuccess} // ⬅️ ZMIANA: używamy nowej funkcji
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

                    {/* ⬅️ NOWY PRZYCISK: Pokazuje się tylko, jeśli klient ma aktywne zamówienie */}
                    {hasActiveOrder && (
                        <button
                            onClick={() => setCurrentTab('activeOrder')}
                            className={currentTab === 'activeOrder' ? 'active' : ''}
                            style={{ fontWeight: 'bold', color: '#28a745' }} // Wyróżniamy na zielono
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