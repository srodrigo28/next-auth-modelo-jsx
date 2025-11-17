'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { 
  UserIcon, 
  EnvelopeIcon, 
  DevicePhoneMobileIcon, 
  LockClosedIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline';

// FUNÇÃO DE MÁSCARA BRASILEIRA (a mesma que você já aprovou antes)
const formatPhoneMask = (value) => {
  if (!value) return '';
  const digits = value.replace(/\D/g, '').slice(0, 11); // limita em 11 dígitos

  if (digits.length <= 2) {
    return `(${digits}`;
  } else if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  } else if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
  } else {
    return `(${digits.slice(0, 2)}) ${digits[2]} ${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  }
};

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState(''); // valor com máscara
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneMask(e.target.value);
    setTelefone(formatted);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!nome || !email || !password) {
      setError('Preencha todos os campos obrigatórios');
      setLoading(false);
      return;
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const cleanPhone = telefone.replace(/\D/g, ''); // remove tudo que não é número

      const { error: profileError } = await supabase
        .from('conta_perfil')
        .insert([
          { 
            id: data.user.id, 
            nome, 
            email, 
            telefone: cleanPhone || null
          }
        ]);

      if (profileError) {
        setError('Erro ao salvar perfil: ' + profileError.message);
        setLoading(false);
      } else {
        router.push('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d12] text-gray-100 flex items-center justify-center relative overflow-hidden">

      {/* GRADIENTES ANIMADOS DE FUNDO */}
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
            Crie sua conta
          </h1>
          <p className="text-gray-400 mt-3 text-lg">
            É rápido e fácil!
          </p>
        </motion.div>

        {/* CARD DE CADASTRO */}
        <motion.form
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          onSubmit={handleRegister}
          className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500"
        >

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-center mb-5 bg-red-500/10 py-3 rounded-xl border border-red-500/30 text-sm"
            >
              {error}
            </motion.p>
          )}

          {/* Nome */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 block mb-2">Nome completo</label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all"
                placeholder="Seu nome completo"
              />
            </div>
          </div>

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

          {/* TELEFONE COM MÁSCARA BRASILEIRA */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 block mb-2">Telefone (opcional)</label>
            <div className="relative">
              <DevicePhoneMobileIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
              <input
                type="text"
                value={telefone}
                onChange={handlePhoneChange}
                maxLength="16"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all"
                placeholder="(62) 9 9999-9999"
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
                minLength="6"
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>

          {/* Botão Cadastrar */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-600/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </motion.button>

          <p className="text-center text-gray-400 mt-6 text-sm">
            Já tem uma conta?{' '}
            <a href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition">
              Faça login aqui
            </a>
          </p>
        </motion.form>
      </div>
    </div>
  );
}