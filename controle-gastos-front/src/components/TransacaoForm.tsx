'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Props {
  onAtualizar: () => void;
}

interface Pessoa {
  id: number;
  nome: string;
}

export default function TransacaoForm({ onAtualizar }: Props) {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [pessoaId, setPessoaId] = useState<number>(0);
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('receita');
  const [valor, setValor] = useState<number>(0);
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    axios.get<Pessoa[]>('http://localhost:5275/api/pessoas')
      .then(res => {
        setPessoas(res.data);
        if (res.data.length > 0) setPessoaId(res.data[0].id);
      })
      .catch(err => console.error('Erro ao carregar pessoas:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5275/api/transacoes', {
        pessoaId,
        tipo,
        valor,
        descricao
      });
      setValor(0);
      setDescricao('');
      onAtualizar();
    } catch (err) {
      console.error('Erro ao registrar transação:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Registrar Transação</h3>
      <select value={pessoaId} onChange={(e) => setPessoaId(Number(e.target.value))}>
        {pessoas.map((p) => (
          <option key={p.id} value={p.id}>{p.nome}</option>
        ))}
      </select>
      <select value={tipo} onChange={(e) => setTipo(e.target.value as 'receita' | 'despesa')}>
        <option value="receita">Receita</option>
        <option value="despesa">Despesa</option>
      </select>
      <input type="number" value={valor} onChange={(e) => setValor(Number(e.target.value))} placeholder="Valor" required />
      <input value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição" required />
      <button type="submit">Registrar</button>
    </form>
  );
}
