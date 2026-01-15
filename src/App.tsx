// import { CartProvider } from './context/CartContext';
// import MenuScreen from './screens/MenuScreen';
// import CartScreen from './screens/CartScreen';
//
// export default function App() {
//     return (
//         <CartProvider>
//             {/* Twoja nawigacja lub komponenty */}
//             <MenuScreen />
//             <CartScreen />
//         </CartProvider>
//     );
// }

import { TablesTestView } from '../src/screens/TablesTestView';

function App() {
    return (
        <div className="App">
            <TablesTestView />
        </div>
    );
}

export default App;