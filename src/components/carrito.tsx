"use client"
import { useCarrito } from "@/lib/store";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Trash2, Send } from "lucide-react";

export function Carrito() {
  const { items, eliminarProducto, isCartOpen, setCartOpen } = useCarrito();
  const total = items.reduce((acc, item) => acc + (item.price * item.cantidad), 0);

  const enviarWhatsApp = () => {
    const tel = "+542236682744";
    const msg = items.map(i => `✨ *${i.name}* x${i.cantidad} ($${i.price * i.cantidad})`).join('\n');
    const url = `https://wa.me/${tel}?text=${encodeURIComponent("¡Hola Poetizhadas! ✨ Me encantaría este pedido:\n\n" + msg + "\n\n*Total: $" + total + "*")}`;
    window.open(url, '_blank');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="relative hover:bg-pink-50 text-pink-700 p-2 rounded-full">
          <ShoppingBag className="w-6 h-6" />
          {items.length > 0 && (
            <span className="bg-pink-500 text-white absolute -top-1 -right-1 rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm">
              {items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-[#fff1f2] border-l-pink-100 w-[90%] sm:w-[450px] p-0 flex flex-col">
        <SheetHeader className="p-10 pb-6 bg-white/50 backdrop-blur-sm">
          <SheetTitle className="text-3xl font-serif text-pink-900 italic tracking-tight">Tu Carrito</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-10 py-6 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 items-center bg-white p-5 rounded-[2rem] shadow-sm border border-pink-50 transition-all hover:shadow-md">
              <img src={item.image_url} className="w-20 h-20 object-cover rounded-2xl" alt={item.name} />
              <div className="flex-1">
                <p className="font-bold text-pink-900 leading-tight">{item.name}</p>
                <p className="text-xs text-pink-400 font-medium uppercase mt-1">Cantidad: {item.cantidad}</p>
                <p className="text-lg font-serif text-pink-600 mt-1">${(item.price * item.cantidad).toLocaleString()}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => eliminarProducto(item.id)} className="text-pink-200 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-20 font-serif italic text-pink-300">
              Aún no hay tesoros seleccionados...
            </div>
          )}
        </div>
        {items.length > 0 && (
          <div className="p-10 bg-white border-t border-pink-100 space-y-6">
            <div className="flex justify-between items-end px-2">
              <span className="text-pink-400 font-serif italic text-lg">Inversión Total</span>
              <span className="text-4xl font-serif font-bold text-pink-900">${total.toLocaleString()}</span>
            </div>
            <Button onClick={enviarWhatsApp} className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-full h-16 text-lg shadow-xl shadow-pink-100 flex gap-3 transition-transform active:scale-95">
              <Send className="w-5 h-5" /> Enviar Pedido Mágico
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}