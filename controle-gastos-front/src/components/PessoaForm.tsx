'use client';

import { useState } from 'react';
import axios from 'axios';

interface Props {
  onAtualizar: () => void;
}

export default function PessoaForm({ onAtualizar }: Props) {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5275/api/pessoas', { nome, idade });
      setNome('');
      setIdade(0);
      onAtualizar();
    } catch (error) {
      console.error('Erro ao cadastrar pessoa:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Cadastrar Pessoa</h3>
      <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" required />
      <input type="number" value={idade} onChange={(e) => setIdade(Number(e.target.value))} placeholder="Idade" required />
      <button type="submit">Cadastrar</button>
    </form>
  );
}
