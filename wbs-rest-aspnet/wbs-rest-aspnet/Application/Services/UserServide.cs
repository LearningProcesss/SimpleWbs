using wbs_rest_aspnet.Application.Services.Interfaces;
using wbs_rest_aspnet.Persistence.Context;

namespace wbs_rest_aspnet.Application.Services;

public class UserService : IUserService
{
    private WbsContext context;
    public UserService(WbsContext context)
    {
        this.context = context;
    }
}