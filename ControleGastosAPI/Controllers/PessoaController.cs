using Microsoft.AspNetCore.Mvc;
using ControleGastosAPI.Models;
using ControleGastosAPI.Storage;

namespace ControleGastosAPI.Controllers;

[ApiController]
[Route("api/pessoas")]
public class PessoaController : ControllerBase
{
    [HttpGet]
    public IActionResult Listar()
    {
        return Ok(Dados.Pessoas);
    }

    [HttpPost]
    public IActionResult Criar(Pessoa pessoa)
    {
        pessoa.Id = Dados.ProximoIdPessoa++;
        Dados.Pessoas.Add(pessoa);
        return Ok(pessoa);
    }

    [HttpDelete("{id}")]
    public IActionResult Deletar(int id)
    {
        var pessoa = Dados.Pessoas.FirstOrDefault(p => p.Id == id);
        if (pessoa == null) return NotFound();

        // Remove todas as transações da pessoa
        Dados.Transacoes.RemoveAll(t => t.PessoaId == id);
        Dados.Pessoas.Remove(pessoa);

        return NoContent();
    }
}
