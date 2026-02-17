"use client"
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PanelAdmin } from '@/components/panelAdmin';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Lock, Mail } from "lucide-react";

export default function AdminPage() {
    const [session, setSession] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Revisar sesión al cargar
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // Escuchar cambios en la sesión
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) alert("Datos incorrectos, intenta de nuevo ✨");
        setLoading(false);
    };

    // Si hay sesión, mostramos el Panel que ya tiene su propia estética
    if (session) {
        return <PanelAdmin />;
    }

    // Si no hay sesión, mostramos el Login Estético
    return (
        <div className="min-h-screen bg-[#fff1f2] flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo / Cabecera del Login */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg shadow-pink-100 mb-4">
                        <Sparkles className="w-8 h-8 text-pink-500" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-pink-900 tracking-tight">
                        POETIZHADAS
                    </h1>
                    <p className="text-pink-400 italic font-serif text-sm">Panel de Control</p>
                </div>

                {/* Tarjeta de Login */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-pink-200/50 border border-pink-50">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-pink-400 font-bold ml-4">
                                Tu Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />
                                <Input
                                    type="email"
                                    placeholder="hola@poetizhadas.com"
                                    className="rounded-full border-pink-100 pl-11 focus:ring-pink-200 h-12"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-pink-400 font-bold ml-4">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="rounded-full border-pink-100 pl-11 focus:ring-pink-200 h-12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full h-12 shadow-lg shadow-pink-200 transition-all active:scale-95 font-medium"
                        >
                            {loading ? "Abriendo puertas..." : "Entrar al Panel"}
                        </Button>
                    </form>
                </div>

                <p className="text-center mt-8 text-pink-300 text-xs font-serif italic">
                    "Donde la magia y la gestión se encuentran"
                </p>
            </div>
        </div>
    );
}