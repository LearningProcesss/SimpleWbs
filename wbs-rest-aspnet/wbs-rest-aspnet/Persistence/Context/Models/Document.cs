namespace wbs_rest_aspnet.Persistence.Models;

public class Document {
    public int DocumentId { get; set; }
    public string FileName { get; set; }
    public string VaultPath { get; set; }
    public bool IsApproved { get; set; }
    public int ApprovedBy { get; set; }
    public int ProjectId { get; set; }
    public Project Project { get; set; }
}