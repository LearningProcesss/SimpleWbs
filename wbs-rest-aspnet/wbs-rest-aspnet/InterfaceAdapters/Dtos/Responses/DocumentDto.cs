namespace wbs_rest_aspnet.InterfaceAdapters.Dtos.Response;

public class DocumentDto
{
    public int DocumentId { get; set; }
    public string? FileName { get; set; }
    public string? VaultPath { get; set; }
    public bool IsApproved { get; set; }
    public int ProjectId { get; set; }
}