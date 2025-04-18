namespace ControleGastosAPI.Models;

public class Transacao
{
    public int Id { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public string Tipo { get; set; } = string.Empty; // "despesa" ou "receita"
    public int PessoaId { get; set; }
}
