import { CartProvider } from './context/CartContext';
import MenuScreen from './screens/MenuScreen';
import CartScreen from './screens/CartScreen';

export default function App() {
    return (
        <CartProvider>
            {/* Twoja nawigacja lub komponenty */}
            <MenuScreen />
            <CartScreen />
        </CartProvider>
    );
}