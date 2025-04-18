'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: string;
  pessoaId: number;
}

interface Props {
  atualizar: boolean;
}

export default function ResumoTransacoes({ atualizar }: Props) {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);

  const fetchTransacoes = async () => {
    const res = await axios.get('http://localhost:5275/api/transacoes');
    setTransacoes(res.data);
  };

  useEffect(() => {
    fetchTransacoes();
  }, [atualizar]);

  return (
    <div>
      <h2>Resumo Geral</h2>
      <ul>
        {transacoes.map((t) => (
          <li key={t.id}>
            {t.descricao} - R$ {t.valor.toFixed(2)} ({t.tipo}) - Pessoa ID: {t.pessoaId}
          </li>
        ))}
      </ul>
    </div>
  );
}
