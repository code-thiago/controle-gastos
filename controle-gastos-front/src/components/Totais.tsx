'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface TotaisPorPessoa {
  pessoaId: number;
  nome: string;
  receita: number;
  despesa: number;
  saldo: number;
}

interface TotaisData {
  receitaTotal: number;
  despesaTotal: number;
  saldoTotal: number;
  totaisPorPessoa: TotaisPorPessoa[];
}

interface Props {
  atualizar: boolean;
}

export default function Totais({ atualizar }: Props) {
  const [totais, setTotais] = useState<TotaisData | null>(null);

  const carregarTotais = async () => {
    try {
      const res = await axios.get('http://localhost:5275/api/transacoes/totais');
      setTotais(res.data);
    } catch (err) {
      console.error('Erro ao buscar totais:', err);
    }
  };

  useEffect(() => {
    carregarTotais();
  }, [atualizar]);

  if (!totais) return <p>Carregando totais...</p>;

  return (
    <div>
      <h3>Totais por Pessoa</h3>
      <ul>
        {totais.totaisPorPessoa.map((p) => (
          <li key={p.pessoaId}>
            <strong>{p.nome}</strong> — Receita: {p.receita}, Despesa: {p.despesa}, Saldo: {p.saldo}
          </li>
        ))}
      </ul>
      <h4>Totais Gerais</h4>
      <p>Receita Total: {totais.receitaTotal}</p>
      <p>Despesa Total: {totais.despesaTotal}</p>
      <p>Saldo Total: {totais.saldoTotal}</p>
    </div>
  );
}
