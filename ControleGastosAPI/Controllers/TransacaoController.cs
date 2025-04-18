using Microsoft.AspNetCore.Mvc;
using ControleGastosAPI.Models;
using ControleGastosAPI.Storage;

namespace ControleGastosAPI.Controllers;

[ApiController]
[Route("api/transacoes")]
public class TransacaoController : ControllerBase
{
    // ✅ Lista todas as transações
    [HttpGet]
    public IActionResult Listar()
    {
        return Ok(Dados.Transacoes);
    }

    // ✅ Cria uma nova transação (com validações)
    [HttpPost]
    public IActionResult Criar(Transacao transacao)
    {
        var pessoa = Dados.Pessoas.FirstOrDefault(p => p.Id == transacao.PessoaId);
        if (pessoa == null)
            return BadRequest("Pessoa não encontrada.");

        if (pessoa.Idade < 18 && transacao.Tipo.ToLower() == "receita")
            return BadRequest("Menores de idade só podem ter despesas.");

        transacao.Id = Dados.ProximoIdTransacao++;
        Dados.Transacoes.Add(transacao);
        return Ok(transacao);
    }

    // ✅ Retorna totais por pessoa e totais gerais
    [HttpGet("totais")]
    public IActionResult ObterTotais()
    {
        var totaisPorPessoa = Dados.Pessoas.Select(pessoa =>
        {
            var transacoesDaPessoa = Dados.Transacoes.Where(t => t.PessoaId == pessoa.Id);
            var receita = transacoesDaPessoa.Where(t => t.Tipo.ToLower() == "receita").Sum(t => t.Valor);
            var despesa = transacoesDaPessoa.Where(t => t.Tipo.ToLower() == "despesa").Sum(t => t.Valor);
            var saldo = receita - despesa;

            return new
            {
                pessoaId = pessoa.Id,
                nome = pessoa.Nome,
                receita,
                despesa,
                saldo
            };
        }).ToList();

        var receitaTotal = totaisPorPessoa.Sum(p => p.receita);
        var despesaTotal = totaisPorPessoa.Sum(p => p.despesa);
        var saldoTotal = receitaTotal - despesaTotal;

        var resultado = new
        {
            totaisPorPessoa,
            receitaTotal,
            despesaTotal,
            saldoTotal
        };

        return Ok(resultado);
    }
}
