namespace wbs_rest_aspnet.Persistence.Models;

public class RefreshToken
{
    public int Id { get; set; }
    public string TokenHash { get; set; }
    public string TokenSalt { get; set; }
    public DateTime Ts { get; set; }
    public DateTime ExpiryDate { get; set; }
    public virtual User User { get; set; }
    public int UserId { get; set; }
}