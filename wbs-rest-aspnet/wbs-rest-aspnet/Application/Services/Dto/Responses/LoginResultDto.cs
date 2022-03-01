namespace wbs_rest_aspnet.Application.Dtos.Responses;

public class LoginResultDto
{
    public bool Success { get; set; }
    public string? AccessToken { get; set; }
    public string? RefreshToken { get; set; }
    public string? Message { get; set; }
}