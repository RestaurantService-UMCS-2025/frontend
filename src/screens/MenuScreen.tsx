import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import type { MenuItemType } from '../models/Menu';
import { fetchAllMenuItems } from '../utils/MenuRequests';

const MenuItemComponent = ({ dish }: { dish: MenuItemType }) => {
    const { addItem } = useCart();
    return (
        <div style={{ border: '1px solid #ddd', padding: '1rem', margin: '0.5rem', borderRadius: '8px', width: '200px' }}>
            <h3>{dish.dishName}</h3>
            <p>Cena: {dish.price.toFixed(2)} PLN</p>
            <button
                disabled={!dish.available}
                onClick={() => addItem(dish)}
                style={{
                    width: '100%', padding: '10px',
                    backgroundColor: dish.available ? '#28a745' : '#ccc',
                    color: 'white', border: 'none', borderRadius: '4px',
                    cursor: dish.available ? 'pointer' : 'not-allowed'
                }}
            >
                {dish.available ? 'Dodaj do koszyka' : 'Niedostępne'}
            </button>
        </div>
    );
};


const MenuScreen = () => {
    const [menuData, setMenuData] = useState<MenuItemType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAllMenuItems()
            .then(setMenuData)
            .catch(() => setError('Błąd ładowania menu'))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <div>Ładowanie menu...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h1>🍴 Nasze Menu</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {menuData.map((dish) => (
                    <MenuItemComponent key={dish.id} dish={dish} />
                ))}
            </div>
        </div>
    );
};

export default MenuScreen;