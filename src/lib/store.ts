import { create } from 'zustand';
import { Producto } from '@/types';

interface CartItem extends Producto {
  cantidad: number;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean; // Nuevo
  setCartOpen: (open: boolean) => void; // Nuevo
  agregarProducto: (p: Producto) => void;
  eliminarProducto: (id: number) => void;
}

export const useCarrito = create<CartStore>((set) => ({
  items: [],
  isCartOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  agregarProducto: (producto) => set((state) => {
    const existe = state.items.find(item => item.id === producto.id);
    if (existe) {
      return {
        items: state.items.map(item => item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
        ),
        isCartOpen: true // Abrimos el carrito al agregar
      };
    }
    return {
      items: [...state.items, { ...producto, cantidad: 1 }],
      isCartOpen: true // Abrimos el carrito al agregar
    };
  }),
  eliminarProducto: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  })),
}));