using System.ComponentModel.DataAnnotations;

namespace wbs_rest_aspnet.InterfaceAdapters.Dtos.Requests;

public class SignupDto
{
    [Required]
    public string Name { get; set; }
    [Required]
    public string Surname { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    [Required]
    public string Password { get; set; }
}