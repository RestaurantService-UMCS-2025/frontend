import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import type { OrderItem } from '../models/OrderItem'; // Dopasuj ścieżkę
import type { MenuItemType } from '../models/Menu.ts';          // Dopasuj ścieżkę
import { OrderItemStatus } from '../models/enums/OrderItemStatus'; // Dopasuj ścieżkę

// Definicja kształtu naszego Contextu
interface CartContextType {
    cartItems: OrderItem[];
    totalAmount: number;
    totalQuantity: number;
    addItem: (product: MenuItemType, quantity?: number) => void;
    removeItem: (menuItemId: number) => void;
    updateItemQuantity: (menuItemId: number, quantity: number) => void;
    updateItemNote: (menuItemId: number, note: string) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Domyślny status dla nowych zamówień (dostosuj do swojego enuma, np. NEW lub PENDING)
// Zakładam, że masz tam coś w stylu 'Ordered' lub 'Pending'
const DEFAULT_ITEM_STATUS = OrderItemStatus.Ordered;

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<OrderItem[]>([]);

    // --- LOGIKA BIZNESOWA ---

    // 1. Dodawanie do koszyka
    const addItem = (product: MenuItemType, quantity: number = 1) => {
        setCartItems((prevItems) => {
            // Sprawdź, czy produkt już jest w koszyku
            const existingItemIndex = prevItems.findIndex(item => item.menuItemId === product.Id);

            if (existingItemIndex >= 0) {
                // Kopia tablicy (immutability)
                const updatedItems = [...prevItems];
                const existingItem = updatedItems[existingItemIndex];

                // Zaktualizuj ilość
                updatedItems[existingItemIndex] = {
                    ...existingItem,
                    quantity: existingItem.quantity + quantity
                };
                return updatedItems;
            } else {
                // Stwórz nowy OrderItem
                // UWAGA: orderItemId ustawiam tymczasowo na ujemną wartość lub timestamp,
                // ponieważ prawdziwe ID nada baza danych po wysłaniu zamówienia.
                const newItem: OrderItem = {
                    orderItemId: -Date.now(),
                    menuItemId: product.Id,
                    menuItemName: product.DishName,
                    quantity: quantity,
                    unitPrice: product.Price,
                    note: '',
                    status: DEFAULT_ITEM_STATUS
                };
                return [...prevItems, newItem];
            }
        });
    };

    // 2. Usuwanie z koszyka
    const removeItem = (menuItemId: number) => {
        setCartItems(prev => prev.filter(item => item.menuItemId !== menuItemId));
    };

    // 3. Aktualizacja ilości
    const updateItemQuantity = (menuItemId: number, quantity: number) => {
        if (quantity <= 0) {
            removeItem(menuItemId);
            return;
        }
        setCartItems(prev => prev.map(item =>
            item.menuItemId === menuItemId ? { ...item, quantity } : item
        ));
    };

    // 4. Aktualizacja notatki
    const updateItemNote = (menuItemId: number, note: string) => {
        setCartItems(prev => prev.map(item =>
            item.menuItemId === menuItemId ? { ...item, note } : item
        ));
    };

    // 5. Wyczyszczenie koszyka
    const clearCart = () => {
        setCartItems([]);
    };

    // --- OBLICZENIA (Derived State) ---

    // Obliczanie sumy całkowitej (billAmount)
    const totalAmount = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    }, [cartItems]);

    // Obliczanie łącznej liczby produktów (np. do badge'a na ikonie koszyka)
    const totalQuantity = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }, [cartItems]);

    const value = {
        cartItems,
        totalAmount,
        totalQuantity,
        addItem,
        removeItem,
        updateItemQuantity,
        updateItemNote,
        clearCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom Hook dla łatwiejszego użycia
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};