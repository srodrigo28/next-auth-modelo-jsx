// components/Navbar.tsx
'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    // 1. Faz logout no Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Erro ao fazer logout:', error);
    } else {
      // 2. Limpa tudo e redireciona pro login
      router.push('/login');
      router.refresh(); // Força o Next.js a recarregar a sessão
    }
  };

  return (
    <nav className="bg-black/30 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          Meu App
        </h2>

        <div className="flex items-center gap-6">
          {/* Avatar do usuário */}
          <div className="flex items-center gap-3">
            <UserCircleIcon className="h-8 w-8 text-indigo-400" />
            <span className="text-gray-300 hidden sm:block">Minha Conta</span>
          </div>

          {/* BOTÃO DE LOGOUT */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/30 transition-all"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Sair
          </motion.button>
        </div>
      </div>
    </nav>
  );
}