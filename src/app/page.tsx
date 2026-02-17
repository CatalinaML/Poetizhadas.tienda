"use client"
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Producto } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carrito } from "@/components/carrito";
import { BotonAgregar } from "@/components/addToCart";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, ChevronDown, Sparkles, Heart } from "lucide-react";

export default function Tienda() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const productosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const { data } = await supabase.from('products').select('*');
    if (data) setProductos(data);
  };

  const scrollToProducts = () => {
    productosRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const categorias = ['Todas', ...Array.from(new Set(productos.map(p => p.category)))];

  const filtrados = productos.filter(p => {
    const nombreOk = p.name.toLowerCase().includes(busqueda.toLowerCase());
    const catOk = categoriaActiva === 'Todas' || p.category === categoriaActiva;
    return nombreOk && catOk;
  });

  return (
    <div className="min-h-screen bg-[#fff1f2] text-[#4c0519] selection:bg-pink-200">

      {/* --- HERO SECTION --- */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50 to-[#fff1f2] opacity-60" />
        <div className="absolute top-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-20" />

        <div className="relative z-10 text-center px-6 max-w-4xl space-y-6 flex flex-col items-center">
          <div className="flex justify-center items-center gap-3 mb-2 animate-bounce">
            <Sparkles className="text-pink-400 w-5 h-5" />
            <span className="text-[10px] uppercase tracking-[0.5em] text-pink-400 font-black">Arte hecho a mano</span>
            <Sparkles className="text-pink-400 w-5 h-5" />
          </div>

          {/* LOGO EN EL HERO */}
          <Image
            src="/logo.png"
            alt="Poetizhadas Logo"
            width={300}
            height={150}
            priority
            className="drop-shadow-2xl mb-4"
          />

          <p className="text-xl md:text-2xl font-serif italic text-pink-700 leading-relaxed max-w-2xl mx-auto">
            "Transformamos suspiros en objetos, y momentos en poesía tangible."
          </p>

          <div className="pt-10">
            <button
              onClick={scrollToProducts}
              className="bg-pink-500 hover:bg-pink-600 text-white px-12 py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-pink-200 transition-all hover:scale-105 active:scale-95"
            >
              Entrar a la Colección
            </button>
          </div>
        </div>

        <button onClick={scrollToProducts} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-pink-300 animate-pulse">
          <ChevronDown size={40} strokeWidth={1} />
        </button>
      </section>

      {/* --- NAVBAR REFINADA (Logo más pequeño) --- */}
      <nav className="h-20 bg-white/80 backdrop-blur-md border-b border-pink-100 sticky top-0 z-50 flex items-center shadow-sm">
        <div className="container mx-auto px-8 flex justify-between items-center">

          {/* Lado Izquierdo: Logo Ajustado */}
          <div
            className="cursor-pointer flex items-center"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative w-32 h-12"> {/* Contenedor pequeño y controlado */}
              <Image
                src="/logo.png"
                alt="Poetizhadas"
                fill // Ocupa el espacio del contenedor
                className="object-contain object-left transform hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
          </div>

          {/* Centro: Enlaces con tipografía más fina */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[9px] font-bold uppercase tracking-[0.3em] text-pink-900/60 hover:text-pink-500 transition-colors">Inicio</button>
            <button onClick={scrollToProducts} className="text-[9px] font-bold uppercase tracking-[0.3em] text-pink-900/60 hover:text-pink-500 transition-colors">Colección</button>
            <a href="https://instagram.com/poetizhadas_tienda" target="_blank" className="text-[9px] font-bold uppercase tracking-[0.3em] text-pink-900/60 hover:text-pink-500 transition-colors">Instagram</a>
          </div>

          {/* Lado Derecho: Carrito */}
          <div className="flex items-center">
            <Carrito />
          </div>

        </div>
      </nav>

      <main ref={productosRef} className="container mx-auto py-20 px-8">

        {/* --- BUSCADOR Y CATEGORÍAS --- */}
        <section className="flex flex-col md:flex-row gap-8 mb-24 items-center justify-between bg-white/40 p-8 rounded-[3rem] border border-white shadow-xl backdrop-blur-md">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />
            <Input
              placeholder="¿Qué buscas hoy, hada? ✨"
              className="pl-14 rounded-full border-none bg-white/80 h-14 shadow-inner focus:ring-pink-200 text-pink-900"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="flex gap-3 overflow-x-auto w-full md:w-auto pb-4 md:pb-0 no-scrollbar">
            {categorias.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoriaActiva(cat)}
                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${categoriaActiva === cat
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-200 scale-105'
                  : 'bg-white text-pink-400 hover:bg-pink-50 hover:text-pink-600'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* --- GRILLA CON MODAL DE DETALLE --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
          {filtrados.map((p) => (
            <Dialog key={p.id}>
              <Card className="border-none shadow-xl hover:shadow-[0_20px_50px_rgba(251,207,232,0.4)] transition-all duration-700 bg-white rounded-[3rem] overflow-hidden group flex flex-col">
                <DialogTrigger asChild>
                  <div className="h-80 overflow-hidden relative cursor-zoom-in">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-6 left-6">
                      <span className="bg-white/90 backdrop-blur-md text-pink-500 text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-sm">
                        {p.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-pink-900/0 group-hover:bg-pink-900/10 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="bg-white text-pink-500 p-3 rounded-full shadow-xl">
                        <Sparkles size={20} />
                      </span>
                    </div>
                  </div>
                </DialogTrigger>

                <CardHeader className="p-8 pb-0 text-center">
                  <CardTitle className="text-2xl font-serif text-pink-900 tracking-tight">{p.name}</CardTitle>
                </CardHeader>

                <CardContent className="px-8 pt-4 text-center flex-1">
                  <p className="text-3xl font-serif font-light text-pink-600 mb-4">${p.price.toLocaleString()}</p>
                  <p className="text-xs text-pink-300 italic font-serif line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </CardContent>

                <CardFooter className="p-8 pt-0">
                  <BotonAgregar producto={p} />
                </CardFooter>
              </Card>

              {/* --- EL MODAL DE DETALLE REDISEÑADO --- */}
              <DialogContent className="max-w-[95vw] md:max-w-4xl p-0 overflow-hidden rounded-[2rem] border-none bg-white shadow-2xl">
                <DialogHeader className="sr-only">
                  <DialogTitle>{p.name}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col md:flex-row h-full max-h-[90vh] md:max-h-[600px]">

                  {/* Contenedor de Imagen: Ocupa el 50% en desktop */}
                  <div className="w-full md:w-1/2 h-[300px] md:h-full bg-pink-50">
                    <img
                      src={p.image_url}
                      className="w-full h-full object-cover"
                      alt={p.name}
                    />
                  </div>

                  {/* Contenedor de Texto: Padding amplio y ordenado */}
                  <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between bg-white relative">

                    {/* Botón de cerrar personalizado (Opcional, Shadcn ya trae uno, pero este asegura espacio) */}
                    <div className="space-y-6">
                      <div>
                        <span className="text-[10px] font-black text-pink-400 uppercase tracking-[0.3em] block mb-2">
                          {p.category}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif text-pink-900 leading-tight tracking-tighter">
                          {p.name}
                        </h2>
                      </div>

                      <div className="h-px w-12 bg-pink-200" />

                      <p className="text-base md:text-lg font-serif italic text-pink-700 leading-relaxed">
                        {p.description}
                      </p>
                    </div>

                    <div className="mt-8 md:mt-0 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-pink-300 uppercase font-bold tracking-widest">Inversión</span>
                          <p className="text-4xl font-serif font-bold text-pink-600">
                            ${p.price.toLocaleString()}
                          </p>
                        </div>

                        {/* Ajustamos el botón para que no se rompa */}
                        <div className="w-1/2">
                          <BotonAgregar producto={p} />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-pink-50">
                        <p className="text-[9px] text-pink-300 uppercase tracking-[0.2em] text-center flex items-center justify-center gap-2">
                          <Sparkles size={10} /> Pieza única de la colección Poetizhadas <Sparkles size={10} />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </main>

      {/* --- SECCIÓN STORYTELLING --- */}
      <section className="bg-white py-32 px-8 overflow-hidden">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-20">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-pink-50 rounded-full -z-10" />
            <img
              src="/nosotros.jpg"
              className="rounded-[3rem] shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700"
              alt="Sobre nosotros"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-5xl font-serif text-pink-900">El alma detrás de la piezas</h2>
            <p className="text-lg text-pink-700 font-serif italic leading-relaxed">
              "En Poetizhadas creemos que los objetos no son solo materia. Son portadores de intenciones. Cada vela, cada libreta, cada detalle que sale de nuestro taller ha sido pensado para recordarte la belleza de lo sutil."
            </p>
            <div className="h-0.5 w-20 bg-pink-200" />
            <p className="text-sm text-pink-400 font-medium tracking-widest uppercase">Con amor, el equipo de Poetizhadas.</p>
          </div>
        </div>
      </section>

      <footer className="py-24 bg-[#fff1f2] text-center space-y-4 border-t border-pink-100">
        <h2 className="text-3xl font-serif font-bold text-pink-900 tracking-tighter">POETIZHADAS</h2>
        <div className="flex justify-center gap-4 text-pink-300">
          <Heart size={20} className="fill-current" />
        </div>
        <p className="text-[10px] text-pink-400 uppercase tracking-[0.4em] font-bold mt-8">© 2026 Arte & Poesía hecho realidad</p>
      </footer>
    </div>
  );
}