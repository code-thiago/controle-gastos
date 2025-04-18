using Microsoft.AspNetCore.Mvc;
using ControleGastosAPI.Models;
using ControleGastosAPI.Storage;

namespace ControleGastosAPI.Controllers;

[ApiController]
[Route("api/pessoas")]
public class PessoaController : ControllerBase
{
    // GET: api/pessoas
    [HttpGet]
    public IActionResult Listar()
    {
        return Ok(Dados.Pessoas);
    }

    // POST: api/pessoas
    [HttpPost]
    public IActionResult Criar(Pessoa pessoa)
    {
        if (string.IsNullOrWhiteSpace(pessoa.Nome))
        {
            return BadRequest("O nome da pessoa é obrigatório.");
        }

        pessoa.Id = Dados.ProximoIdPessoa++;
        Dados.Pessoas.Add(pessoa);
        return Ok(pessoa);
    }

    // PUT: api/pessoas/{id}
    [HttpPut("{id}")]
    public IActionResult Editar(int id, Pessoa pessoaEditada)
    {
        var pessoaExistente = Dados.Pessoas.FirstOrDefault(p => p.Id == id);
        if (pessoaExistente == null)
        {
            return NotFound($"Pessoa com ID {id} não encontrada.");
        }

        if (string.IsNullOrWhiteSpace(pessoaEditada.Nome))
        {
            return BadRequest("O nome da pessoa é obrigatório.");
        }

        pessoaExistente.Nome = pessoaEditada.Nome;
        return Ok(pessoaExistente);
    }

    // DELETE: api/pessoas/{id}
    [HttpDelete("{id}")]
    public IActionResult Deletar(int id)
    {
        var pessoa = Dados.Pessoas.FirstOrDefault(p => p.Id == id);
        if (pessoa == null)
        {
            return NotFound($"Pessoa com ID {id} não encontrada.");
        }

        // Remove todas as transações da pessoa
        Dados.Transacoes.RemoveAll(t => t.PessoaId == id);
        Dados.Pessoas.Remove(pessoa);

        return Ok($"Pessoa '{pessoa.Nome}' e todas as suas transações foram removidas com sucesso.");
    }
}
