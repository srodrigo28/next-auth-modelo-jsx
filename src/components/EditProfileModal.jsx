import { useState, Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  ArrowPathIcon,
  UserIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import { supabase } from "../lib/supabase";
import { motion } from "framer-motion";

// --- Máscara de Telefone ---
const applyPhoneMask = (value) => {
  if (!value) return "";
  let raw = value.replace(/\D/g, "");
  raw = raw.substring(0, 11);

  let masked = "";

  if (raw.length > 0) masked += "(" + raw.substring(0, 2);
  if (raw.length >= 3) masked += ") " + raw.substring(2, 3);
  if (raw.length >= 4) masked += " " + raw.substring(3, 7);
  if (raw.length >= 8) masked += "-" + raw.substring(7, 11);

  return masked;
};

export default function EditProfileModal({
  isOpen,
  onClose,
  currentProfile,
  onSave,
}) {
  const [formData, setFormData] = useState(currentProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...currentProfile,
        telefone: applyPhoneMask(currentProfile?.telefone),
      });
      setError(null);
    }
  }, [isOpen, currentProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "telefone") {
      setFormData({ ...formData, telefone: applyPhoneMask(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const rawTelefone = formData.telefone
      ? formData.telefone.replace(/\D/g, "")
      : null;

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setError("Sessão expirada. Faça login novamente.");
      setIsSaving(false);
      return;
    }

    try {
      const updates = {
        nome: formData.nome,
        telefone: rawTelefone,
      };

      const { data, error } = await supabase
        .from("conta_perfil")
        .update(updates)
        .eq("id", session.user.id)
        .select()
        .single();

      if (error) setError(error.message);
      else onSave(data);
    } catch {
      setError("Falha ao conectar com o servidor.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[9999]"
        onClose={() => (!isSaving ? onClose() : null)}
      >
        {/* BACKDROP ANIMADO */}
        <Transition.Child
          as={Fragment}
          enter="duration-300 ease-out"
          enterFrom="opacity-0 backdrop-blur-0"
          enterTo="opacity-100 backdrop-blur-sm"
          leave="duration-200 ease-in"
          leaveFrom="opacity-100 backdrop-blur-sm"
          leaveTo="opacity-0 backdrop-blur-0"
        >
          <div className="fixed inset-0 bg-black/70" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-6 text-center">

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-90 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-90 translate-y-4"
            >

              {/* PAINEL GLASS ANIMADO */}
              <Dialog.Panel
                as={motion.div}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="
                  relative w-full max-w-xl overflow-hidden
                  rounded-3xl shadow-2xl border border-white/10
                  bg-white/10 backdrop-blur-2xl
                  text-left p-8
                "
              >
                {/* GLOW AROUND */}
                <div className="absolute inset-0 pointer-events-none rounded-3xl border border-white/20 shadow-[0_0_40px_rgba(99,102,241,0.4)]" />

                {/* HEADER */}
                <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/10">
                  <div className="flex items-center space-x-3">
                    <UserIcon className="h-8 w-8 text-indigo-300" />
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-bold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent drop-shadow"
                    >
                      Editar Perfil
                    </Dialog.Title>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={isSaving}
                    onClick={onClose}
                    className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </motion.button>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="space-y-7">
                  
                  {error && (
                    <div className="bg-red-500/20 text-red-300 p-3 rounded-lg border border-red-400/20 text-sm">
                      {error}
                    </div>
                  )}

                  {/* INPUT NOME */}
                  <div className="relative">
                    <input
                      type="text"
                      name="nome"
                      value={formData?.nome || ""}
                      onChange={handleChange}
                      disabled={isSaving}
                      className="
                        peer w-full bg-transparent border-b-2 border-white/20
                        text-white text-lg py-3 px-1
                        focus:outline-none focus:border-indigo-400
                        transition
                      "
                      placeholder=" "
                    />
                    <label
                      className="
                        absolute text-gray-300 text-sm 
                        top-3 left-1 transition-all
                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                        peer-placeholder-shown:text-gray-400
                        peer-focus:text-indigo-300 peer-focus:text-sm 
                        peer-focus:-top-3
                      "
                    >
                      Nome completo
                    </label>
                  </div>

                  {/* INPUT TELEFONE */}
                  <div className="relative">
                    <input
                      type="text"
                      name="telefone"
                      value={formData?.telefone || ""}
                      onChange={handleChange}
                      disabled={isSaving}
                      maxLength={15}
                      className="
                        peer w-full bg-transparent border-b-2 border-white/20
                        text-white text-lg py-3 px-1
                        focus:outline-none focus:border-indigo-400
                        transition
                      "
                      placeholder=" "
                    />
                    <label
                      className="
                        absolute text-gray-300 text-sm 
                        top-3 left-1 transition-all
                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                        peer-placeholder-shown:text-gray-400
                        peer-focus:text-indigo-300 peer-focus:text-sm 
                        peer-focus:-top-3
                      "
                    >
                      Telefone
                    </label>
                  </div>

                  {/* FOOTER ACTIONS */}
                  <div className="pt-6 flex justify-end space-x-3 border-t border-white/10">

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      disabled={isSaving}
                      onClick={onClose}
                      className="
                        px-5 py-2 rounded-xl
                        bg-white/10 text-gray-200
                        border border-white/20
                        hover:bg-white/20
                        transition
                      "
                    >
                      Cancelar
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.92 }}
                      type="submit"
                      disabled={isSaving}
                      className="
                        px-6 py-2 rounded-xl flex items-center gap-2
                        bg-indigo-500/80 hover:bg-indigo-500
                        text-white font-semibold
                        shadow-[0_0_20px_rgba(99,102,241,0.5)]
                        transition
                      "
                    >
                      {isSaving && (
                        <ArrowPathIcon className="animate-spin h-5 w-5" />
                      )}
                      {isSaving ? "Salvando..." : "Salvar"}
                    </motion.button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>

          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
