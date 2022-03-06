using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Mime;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using wbs_rest_aspnet.Persistence.Context;
using wbs_rest_aspnet.InterfaceAdapters.Dtos.Requests;
using wbs_rest_aspnet.Application.Services.Interfaces;

namespace wbs_rest_aspnet.Controllers;

[ApiController]
// [Route("api/v1/auth")]
public class AuthController : ControllerBase
{
    private WbsContext context;
    private IConfiguration config;
    private IAuthService authService;

    public AuthController(WbsContext context, IConfiguration config, IAuthService authService)
    {
        this.context = context;
        this.config = config;
        this.authService = authService;
    }

    [AllowAnonymous]
    [HttpPost("api/v1/auth/signin")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult Signin([FromBody] LoginDto input)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var authResult = authService.Signin(input);

        if (!authResult.Success)
        {
            UnprocessableEntity();
        }

        Response.Headers.Add("X-Authorization-Token", authResult.AccessToken);
        Response.Headers.Add("X-Authorization-RefreshToken", authResult.RefreshToken);

        return Ok(authResult);
    }

    [AllowAnonymous]
    [HttpPost("api/v1/auth/refresh_token")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult Refresh([FromBody] RefreshDto input)
    {
        if (!ModelState.IsValid || Request.Headers["X-Authorization-RefreshToken"] == "")
        {
            return BadRequest();
        }

        var authResult = authService.Refresh(input);

        // if (!authResult.Success)
        // {
        //     UnprocessableEntity();
        // }

        // Response.Headers.Add("X-Authorization-Token", authResult.AccessToken);
        // Response.Headers.Add("X-Authorization-RefreshToken", authResult.RefreshToken);

        return Ok(authResult);
    }

    [AllowAnonymous]
    [HttpPost("api/v1/auth/signup")]
    public IActionResult Signup([FromBody] SignupDto input)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var authResult = authService.Signup(input);

        if (!authResult.Success)
        {
            UnprocessableEntity();
        }

        Response.Headers.Add("X-Authorization-Token", authResult.AccessToken);
        Response.Headers.Add("X-Authorization-RefreshToken", authResult.RefreshToken);

        return Ok(authResult);
    }
}