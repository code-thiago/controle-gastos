'use client';

import PessoaForm from '@/components/PessoaForm';
import TransacaoForm from '@/components/TransacaoForm';
import Totais from '@/components/Totais';
import { useState } from 'react';

export default function Home() {
  const [atualizar, setAtualizar] = useState(false);

  const forcarAtualizacao = () => {
    setAtualizar(prev => !prev);
  };

  return (
    <main>
      <PessoaForm onAtualizar={forcarAtualizacao} />
      <TransacaoForm onAtualizar={forcarAtualizacao} />
      <Totais atualizar={atualizar} />
    </main>
  );
}
