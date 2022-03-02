using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using Microsoft.AspNetCore.Authorization;
using wbs_rest_aspnet.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using wbs_rest_aspnet.InterfaceAdapters.Dtos;

namespace wbs_rest_aspnet.Controllers;


[ApiController]
[Route("api/v1/clients")]
public class ClientController : ControllerBase
{
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

    [HttpGet("{id:int}")]
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
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(OutputClientDto))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
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

                // model.UsersClients.Add(userClient);
                context.UsersClients.Add(userClient);

                context.SaveChanges();
            }
        }

        OutputClientDto result = new OutputClientDto() { ClientId = model.ClientId, Name = model.Name, Vat = model.Vat };

        return CreatedAtAction(nameof(Create), new { id = model.ClientId }, result);
    }

    [HttpDelete("{id:int}")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult Delete(int id)
    {
        var client = context.Clients.FirstOrDefault(client => client.ClientId == id);

        if (client == null)
        {
            return NotFound();
        }

        context.Clients.Remove(client);

        context.SaveChanges();

        return Ok();
    }

    [HttpPut("{id:int}/users/{userId:int}")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult CreateLinkedUser(int id, int userId)
    {
        var client = context.Clients.Include(rel => rel.UsersClients).FirstOrDefault(client => client.ClientId == id);

        if (client == null)
        {
            return NotFound($"Client not found with id: {id}");
        }

        Persistence.Models.UsersClients? relation = client.UsersClients.FirstOrDefault(rel => rel.ClientId == id && rel.UserId == userId);

        if (relation != null)
        {
            return BadRequest();
        }

        var user = context.Users.FirstOrDefault(user => user.UserId == userId);

        if (user == null)
        {
            return NotFound($"User not found with id: {userId}");
        }

        client.UsersClients.Add(new Persistence.Models.UsersClients { ClientId = id, UserId = userId });

        context.SaveChanges();

        return CreatedAtAction(nameof(CreateLinkedUser), new { clientId = id, userId = userId });
    }

    [HttpDelete("{id:int}/users/{userId:int}")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult DeleteLinkedUser(int id, int userId)
    {
        var client = context.Clients.Include(rel => rel.UsersClients).FirstOrDefault(client => client.ClientId == id);

        if (client == null)
        {
            return NotFound($"Client not found with id: {id}");
        }

        Persistence.Models.UsersClients? relation = client.UsersClients.FirstOrDefault(rel => rel.ClientId == id && rel.UserId == userId);

        if (relation == null)
        {
            return BadRequest();
        }

        var user = context.Users.FirstOrDefault(user => user.UserId == userId);

        if (user == null)
        {
            return NotFound($"User not found with id: {userId}");
        }

        client.UsersClients.Remove(relation);

        context.SaveChanges();

        return CreatedAtAction(nameof(DeleteLinkedUser), new { clientId = id, userId = userId });
    }

    [HttpPut("{id:int}/projects/{projectId:int}")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult CreateLinkedProject(int id, int projectId)
    {
        var client = context.Clients.Include(rel => rel.Projects).FirstOrDefault(client => client.ClientId == id);

        if (client == null)
        {
            return NotFound($"Client not found with id: {id}");
        }

        Persistence.Models.Project? projectRel = client.Projects.FirstOrDefault(rel => rel.ProjectId == projectId);

        if (projectRel != null)
        {
            return BadRequest();
        }

        var project = context.Projects.FirstOrDefault(user => user.ProjectId == projectId);

        if (project == null)
        {
            return NotFound($"Project not found with id: {projectId}");
        }

        client.Projects.Add(project);

        context.SaveChanges();

        return CreatedAtAction(nameof(CreateLinkedProject), new { clientId = id, projectId = projectId });
    }

    [HttpDelete("{id:int}/projects/{projectId:int}")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult DeleteLinkedProject(int id, int projectId)
    {
        var client = context.Clients.Include(rel => rel.Projects).FirstOrDefault(client => client.ClientId == id);

        if (client == null)
        {
            return NotFound($"Client not found with id: {id}");
        }

        Persistence.Models.Project? projectRel = client.Projects.FirstOrDefault(rel => rel.ProjectId == projectId);

        if (projectRel == null)
        {
            return BadRequest();
        }

        var project = context.Projects.FirstOrDefault(user => user.ProjectId == projectId);

        if (project == null)
        {
            return NotFound($"Project not found with id: {projectId}");
        }

        client.Projects.Add(project);

        context.SaveChanges();

        return CreatedAtAction(nameof(DeleteLinkedProject), new { clientId = id, projectId = projectId });
    }


}