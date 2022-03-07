using System.ComponentModel.DataAnnotations;

namespace wbs_rest_aspnet.InterfaceAdapters.Dtos;

public class InputUserDtoPut
{
    public string? Name { get; set; }
    public string? Surname { get; set; }
    public string? Email { get; set; }
}