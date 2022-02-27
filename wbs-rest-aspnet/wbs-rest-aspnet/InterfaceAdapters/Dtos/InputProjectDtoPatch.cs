using System.ComponentModel.DataAnnotations;

namespace wbs_rest_aspnet.InterfaceAdapters.Dtos;

public class InputProjectDtoPatch {

    [Required]
    public string? Name { get; set; }
}