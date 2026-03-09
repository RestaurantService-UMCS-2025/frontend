import { TablesTestView } from '../src/screens/TablesTestView';
import MenuScreen from "./screens/MenuScreen.tsx";
import {CartProvider} from "./context/CartContext.tsx";
import CartScreen from "./screens/CartScreen.tsx";


export function App() {
    return (
        <CartProvider>
            {/* Twoja nawigacja lub komponenty */}
            <TablesTestView />
            <MenuScreen />
            <CartScreen />
        </CartProvider>
    );
}
export default App;