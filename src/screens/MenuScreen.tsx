import { useCart } from '../context/CartContext';
import type { MenuItemType } from '../models/Menu';

//  Test Data
//  TODO: dopisać CRUD do API
const mockMenuData: MenuItemType[] = [
    { Id: 1, DishName: 'Pizza Margherita', Price: 30, Available: true },
    { Id: 2, DishName: 'Burger Klasyczny', Price: 45, Available: true },
    { Id: 3, DishName: 'Sałatka Cezar', Price: 25, Available: false },
    { Id: 4, DishName: 'Pizza Neapolitan', Price: 29, Available: false },
];

// Komponent
const MenuItemComponent = ({ dish }: { dish: MenuItemType }) => {
    const { addItem } = useCart();

    return (
        <div style={{ border: '1px solid #ddd', padding: '0.5rem', margin: '0.3rem', borderRadius: '8px' }}>
            <h3>{dish.DishName}</h3>
            <p>Cena: {dish.Price.toFixed(2)} PLN</p>
            <button
                disabled={!dish.Available}
                onClick={() => addItem(dish)}

                // Styles
                style={{
                    padding: '8px 16px',
                    backgroundColor: dish.Available ? '#0fcb0f' : '#cccccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: dish.Available ? 'pointer' : 'not-allowed',
                    opacity: dish.Available ? 1 : 0.6
                }}
            >
                {/* 3. Tekst informacyjny */}
                {dish.Available ? 'Dodaj do koszyka' : 'Niedostępne'}
            </button>
        </div>
    );
};

// Główny komponent
const MenuScreen = () => {
    return (
        <div className="menu-screen">
            <h1>Nasze Menu</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {mockMenuData.map((dish) => (
                    <MenuItemComponent key={dish.Id} dish={dish} />
                ))}
            </div>
        </div>
    );
};

export default MenuScreen;