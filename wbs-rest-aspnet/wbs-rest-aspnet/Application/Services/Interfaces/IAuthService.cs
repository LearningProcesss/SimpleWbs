using wbs_rest_aspnet.InterfaceAdapters.Dtos.Requests;
using wbs_rest_aspnet.Application.Dtos.Responses;

namespace wbs_rest_aspnet.Application.Services.Interfaces;

public interface IAuthService
{
    SignupResultDto Signup(SignupDto input);
    LoginResultDto Signin(LoginDto input);
    RefreshResultDto Refresh(RefreshDto input);
}