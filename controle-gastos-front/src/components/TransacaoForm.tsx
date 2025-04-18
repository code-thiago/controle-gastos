'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface Pessoa {
  id: number;
  nome: string;
}

interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  pessoaId: number;
}

interface Props {
  onAtualizar: () => void;
}

export default function TransacaoForm({ onAtualizar }: Props) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState(0);
  const [tipo, setTipo] = useState<'receita' | 'despesa'>('receita');
  const [pessoaId, setPessoaId] = useState(0);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const carregarDados = async () => {
    const pessoasRes = await axios.get('http://localhost:5275/api/pessoas');
    setPessoas(pessoasRes.data);
    const transacoesRes = await axios.get('http://localhost:5275/api/transacoes');
    setTransacoes(transacoesRes.data);
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const limparFormulario = () => {
    setDescricao('');
    setValor(0);
    setTipo('receita');
    setPessoaId(0);
    setEditandoId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editandoId !== null) {
      await axios.put(`http://localhost:5275/api/transacoes/${editandoId}`, {
        id: editandoId,
        descricao,
        valor,
        tipo,
        pessoaId,
      });
    } else {
      await axios.post('http://localhost:5275/api/transacoes', {
        descricao,
        valor,
        tipo,
        pessoaId,
      });
    }

    await carregarDados();
    limparFormulario();
    onAtualizar();
  };

  const handleEditar = (transacao: Transacao) => {
    setEditandoId(transacao.id);
    setDescricao(transacao.descricao);
    setValor(transacao.valor);
    setTipo(transacao.tipo);
    setPessoaId(transacao.pessoaId);
  };

  const handleExcluir = async (id: number) => {
    await axios.delete(`http://localhost:5275/api/transacoes/${id}`);
    await carregarDados();
    onAtualizar();
  };

  return (
    <div>
      <h2>{editandoId ? 'Editar Transação' : 'Cadastrar Transação'}</h2>
      <form onSubmit={handleSubmit}>
        <label>Descrição:</label>
        <input
          type="text"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />
        <label>Valor:</label>
        <input
          type="number"
          value={valor}
          onChange={(e) => setValor(Number(e.target.value))}
          required
        />
        <label>Tipo:</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value as any)}>
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>
        <label>Pessoa:</label>
        <select value={pessoaId} onChange={(e) => setPessoaId(Number(e.target.value))}>
          <option value={0}>Selecione</option>
          {pessoas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
        <button type="submit">{editandoId ? 'Salvar' : 'Cadastrar'}</button>
        {editandoId && (
          <button type="button" onClick={limparFormulario}>
            Cancelar
          </button>
        )}
      </form>

      <h3>Transações Cadastradas</h3>
      <ul>
        {transacoes.map((t) => (
          <li key={t.id}>
            {t.descricao} - R$ {t.valor.toFixed(2)} ({t.tipo}) - Pessoa ID: {t.pessoaId}
            <button onClick={() => handleEditar(t)}>Editar</button>
            <button onClick={() => handleExcluir(t.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
