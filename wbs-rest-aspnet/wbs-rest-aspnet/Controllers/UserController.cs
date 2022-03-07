using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using wbs_rest_aspnet.Application.Services.Interfaces;
using wbs_rest_aspnet.Persistence.Context;
using wbs_rest_aspnet.InterfaceAdapters.Dtos;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;

namespace wbs_rest_aspnet.Controllers;

// [Authorize]
// [EnableCors]
[ApiController]
[Route("api/v1/users")]
public class UserController : ControllerBase
{
    private WbsContext context;
    private IAuthService authService;

    public UserController(WbsContext context, IAuthService authService)
    {
        this.context = context;
        this.authService = authService;
    }

    [HttpGet(Name = "GetAllUsers")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<OutputUserDto>))]
    public IActionResult GetAll()
    {
        try
        {

            var claimsIdentity = HttpContext.User.Identity as ClaimsIdentity;

            var claim = claimsIdentity?.FindFirst(ClaimTypes.NameIdentifier);

            Console.WriteLine($"GetAll: {(claim != null ? claim.Value : "")} {Request.HttpContext.Request.Method}");
        }
        catch (System.Exception)
        {

            throw;
        }

        var users = context.Users.Include(rel => rel.UsersClients).Include(rel => rel.UsersProjects).Select(model => new OutputUserDto
        {
            UserId = model.UserId,
            Name = model.Name,
            Surname = model.Surname,
            Email = model.Email,
            CreateOn = model.CreateOn,
            Clients = model.UsersClients.Select(rel => rel.ClientId),
            Projects = model.UsersProjects.Select(rel => rel.ProjectId)
        });

        return Ok(users);
    }

    [HttpGet("{id:int}", Name = "GetOneById")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(OutputUserDto))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetOneById(int id)
    {
        var model = context.Users.Include(rel => rel.UsersClients).Include(rel => rel.UsersProjects).FirstOrDefault(user => user.UserId == id);

        if (model == null)
        {
            return NotFound();
        }

        var user = new OutputUserDto
        {
            UserId = model.UserId,
            Name = model.Name,
            Surname = model.Surname,
            Email = model.Email,
            CreateOn = model.CreateOn,
            Clients = model.UsersClients.Select(rel => rel.ClientId),
            Projects = model.UsersProjects.Select(rel => rel.ProjectId)
        };

        return Ok(user);
    }

    [HttpGet("{id:int}/clients", Name = "GetLinkedClientsFromUser")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(OutputUserDto))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetLinkedClients(int id)
    {
        var claimsIdentity = HttpContext.User.Identity as ClaimsIdentity;

        var claim = claimsIdentity.FindFirst(ClaimTypes.NameIdentifier);

        Console.WriteLine($"GetLinkedClients: {(claim != null ? claim.Value : "")}");

        var model = context.Users.Include(rel => rel.UsersClients).FirstOrDefault(user => user.UserId == id);

        if (model == null)
        {
            return NotFound();
        }

        return Ok(new { UserId = model.UserId, Clients = model.UsersClients.Select(rel => rel.ClientId) });
    }

    [HttpGet("{id:int}/projects", Name = "GetLinkedProjectFromUser")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(OutputUserDto))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetLinkedProjects(int id)
    {
        var model = context.Users.Include(rel => rel.UsersProjects).FirstOrDefault(user => user.UserId == id);

        if (model == null)
        {
            return NotFound();
        }

        return Ok(new { UserId = model.UserId, Projects = model.UsersProjects.Select(rel => rel.ProjectId) });
    }

    [HttpPost]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(OutputUserDto))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult Create([FromBody] InputUserDtoPost input)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var signupResponse = authService.Signup(new InterfaceAdapters.Dtos.Requests.SignupDto
        {
            Name = input.Name,
            Surname = input.Surname,
            Email = input.Email,
            Password = input.Password
        });

        OutputUserDto result = new OutputUserDto()
        {
            UserId = signupResponse.UserId,
            UserNameSurname = signupResponse.UserNameSurname
        };

        return CreatedAtAction(nameof(Create), new { id = result.UserId }, result);
    }

    [HttpDelete("{id:int}")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult Delete(int id)
    {
        var user = context.Users.Include(rel => rel.UsersProjects).Include(rel => rel.UsersClients).FirstOrDefault(user => user.UserId == id);

        if (user == null)
        {
            return NotFound();
        }

        context.Users.Remove(user);

        context.SaveChanges();

        return Ok();
    }

    [HttpPut("{id:int}")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult Update(int id, [FromBody] InputUserDtoPut input)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var user = context.Users.FirstOrDefault(user => user.UserId == id);

        if (user == null)
        {
            return NotFound();
        }

        user.Name = input.Name!;
        user.Surname = input.Surname!;
        user.Email = input.Email!;

        context.SaveChanges();

        return NoContent();
    }
}