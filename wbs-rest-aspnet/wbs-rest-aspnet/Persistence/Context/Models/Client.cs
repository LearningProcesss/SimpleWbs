namespace wbs_rest_aspnet.Persistence.Models;

public enum Industry
{
    Manufactoring,
    Engeneering
}

public class Client
{
    public int ClientId { get; set; }
    public string Name { get; set; }
    public string Vat { get; set; }
    public Industry Industry { get; set; }
    public DateTime CreateOn { get; set; }
    public int CreateBy { get; set; }
    public virtual ICollection<UsersClients> UsersClients { get; set; }
    public virtual ICollection<Project> Projects { get; set; }
}