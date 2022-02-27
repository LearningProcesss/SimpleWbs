using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using wbs_rest_aspnet.Application.Services.Interfaces;
using wbs_rest_aspnet.Persistence.Context;
using wbs_rest_aspnet.InterfaceAdapters.Dtos;

namespace wbs_rest_aspnet.Controllers;

[ApiController]
[Route("api/v1/users")]
public class UserController : ControllerBase
{
    private WbsContext context;

    public UserController(WbsContext context)
    {
        this.context = context;
    }

    [HttpGet(Name = "GetAllUsers")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<OutputUserDto>))]
    public IActionResult GetAll()
    {
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
        var model = context.Users.Include(rel => rel.UsersClients).FirstOrDefault(user => user.UserId == id);

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
            Clients = model.UsersClients.Select(rel => rel.ClientId)
        };

        return Ok(user);
    }

    [HttpGet("{id:int}/linkedClients", Name = "GetLinkedClientsFromUser")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(OutputUserDto))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetLinkedClients(int id)
    {
        var model = context.Users.Include(rel => rel.UsersClients).FirstOrDefault(user => user.UserId == id);

        if (model == null)
        {
            return NotFound();
        }

        return Ok(new { UserId = model.UserId, Clients = model.UsersClients.Select(rel => rel.ClientId) });
    }

    [HttpGet("{id:int}/linkedProjects", Name = "GetLinkedProjectFromUser")]
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

        Persistence.Models.User model = new Persistence.Models.User()
        {
            Name = input.Name!,
            Surname = input.Surname!,
            Email = input.Email!
        };

        context.Users.Add(model);

        context.SaveChanges();

        OutputUserDto result = new OutputUserDto()
        {
            UserId = model.UserId,
            Name = model.Name,
            Surname = model.Surname,
            Email = model.Email
        };

        return CreatedAtAction(nameof(Create), new { id = model.UserId }, result);
    }


}