'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { EnvelopeIcon, LockClosedIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d12] text-gray-100 flex items-center justify-center relative overflow-hidden">

      {/* GRADIENTES ANIMADOS DE FUNDO - IGUAIS AO DASHBOARD */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,#4f46e5,transparent_60%)] opacity-30" />
      <div className="absolute inset-0 -z-10 animate-pulse bg-[radial-gradient(circle_at_80%_80%,#9333ea,transparent_70%)] opacity-30" />

      <div className="w-full max-w-md px-6">

        {/* TÍTULO ANIMADO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="inline-block mb-5"
          >
            <UserCircleIcon className="h-16 w-16 mx-auto text-indigo-400" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-md">
            Bem-vindo de volta
          </h1>
          <p className="text-gray-400 mt-3 text-lg">
            Faça login para continuar
          </p>
        </motion.div>

        {/* CARD DE LOGIN COM GLASSMORPHISM */}
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          onSubmit={handleLogin}
          className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500"
        >

          {/* Mensagem de erro */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-center mb-5 bg-red-500/10 py-3 rounded-xl border border-red-500/30 text-sm"
            >
              {error}
            </motion.p>
          )}

          {/* Email */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 block mb-2">Email</label>
            <div className="relative">
              <EnvelopeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          {/* Senha */}
          <div className="mb-8">
            <label className="text-sm text-gray-400 block mb-2">Senha</label>
            <div className="relative">
              <LockClosedIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Botão Entrar */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-600/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </motion.button>

          {/* Link para cadastro */}
          <p className="text-center text-gray-400 mt-6 text-sm">
            Ainda não tem conta?{' '}
            <a href="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
              Cadastre-se aqui
            </a>
          </p>
        </motion.form>
      </div>
    </div>
  );
}