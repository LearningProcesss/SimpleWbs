using System.ComponentModel.DataAnnotations;

namespace wbs_rest_aspnet.InterfaceAdapters.Dtos;

public class InputProjectDtoPost
{
    [Required]
    public string? Name { get; set; }
    [Required]
    public int? ClientToBeLinked { get; set; }
    public IEnumerable<int>? UsersToBeLinked { get; set; }
}