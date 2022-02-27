using System.ComponentModel.DataAnnotations;

namespace wbs_rest_aspnet.InterfaceAdapters.Dtos;

public class InputProjectUserDtoPatch
{
    [Required]
    public IEnumerable<int>? linkedUsers {get; set; }
}