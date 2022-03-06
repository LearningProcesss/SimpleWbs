using System.ComponentModel.DataAnnotations;

namespace wbs_rest_aspnet.InterfaceAdapters.Dtos.Requests;

public class ApproveDocumentDto
{

    [Required]
    public bool IsApproved { get; set; }
}