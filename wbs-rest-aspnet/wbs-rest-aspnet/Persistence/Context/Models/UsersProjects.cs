namespace wbs_rest_aspnet.Persistence.Models;

public class UsersProjects
{
    // public int UserClientId { get; set; }
    public int UserId { get; set; }
    public virtual User User { get; set; }
    public int ProjectId { get; set; }
    public virtual Project Project { get; set; }
}