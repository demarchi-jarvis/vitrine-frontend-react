'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/auth.store';

const schema = z.object({
  assunto: z.string().min(3, 'Assunto obrigatório'),
  mensagem: z.string().min(10, 'Mensagem muito curta'),
});

type FormData = z.infer<typeof schema>;

export default function ContatoPage() {
  const { usuario } = useAuthStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5524999999999';
    const msg = `*Contato via Vitrine do Artesanato*\nRemetente: ${usuario?.nome ?? ''} (${usuario?.email ?? ''})\nAssunto: ${data.assunto}\n\n${data.mensagem}`;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener noreferrer');
    toast.success('Mensagem preparada! Complete o envio via WhatsApp.');
    reset();
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-terracotta-600 text-xs font-medium uppercase tracking-widest mb-2">
            Suporte
          </p>
          <h1 className="font-serif text-wood-900 text-3xl font-semibold mb-2">Contato</h1>
          <p className="text-wood-500 text-sm mb-8">
            Preencha abaixo e enviaremos via WhatsApp para nossa equipe.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Nome"
              value={`${usuario?.nome ?? ''} ${usuario?.sobrenome ?? ''}`.trim()}
              disabled
              hint="Preenchido automaticamente com seu perfil."
            />
            <Input label="Assunto" error={errors.assunto?.message} {...register('assunto')} />
            <div>
              <label className="text-sm font-medium text-wood-800 block mb-1.5">Mensagem</label>
              <textarea
                rows={5}
                className="w-full px-4 py-3 rounded-xl text-sm bg-sand-100 border border-sand-200 focus:outline-none focus:border-terracotta-600 focus:ring-2 focus:ring-terracotta-600/20 transition-all duration-300 resize-none"
                {...register('mensagem')}
              />
              {errors.mensagem && (
                <p className="text-red-600 text-xs mt-1">{errors.mensagem.message}</p>
              )}
            </div>
            <Button type="submit" loading={isSubmitting} className="w-full">
              Enviar via WhatsApp
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
