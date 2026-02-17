"use client"
import { useCarrito } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Producto } from "@/types";
import { Sparkles } from "lucide-react";

export function BotonAgregar({ producto }: { producto: Producto }) {
    const agregar = useCarrito((state) => state.agregarProducto);

    return (
        <Button
            onClick={(e) => {
                e.stopPropagation(); // Evita abrir el modal al hacer click en el botón
                agregar(producto);
            }}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full py-7 shadow-lg shadow-pink-100 transition-all hover:scale-105 active:scale-95 flex gap-2 text-xs font-black uppercase tracking-widest"
        >
            <Sparkles className="w-4 h-4" />
            Añadir al carrito
        </Button>
    );
}