'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface TotaisProps {
  atualizar: boolean;
}

interface TotaisPorPessoa {
  pessoaId: number;
  nome: string;
  receita: number;
  despesa: number;
  saldo: number;
}

export default function Totais({ atualizar }: TotaisProps) {
  const [totais, setTotais] = useState<TotaisPorPessoa[]>([]);
  const [receitaTotal, setReceitaTotal] = useState(0);
  const [despesaTotal, setDespesaTotal] = useState(0);
  const [saldoTotal, setSaldoTotal] = useState(0);

  const fetchTotais = async () => {
    try {
      const response = await axios.get('http://localhost:5275/api/transacoes/totais');
      setTotais(response.data.totaisPorPessoa);
      setReceitaTotal(response.data.receitaTotal);
      setDespesaTotal(response.data.despesaTotal);
      setSaldoTotal(response.data.saldoTotal);
    } catch (error) {
      console.error('Erro ao buscar totais:', error);
    }
  };

  useEffect(() => {
    fetchTotais();
  }, [atualizar]);

  return (
    <div>
      <h2>Totais por Pessoa</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Receita</th>
            <th>Despesa</th>
            <th>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {totais.map((t) => (
            <tr key={t.pessoaId}>
              <td>{t.nome}</td>
              <td>{t.receita.toFixed(2)}</td>
              <td>{t.despesa.toFixed(2)}</td>
              <td>{t.saldo.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Totais Gerais</h3>
      <p><strong>Receita Total:</strong> R$ {receitaTotal.toFixed(2)}</p>
      <p><strong>Despesa Total:</strong> R$ {despesaTotal.toFixed(2)}</p>
      <p><strong>Saldo Total:</strong> R$ {saldoTotal.toFixed(2)}</p>
    </div>
  );
}
