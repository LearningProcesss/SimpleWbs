using System.ComponentModel.DataAnnotations;

namespace wbs_rest_aspnet.InterfaceAdapters.Dtos.Requests;

public class CreateDocumentDto
{

    [Required]
    public int? ProjectId { get; set; }
    [DataType(DataType.Upload)]
    public IFormFile? FileUpload { get; set; }
}