using Microsoft.AspNetCore.Mvc;
using ControleGastosAPI.Storage;

namespace ControleGastosAPI.Controllers;

[ApiController]
[Route("api/totais")]
public class TotaisController : ControllerBase
{
    [HttpGet]
    public IActionResult ObterTotais()
    {
        var resultado = Dados.Pessoas.Select(p => {
            var transacoes = Dados.Transacoes.Where(t => t.PessoaId == p.Id);
            var receitas = transacoes.Where(t => t.Tipo == "receita").Sum(t => t.Valor);
            var despesas = transacoes.Where(t => t.Tipo == "despesa").Sum(t => t.Valor);
            var saldo = receitas - despesas;

            return new {
                Pessoa = p,
                Receita = receitas,
                Despesa = despesas,
                Saldo = saldo
            };
        }).ToList();

        var totalReceita = resultado.Sum(r => r.Receita);
        var totalDespesa = resultado.Sum(r => r.Despesa);
        var saldoLiquido = totalReceita - totalDespesa;

        return Ok(new {
            TotaisPorPessoa = resultado.Select(r => new {
                PessoaId = r.Pessoa.Id,
                Nome = r.Pessoa.Nome,
                Receita = r.Receita,
                Despesa = r.Despesa,
                Saldo = r.Saldo
            }),
            ReceitaTotal = totalReceita,
            DespesaTotal = totalDespesa,
            SaldoTotal = saldoLiquido
        });
    }
}
