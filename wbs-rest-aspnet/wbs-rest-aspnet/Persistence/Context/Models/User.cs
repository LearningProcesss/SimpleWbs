namespace wbs_rest_aspnet.Persistence.Models;

public class User
{
    public int UserId { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string PasswordSalt { get; set; }
    public DateTime CreateOn { get; set; }
    public int? CreateBy { get; set; }
    public virtual ICollection<UsersClients> UsersClients {get; set;}
    public virtual ICollection<UsersProjects> UsersProjects { get; set; }
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; }

}