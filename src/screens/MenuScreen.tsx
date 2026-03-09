import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import type { MenuItemType } from '../models/Menu';
import { fetchAllMenuItems } from '../utils/MenuRequests';

// Komponent pojedynczego dania (pozostaje bez zmian)
const MenuItemComponent = ({ dish }: { dish: MenuItemType }) => {
    const { addItem } = useCart();

    return (
        <div style={{ border: '1px solid #ddd', padding: '0.5rem', margin: '0.3rem', borderRadius: '8px' }}>
            <h3>{dish.dishName}</h3>
            <p>Cena: {dish.price.toFixed(2)} PLN</p>
            <button
                disabled={!dish.available}
                onClick={() => addItem(dish)}
                style={{
                    padding: '8px 16px',
                    backgroundColor: dish.available ? '#0fcb0f' : '#cccccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: dish.available ? 'pointer' : 'not-allowed',
                    opacity: dish.available ? 1 : 0.6
                }}
            >
                {dish.available ? 'Dodaj do koszyka' : 'Niedostępne'}
            </button>
        </div>
    );
};

// Główny komponent
const MenuScreen = () => {
    const [menuData, setMenuData] = useState<MenuItemType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Definiujemy asynchroniczną funkcję wewnątrz useEffect
        const loadMenu = async () => {
            try {
                // Używamy gotowej funkcji z utils!
                const data = await fetchAllMenuItems();
                setMenuData(data);
            } catch (err) {
                console.error("Błąd podczas pobierania menu:", err);
                setError('Nie udało się załadować menu. Spróbuj ponownie później.');
            } finally {
                setIsLoading(false);
            }
        };

        loadMenu();
    }, []);

    if (isLoading) return <div>Ładowanie menu...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div className="menu-screen">
            <h1>Nasze Menu</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {menuData.map((dish) => (
                    <MenuItemComponent key={dish.id} dish={dish} />
                ))}
            </div>
        </div>
    );
};

export default MenuScreen;