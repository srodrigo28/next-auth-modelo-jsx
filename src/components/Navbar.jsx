'use client';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <a href="/" className="text-white text-lg font-bold">MyApp</a>
        <div>
          <a href="/dashboard" className="text-white mr-4">Dashboard</a>
          <button onClick={handleLogout} className="text-white">Logout</button>
        </div>
      </div>
    </nav>
  );
}