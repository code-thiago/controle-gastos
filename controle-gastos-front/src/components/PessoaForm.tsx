'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Pessoa {
  id: number;
  nome: string;
  idade: number;
}

interface Props {
  onAtualizar: () => void;
}

export default function PessoaForm({ onAtualizar }: Props) {
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState(0);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);

  const carregarPessoas = async () => {
    const response = await axios.get('http://localhost:5275/api/pessoas');
    setPessoas(response.data);
  };

  useEffect(() => {
    carregarPessoas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post('http://localhost:5275/api/pessoas', { nome, idade });
    setNome('');
    setIdade(0);
    carregarPessoas();
    onAtualizar();
  };

  const handleExcluir = async (id: number) => {
    await axios.delete(`http://localhost:5275/api/pessoas/${id}`);
    carregarPessoas();
    onAtualizar();
  };

  return (
    <div>
      <h2>Cadastro de Pessoa</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome:</label>
        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <label>Idade:</label>
        <input type="number" value={idade} onChange={(e) => setIdade(Number(e.target.value))} required />
        <button type="submit">Cadastrar</button>
      </form>

      <ul>
        {pessoas.map((pessoa) => (
          <li key={pessoa.id}>
            {pessoa.nome} - {pessoa.idade} anos
            <button onClick={() => handleExcluir(pessoa.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
