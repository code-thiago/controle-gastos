// src/components/TransacaoForm.tsx
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

type Transacao = {
  id: number;
  pessoaId: number;
  tipo: "receita" | "despesa";
  valor: number;
  descricao: string;
};

type Pessoa = {
  id: number;
  nome: string;
};

interface Props {
  onAtualizar: () => void;
}

export default function TransacaoForm({ onAtualizar }: Props) {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [pessoaId, setPessoaId] = useState<number>(0);
  const [tipo, setTipo] = useState<"receita" | "despesa">("despesa");
  const [valor, setValor] = useState<number>(0);
  const [descricao, setDescricao] = useState<string>("");
  const [mensagem, setMensagem] = useState<string | null>(null);

  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [editando, setEditando] = useState<Transacao | null>(null);

  useEffect(() => {
    axios.get("http://localhost:5275/api/pessoas").then(res => setPessoas(res.data));
    axios.get("http://localhost:5275/api/transacoes").then(res => setTransacoes(res.data));
  }, []);

  const carregarTransacoes = () => {
    axios.get("http://localhost:5275/api/transacoes").then(res => setTransacoes(res.data));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (valor <= 0) {
      setMensagem("O valor deve ser maior que 0.");
      return;
    }

    const payload = { pessoaId, tipo, valor, descricao };

    try {
      if (editando) {
        await axios.put(`http://localhost:5275/api/transacoes/${editando.id}`, payload);
        setMensagem("Transação atualizada com sucesso.");
      } else {
        const res = await axios.post("http://localhost:5275/api/transacoes", payload);
        setMensagem("Transação registrada com sucesso.");
      }

      setPessoaId(0);
      setTipo("despesa");
      setValor(0);
      setDescricao("");
      setEditando(null);
      carregarTransacoes();
      onAtualizar();
    } catch (err: any) {
      setMensagem(err.response?.data || "Erro ao registrar transação.");
    }
  };

  const handleEditar = (transacao: Transacao) => {
    setEditando(transacao);
    setPessoaId(transacao.pessoaId);
    setTipo(transacao.tipo);
    setValor(transacao.valor);
    setDescricao(transacao.descricao);
    setMensagem(null);
  };

  const handleRemover = async (id: number) => {
    if (confirm("Tem certeza que deseja remover esta transação?")) {
      await axios.delete(`http://localhost:5275/api/transacoes/${id}`);
      setMensagem("Transação removida.");
      carregarTransacoes();
      onAtualizar();
    }
  };

  return (
    <div>
      <h2>{editando ? "Editar Transação" : "Nova Transação"}</h2>

      {mensagem && <p style={{ color: "red" }}>{mensagem}</p>}

      <form onSubmit={handleSubmit}>
        <label>Pessoa:</label>
        <select value={pessoaId} onChange={e => setPessoaId(Number(e.target.value))} required>
          <option value={0}>Selecione</option>
          {pessoas.map(p => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>

        <label>Tipo:</label>
        <select value={tipo} onChange={e => setTipo(e.target.value as "receita" | "despesa")}>
          <option value="despesa">Despesa</option>
          <option value="receita">Receita</option>
        </select>

        <label>Valor:</label>
        <input
          type="number"
          value={isNaN(valor) ? "" : valor}
          onChange={e => setValor(parseFloat(e.target.value))}
          required
        />

        <label>Descrição:</label>
        <input
          type="text"
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          required
        />

        <button type="submit">{editando ? "Salvar" : "Adicionar"}</button>
        {editando && (
          <button type="button" onClick={() => {
            setEditando(null);
            setPessoaId(0);
            setTipo("despesa");
            setValor(0);
            setDescricao("");
          }}>Cancelar</button>
        )}
      </form>

      <h3>Transações</h3>
      <ul>
        {transacoes.map(t => (
          <li key={t.id}>
            {pessoas.find(p => p.id === t.pessoaId)?.nome || "Desconhecido"} - {t.tipo} - R$ {t.valor.toFixed(2)} - {t.descricao}
            <button onClick={() => handleEditar(t)}>Editar</button>
            <button onClick={() => handleRemover(t.id)}>Remover</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
