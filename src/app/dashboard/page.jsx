'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import Navbar from '../../components/Navbar';

export default function Dashboard() {
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('conta_perfil')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setUserProfile(data);
      }
    };

    fetchUserProfile();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto p-4">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto p-4">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Bem-vindo, {userProfile.nome || 'Usuário'}!</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p><strong>Nome:</strong> {userProfile.nome || 'Não informado'}</p>
          <p><strong>Email:</strong> {userProfile.email || 'Não informado'}</p>
          <p><strong>Telefone:</strong> {userProfile.telefone || 'Não informado'}</p>
        </div>
      </div>
    </div>
  );
}