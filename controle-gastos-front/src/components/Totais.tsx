'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface TotaisPessoa {
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
  totaisPorPessoa: TotaisPessoa[];
}

export default function Totais() {
  const [totais, setTotais] = useState<TotaisData | null>(null);

  const carregarTotais = () => {
    axios.get('http://localhost:5275/api/totais').then((res) => {
      setTotais(res.data);
    });
  };

  useEffect(() => {
    carregarTotais();
  }, []);

  if (!totais) return <div>Carregando totais...</div>;

  return (
    <div>
      <h2>Totais</h2>
      <p>Receita Total: {totais.receitaTotal}</p>
      <p>Despesa Total: {totais.despesaTotal}</p>
      <p>Saldo Total: {totais.saldoTotal}</p>

      <h3>Totais por Pessoa</h3>
      <ul>
        {totais.totaisPorPessoa.map((p) => (
          <li key={p.pessoaId}>
            <strong>{p.nome}</strong> — Receita: {p.receita}, Despesa: {p.despesa}, Saldo: {p.saldo}
          </li>
        ))}
      </ul>
    </div>
  );
}
