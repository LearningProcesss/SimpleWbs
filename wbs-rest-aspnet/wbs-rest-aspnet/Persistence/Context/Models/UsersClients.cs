namespace wbs_rest_aspnet.Persistence.Models;

public class UsersClients
{
    // public int UserClientId { get; set; }
    public int UserId { get; set; }
    public virtual User User { get; set; }
    public int ClientId { get; set; }
    public virtual Client Client { get; set; }
}