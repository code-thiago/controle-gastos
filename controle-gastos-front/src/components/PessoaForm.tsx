'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Pessoa {
  id: number;
  nome: string;
  idade: number;
}

export default function Pessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState(0);

  const carregarPessoas = () => {
    axios.get('http://localhost:5275/api/pessoas').then((res) => {
      setPessoas(res.data);
    });
  };

  useEffect(() => {
    carregarPessoas();
  }, []);

  const adicionarPessoa = () => {
    axios
      .post('http://localhost:5275/api/pessoas', { nome, idade })
      .then(() => {
        setNome('');
        setIdade(0);
        carregarPessoas(); // Atualiza lista
      });
  };

  return (
    <div>
      <h2>Pessoas</h2>
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
      <button onClick={adicionarPessoa}>Adicionar</button>

      <ul>
        {pessoas.map((p) => (
          <li key={p.id}>
            {p.nome} ({p.idade} anos)
          </li>
        ))}
      </ul>
    </div>
  );
}
