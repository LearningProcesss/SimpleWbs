using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using System.Collections.Generic;
using wbs_rest_aspnet.Application.Services.Interfaces;
using wbs_rest_aspnet.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using wbs_rest_aspnet.InterfaceAdapters.Dtos;

namespace wbs_rest_aspnet.Controllers;

[ApiController]
[Route("api/v1/clients")]
public class ClientController : ControllerBase
{
    // private IUserService userService;
    private WbsContext context;

    public ClientController(WbsContext context)
    {
        this.context = context;
    }


    [HttpGet]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<OutputClientDto>))]
    public IActionResult GetAll()
    {
        var clients = context.Clients.Include(rel => rel.Projects).Include(rel => rel.UsersClients)
        .Select(model => new OutputClientDto 
        { 
            ClientId = model.ClientId,
            Name = model.Name,
            CreateOn = model.CreateOn,
            Vat = model.Vat,
            Users = model.UsersClients.Select(rel => rel.UserId),
            Projects = model.Projects.Select(project => project.ProjectId)
        });

        return Ok(clients);
    }

    [HttpGet("{id}")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(OutputClientDto))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetOneById(int id)
    {
        var client = context.Clients.FirstOrDefault(client => client.ClientId == id);

        if (client == null)
        {
            return NotFound();
        }

        Console.WriteLine($"generated = {Url.Action("GetOneById", "User", new { id = 1 })}");

        OutputClientDto output = new OutputClientDto
        {
            ClientId = client.ClientId,
            Name = client.Name,
            Vat = client.Vat,
            CreateOn = client.CreateOn,
            Users = context.UsersClients.Where(rel => rel.ClientId == client.ClientId).Select(rel => rel.UserId).ToList()
        };

        return Ok(output);
    }

    [HttpPost]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(OutputClientDto))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult Create([FromBody] InputClientDtoPost input)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        Persistence.Models.Client model = new Persistence.Models.Client()
        {
            Name = input.Name!,
            Vat = input.Vat!
        };

        context.Clients.Add(model);

        context.SaveChanges();

        if (input.UsersToBeLinked != null)
        {
            foreach (var userId in input.UsersToBeLinked)
            {
                var user = context.Users.FirstOrDefault(user => user.UserId == userId);

                if (user == null)
                {
                    continue;
                }

                Persistence.Models.UsersClients userClient = new Persistence.Models.UsersClients
                {
                    Client = model,
                    User = user
                };

                context.UsersClients.Add(userClient);

                context.SaveChanges();
            }
        }

        OutputClientDto result = new OutputClientDto() { ClientId = model.ClientId, Name = model.Name, Vat = model.Vat };

        return CreatedAtAction(nameof(Create), new { id = model.ClientId }, result);
    }
}