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
  const [idade, setIdade] = useState<number | ''>('');
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [editandoPessoaId, setEditandoPessoaId] = useState<number | null>(null);

  // 🔄 Carrega pessoas do back-end
  useEffect(() => {
    carregarPessoas();
  }, []);

  const carregarPessoas = async () => {
    try {
      const response = await axios.get('http://localhost:5275/api/pessoas');
      setPessoas(response.data);
    } catch (error) {
      console.error('Erro ao carregar pessoas:', error);
    }
  };

  // ✅ Cadastra ou atualiza uma pessoa
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || idade === '') return;

    try {
      if (editandoPessoaId !== null) {
        // Editar: deletar e recriar (sem banco, simulação)
        await axios.delete(`http://localhost:5275/api/pessoas/${editandoPessoaId}`);
      }

      await axios.post('http://localhost:5275/api/pessoas', {
        nome,
        idade: Number(idade),
      });

      setNome('');
      setIdade('');
      setEditandoPessoaId(null);
      await carregarPessoas();
      onAtualizar();
    } catch (error) {
      console.error('Erro ao salvar pessoa:', error);
    }
  };

  // 🗑️ Remover pessoa com confirmação
  const handleRemover = async (id: number) => {
    const confirmar = confirm('Deseja realmente remover esta pessoa e todas as suas transações?');
    if (!confirmar) return;

    try {
      await axios.delete(`http://localhost:5275/api/pessoas/${id}`);
      await carregarPessoas();
      onAtualizar();
    } catch (error) {
      console.error('Erro ao remover pessoa:', error);
    }
  };

  // ✏️ Preenche campos para edição
  const iniciarEdicao = (pessoa: Pessoa) => {
    setNome(pessoa.nome);
    setIdade(pessoa.idade);
    setEditandoPessoaId(pessoa.id);
  };

  return (
    <div>
      <h2>{editandoPessoaId ? 'Editar Pessoa' : 'Cadastrar Pessoa'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="number"
          placeholder="Idade"
          value={idade}
          onChange={(e) => setIdade(Number(e.target.value))}
        />
        <button type="submit">{editandoPessoaId ? 'Salvar Alterações' : 'Cadastrar'}</button>
      </form>

      <h3>Pessoas Cadastradas:</h3>
      <ul>
        {pessoas.map((pessoa) => (
          <li key={pessoa.id}>
            {pessoa.nome} ({pessoa.idade} anos)
            <button onClick={() => iniciarEdicao(pessoa)}>Editar</button>
            <button onClick={() => handleRemover(pessoa.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
