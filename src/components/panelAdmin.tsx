"use client"
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Producto } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Sparkles, LogOut, Image as ImageIcon } from "lucide-react";

export function PanelAdmin() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [form, setForm] = useState({ name: '', price: '', description: '', category: '' });
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchProductos(); }, []);

    const fetchProductos = async () => {
        const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
        if (data) setProductos(data);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return alert("¡Ups! Falta la imagen");
        setLoading(true);
        try {
            const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
            const { error: storageErr } = await supabase.storage.from('imagenes-productos').upload(fileName, file);
            if (storageErr) throw storageErr;
            const { data: { publicUrl } } = supabase.storage.from('imagenes-productos').getPublicUrl(fileName);

            const { error: dbErr } = await supabase.from('products').insert([{
                name: form.name,
                price: Number(form.price),
                description: form.description,
                category: form.category,
                image_url: publicUrl
            }]);
            if (dbErr) throw dbErr;
            setForm({ name: '', price: '', description: '', category: '' }); setFile(null);
            fetchProductos();
        } catch (err: any) { alert(err.message); }
        finally { setLoading(false); }
    };

    const deleteProd = async (id: number) => {
        if (!confirm("¿Borrar esta pieza de la colección?")) return;
        await supabase.from('products').delete().eq('id', id);
        fetchProductos();
    };

    return (
        <div className="min-h-screen bg-[#fff1f2] p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-10">
                <header className="flex justify-between items-center bg-white p-6 rounded-[2rem] shadow-sm border border-pink-50">
                    <h1 className="text-2xl font-serif text-pink-900 flex items-center gap-2 italic">
                        <Sparkles className="text-pink-500 w-5 h-5" /> Gestión Poetizhadas
                    </h1>
                    <Button variant="ghost" onClick={() => supabase.auth.signOut().then(() => window.location.reload())} className="text-pink-400 hover:text-pink-600">
                        <LogOut className="w-4 h-4 mr-2" /> Salir
                    </Button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* FORMULARIO */}
                    <section className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-xl border border-pink-50 h-fit space-y-6">
                        <h2 className="text-lg font-serif text-pink-800">Nueva Creación</h2>
                        <form onSubmit={handleUpload} className="space-y-4">
                            <Input placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required className="rounded-xl border-pink-100" />
                            <Input placeholder="Categoría" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required className="rounded-xl border-pink-100" />
                            <Input type="number" placeholder="Precio" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required className="rounded-xl border-pink-100" />
                            <textarea
                                className="w-full p-4 rounded-xl border border-pink-100 text-sm focus:ring-2 focus:ring-pink-200 outline-none min-h-[100px]"
                                placeholder="Descripción poética..."
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })}
                            />
                            <div className="relative border-2 border-dashed border-pink-100 rounded-xl p-4 text-center hover:bg-pink-50 transition-colors">
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setFile(e.target.files?.[0] || null)} required />
                                <ImageIcon className="mx-auto text-pink-200 w-8 h-8 mb-2" />
                                <p className="text-[10px] text-pink-400 uppercase font-bold">{file ? file.name : "Subir Imagen"}</p>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full bg-pink-500 hover:bg-pink-600 rounded-full h-12 shadow-lg shadow-pink-100 transition-transform active:scale-95">
                                {loading ? "Guardando..." : "Publicar Pieza"}
                            </Button>
                        </form>
                    </section>

                    {/* TABLA */}
                    <section className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-xl border border-pink-50 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-pink-50/50 text-pink-400 text-[10px] uppercase font-bold tracking-widest">
                                <tr>
                                    <th className="p-6">Pieza</th>
                                    <th className="p-6">Categoría</th>
                                    <th className="p-6">Precio</th>
                                    <th className="p-6 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-pink-50">
                                {productos.map(p => (
                                    <tr key={p.id} className="hover:bg-pink-50/20 transition-colors">
                                        <td className="p-6 flex items-center gap-4">
                                            <img src={p.image_url} className="w-12 h-12 object-cover rounded-xl border border-pink-100" />
                                            <span className="font-serif text-pink-900">{p.name}</span>
                                        </td>
                                        <td className="p-6"><span className="text-[10px] bg-pink-50 text-pink-500 px-2 py-1 rounded-full font-bold uppercase tracking-tighter">{p.category}</span></td>
                                        <td className="p-6 font-serif text-pink-600 font-bold">${p.price}</td>
                                        <td className="p-6 text-right">
                                            <Button variant="ghost" onClick={() => deleteProd(p.id)} className="text-pink-200 hover:text-red-400 rounded-full">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </div>
            </div>
        </div>
    );
}