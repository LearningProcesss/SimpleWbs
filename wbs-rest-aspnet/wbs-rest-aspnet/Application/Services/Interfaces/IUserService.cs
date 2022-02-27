namespace wbs_rest_aspnet.Application.Services.Interfaces;

using wbs_rest_aspnet.Application.Services.Dto;

public interface IUserService
{
    IEnumerable<UserDto> GetAll();
}