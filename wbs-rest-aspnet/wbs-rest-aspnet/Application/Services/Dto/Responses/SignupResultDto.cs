namespace wbs_rest_aspnet.Application.Dtos.Responses;

public class SignupResultDto {
    public bool Success { get; set; }
    public string? AccessToken { get; set; }
    public string? RefreshToken { get; set; }
    public string? Message { get; set; }
}