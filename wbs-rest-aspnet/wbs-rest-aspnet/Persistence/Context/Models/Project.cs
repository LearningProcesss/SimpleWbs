namespace wbs_rest_aspnet.Persistence.Models;

public class Project
{
    public int ProjectId { get; set; }
    public string Name { get; set; }
    public DateTime CreateOn { get; set; }
    public int? CreateBy { get; set; }
    public int? ClientId { get; set; }
    public virtual Client Client { get; set; }
    public virtual ICollection<UsersProjects> UsersProjects { get; set; }
    public virtual ICollection<Document> Documents { get; set; }
}