namespace wbs_rest_aspnet.Application.Services.Dto;

public class UserDto
{
    public int UserId { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Email { get; set; }
    public DateTime CreateOn { get; set; }
    public int? CreateBy { get; set; }
}