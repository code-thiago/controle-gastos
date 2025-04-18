import PessoaForm from '../components/PessoaForm';
import TransacaoForm from '../components/TransacaoForm';
import Totais from '../components/Totais';

export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Controle de Gastos</h1>
      <PessoaForm />
      <hr />
      <TransacaoForm />
      <hr />
      <Totais />
    </main>
  );
}
