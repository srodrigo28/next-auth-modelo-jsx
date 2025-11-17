'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';
import EditProfileModal from '../../components/EditProfileModal';

import { 
  UserCircleIcon, 
  PencilSquareIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon 
} from '@heroicons/react/24/outline';

import { motion } from 'framer-motion';

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const fetchUserProfile = async () => {
    setIsLoading(true);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace('/login');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('conta_perfil')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') setError(error.message);
        else setUserProfile({});
      } else {
        setUserProfile(data);
      }
    } catch {
      setError("Erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

/**
 * Formata um número de telefone brasileiro no padrão:
 * (XX) 9 XXXX-XXXX  → para celulares com 11 dígitos (padrão atual)
 * (XX) XXXX-XXXX    → para fixos com 10 dígitos (caso ainda exista)
 * 
 * Exemplos:
 * 62998579084 → (62) 9 9857-9084
 * 6232334455  → (62) 3233-4455
 * 
 * @param {string} phone - Número de telefone (pode vir com máscara ou não)
 * @returns {string} - Telefone formatado ou string vazia se inválido
 */
function formatPhone(phone) {
  if (!phone) return "";

  // Remove tudo que não for dígito
  const digits = phone.replace(/\D/g, "");

  // Se não tiver dígitos suficientes, retorna vazio
  if (digits.length < 10) return "Número incompleto";

  const ddd = digits.slice(0, 2);
  const isCellphone = digits.length === 11 && digits[2] === "9"; // Celulares têm 11 dígitos e começam com 9 após o DDD

  if (isCellphone) {
    // Formato celular: (62) 9 9857-9084
    const firstPart = digits.slice(2, 7);  // 98579
    const lastPart  = digits.slice(7, 11); // 084 → vira 9084 (11º dígito incluso!)
    return `(${ddd}) 9 ${firstPart}-${lastPart}`;
  } else {
    // Formato fixo ou celular antigo: (62) 3233-4455
    const firstPart = digits.slice(2, 6);  // primeiros 4 dígitos após DDD
    const lastPart  = digits.slice(6, 10); // últimos 4 dígitos
    return `(${ddd}) ${firstPart}-${lastPart}`;
  }
}


  useEffect(() => { fetchUserProfile(); }, [router]);

  const handleProfileUpdate = (updatedProfile) => {
    setUserProfile(updatedProfile);
    setIsModalOpen(false);
  };

  // 💠 LOADING ESTILOSO ANIMADO ------------------------------------------------------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f12] flex flex-col">
        <Navbar />
        <div className="flex flex-grow items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="h-14 w-14 rounded-full border-4 border-indigo-500 border-t-transparent"
          />
        </div>
      </div>
    );
  }

  // 💠 ERRO BONITO -----------------------------------------------------------------
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 to-gray-100 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white/60 backdrop-blur-xl border border-red-300 p-6 rounded-2xl shadow-xl"
          >
            <p className="text-lg font-semibold text-red-600">{error}</p>
          </motion.div>
        </div>
      </div>
    );
  }

  // 💠 DASHBOARD ULTRA MODERNO -----------------------------------------------------
  const nomeUsuario = userProfile?.nome || "Usuário";

  return (
    <div className="min-h-screen bg-[#0d0d12] text-gray-100 flex flex-col">
      <Navbar />

      {/* GRADIENTE ANIMADO DE FUNDO */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,#4f46e5,transparent_60%)] opacity-30" />
      <div className="absolute inset-0 -z-10 animate-pulse bg-[radial-gradient(circle_at_80%_80%,#9333ea,transparent_70%)] opacity-30" />

      <main className="flex-grow container mx-auto px-6 py-10">

        {/* TÍTULO COM ANIMAÇÃO EPICA */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <UserCircleIcon className="h-12 w-12 text-indigo-400" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-md">
              Bem-vindo, {nomeUsuario}!
            </h1>
          </div>

          <p className="text-gray-400 text-lg mt-3">
            Aqui você administra suas informações pessoais.
          </p>
        </motion.header>

        {/* CARD PRINCIPAL */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          <div className="
            bg-white/10 backdrop-blur-xl 
            border border-white/10 
            shadow-2xl 
            rounded-3xl 
            p-8 
            hover:shadow-purple-500/20 
            transition-all duration-500
          ">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-100">
                Informações do Perfil
              </h3>

              {/* Botão editar */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsModalOpen(true)}
                className="
                  flex items-center gap-2
                  px-4 py-2
                  bg-indigo-500/20 
                  text-indigo-300 
                  border border-indigo-500/30 
                  rounded-xl
                  hover:bg-indigo-500/30
                  transition-all
                "
              >
                <PencilSquareIcon className="h-5 w-5" />
                Editar
              </motion.button>
            </div>

            <div className="space-y-6">
              <Info label="Nome Completo" value={userProfile?.nome} />
              <Info label="Email" value={userProfile?.email} icon={<EnvelopeIcon className="h-5 w-5" />} />
              <Info label="Telefone" value={formatPhone(userProfile?.telefone)} icon={<DevicePhoneMobileIcon className="h-5 w-5" />} />
            </div>
          </div>
        </motion.section>
      </main>

      {/* MODAL */}
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentProfile={userProfile}
        onSave={handleProfileUpdate}
      />
    </div>
  );
}

// COMPONENTE DE LINHA DE INFO ----------------------------
function Info({ label, value, icon }) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
    >
      {icon && <div className="text-indigo-300">{icon}</div>}

      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-gray-100">
          {value || "Não informado"}
        </p>
      </div>
    </motion.div>
  );
}
