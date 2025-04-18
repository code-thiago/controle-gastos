using Microsoft.AspNetCore.Mvc;
using ControleGastosAPI.Models;
using ControleGastosAPI.Storage;

namespace ControleGastosAPI.Controllers;

[ApiController]
[Route("api/transacoes")]
public class TransacaoController : ControllerBase
{
    [HttpGet]
    public IActionResult Listar()
    {
        return Ok(Dados.Transacoes);
    }

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
}
