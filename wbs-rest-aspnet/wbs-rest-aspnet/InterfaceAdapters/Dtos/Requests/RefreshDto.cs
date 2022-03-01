using System.ComponentModel.DataAnnotations;

namespace wbs_rest_aspnet.InterfaceAdapters.Dtos.Requests;

public class RefreshDto
{
    [Required]
    public string? RefreshToken { get; set; }
}