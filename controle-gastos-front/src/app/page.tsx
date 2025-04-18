'use client';

import { useState } from 'react';
import PessoaForm from '@/components/PessoaForm';
import TransacaoForm from '@/components/TransacaoForm';
import Totais from '@/components/Totais';
import ResumoTransacoes from '@/components/ResumoTransacoes';

export default function Home() {
  const [atualizar, setAtualizar] = useState(false);

  const forcarAtualizacao = () => {
    setAtualizar(prev => !prev);
  };

  return (
    <div className="container">
      <h1>Controle de Gastos Residenciais</h1>

      <div className="formularios">
        <PessoaForm onAtualizar={forcarAtualizacao} />
        <TransacaoForm onAtualizar={forcarAtualizacao} />
      </div>

      <Totais atualizar={atualizar} />
      <ResumoTransacoes atualizar={atualizar} />
    </div>
  );
}
