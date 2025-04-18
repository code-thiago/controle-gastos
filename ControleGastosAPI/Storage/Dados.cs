using ControleGastosAPI.Models;

namespace ControleGastosAPI.Storage;

public static class Dados
{
    public static List<Pessoa> Pessoas { get; set; } = new();
    public static List<Transacao> Transacoes { get; set; } = new();

    public static int ProximoIdPessoa = 1;
    public static int ProximoIdTransacao = 1;
}
