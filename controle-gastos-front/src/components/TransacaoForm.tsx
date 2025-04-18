'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Pessoa {
  id: number;
  nome: string;
}

export default function Transacoes() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState(0);
  const [tipo, setTipo] = useState('receita');
  const [pessoaId, setPessoaId] = useState(0);

  const carregarPessoas = () => {
    axios.get('http://localhost:5275/api/pessoas').then((res) => {
      setPessoas(res.data);
    });
  };

  useEffect(() => {
    carregarPessoas();
  }, []);

  const adicionarTransacao = () => {
    axios
      .post('http://localhost:5275/api/transacoes', {
        descricao,
        valor,
        tipo,
        pessoaId,
      })
      .then(() => {
        setDescricao('');
        setValor(0);
        setTipo('receita');
        setPessoaId(0);
      });
  };

  return (
    <div>
      <h2>Transações</h2>
      <input
        type="text"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <input
        type="number"
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(Number(e.target.value))}
      />
      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="receita">Receita</option>
        <option value="despesa">Despesa</option>
      </select>
      <select value={pessoaId} onChange={(e) => setPessoaId(Number(e.target.value))}>
        <option value={0}>Selecionar pessoa</option>
        {pessoas.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nome}
          </option>
        ))}
      </select>
      <button onClick={adicionarTransacao}>Adicionar</button>
    </div>
  );
}
