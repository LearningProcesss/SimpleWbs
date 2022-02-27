using System.ComponentModel.DataAnnotations;

namespace wbs_rest_aspnet.InterfaceAdapters.Dtos;

public class InputClientDtoPost
{
    [Required]
    public string? Name { get; set; }
    [Required]
    public string? Vat { get; set; }
    // public IEnumerable<int>? ProjectsToBeLinked{ get; set; }
    public IEnumerable<int>? UsersToBeLinked { get; set; }

}