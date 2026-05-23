import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import type { MenuItemType } from '../models/Menu';
import { fetchAllMenuItems } from '../utils/MenuRequests';
import {ErrorMessage} from "../components/ErrorMessage.tsx";

const MenuItemComponent = ({ dish, index }: { dish: MenuItemType, index: number }) => {
    const { addItem } = useCart();
    return (
        <div className="card" style={{ animationDelay: `${index * 0.05}s` }}>
            <h3>{dish.dishName}</h3>
            <div className="card-price">{dish.price.toFixed(2)} PLN</div>
            <button
                className={`btn ${dish.available ? 'btn-success' : 'btn-outline'}`}
                disabled={!dish.available}
                onClick={() => addItem(dish)}
                style={{ width: '100%', marginTop: '10px' }}
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
            .catch((err) => setError(err.message || 'Nieznany błąd serwera.'))
            .finally(() => setIsLoading(false));
    }, []);

    if (isLoading) return <div className="animated-view">Ładowanie pysznego menu...</div>;

    // ⬇️ NOWA OBSŁUGA BŁĘDU
    if (error) return (
        <div className="animated-view">
            <ErrorMessage
                message="Nie udało się załadować listy dań. Sprawdź swoje połączenie z internetem lub spróbuj ponownie za chwilę."
                debugDetails={error}
            />
            <button className="btn btn-outline" onClick={() => window.location.reload()}>Spróbuj ponownie</button>
        </div>
    );

    return (
        <div className="animated-view">
            <h1>Odkryj Nasze Smaki</h1>
            <div className="menu-grid">
                {menuData.map((dish, idx) => (
                    <MenuItemComponent key={dish.id} dish={dish} index={idx} />
                ))}
            </div>
        </div>
    );
};

export default MenuScreen;