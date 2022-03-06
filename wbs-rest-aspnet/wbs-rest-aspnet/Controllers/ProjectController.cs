using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using wbs_rest_aspnet.Persistence.Context;
using wbs_rest_aspnet.InterfaceAdapters.Dtos;

namespace wbs_rest_aspnet.Controllers;

[ApiController]
[Route("api/v1/projects")]
public class ProjectController : ControllerBase
{
    private WbsContext context;

    public ProjectController(WbsContext context)
    {
        this.context = context;
    }

    [HttpGet(Name = "GetAllProjects")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<OutputProjectDto>))]
    public IActionResult GetAll()
    {
        var projects = context.Projects.Include(rel => rel.Client).Include(rel => rel.Documents).Include(rel => rel.UsersProjects).Select(model => new OutputProjectDto
        {
            ProjectId = model.ProjectId,
            Name = model.Name,
            CreateOn = model.CreateOn,
            Users = model.UsersProjects.Select(rel => rel.UserId),
            Client = new OutputClientDto { ClientId = model.Client.ClientId },
            Documents = model.Documents.Select(rel => rel.DocumentId)
        }).ToList();

        return Ok(projects);
    }

    [HttpGet("{id:int}", Name = "GetOneProjectById")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(OutputProjectDto))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetOneById(int id)
    {
        var model = context.Projects.Include(rel => rel.Client).Include(rel => rel.Documents).Include(rel => rel.UsersProjects).FirstOrDefault(project => project.ProjectId == id);

        if (model == null)
        {
            return NotFound();
        }

        var project = new OutputProjectDto
        {
            ProjectId = model.ProjectId,
            Name = model.Name,
            CreateOn = model.CreateOn,
            Users = model.UsersProjects.Select(rel => rel.UserId),
            Client = new OutputClientDto
            {
                ClientId = model.Client.ClientId,
                Name = model.Client.Name,
                CreateOn = model.Client.CreateOn,
            },
            Documents = model.Documents.Select(rel => rel.DocumentId)
        };

        return Ok(project);
    }

    [HttpPost]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(OutputProjectDto))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult Create([FromBody] InputProjectDtoPost input)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        Persistence.Models.Project project = new Persistence.Models.Project()
        {
            Name = input.Name!
        };

        context.Projects.Add(project);

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

                Persistence.Models.UsersProjects userProject = new Persistence.Models.UsersProjects
                {
                    Project = project,
                    User = user
                };

                context.UsersProjects.Add(userProject);

                context.SaveChanges();
            }
        }

        if (input.ClientToBeLinked != null)
        {
            var client = context.Clients.Include(rel => rel.Projects).FirstOrDefault(client => client.ClientId == input.ClientToBeLinked);

            client?.Projects.Add(project);

            context.SaveChanges();

            Console.WriteLine("creato");
        }

        OutputProjectDto result = new OutputProjectDto()
        {
            ProjectId = project.ProjectId,
            Name = project.Name
        };

        return CreatedAtAction(nameof(Create), new { id = project.ProjectId }, result);
    }

    [HttpPut("{id:int}")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult Update(int id, [FromBody] InputProjectDtoPatch input)
    {
        Console.WriteLine($"id: {id}");
        if (!ModelState.IsValid)
        {
            return BadRequest();
        }

        var project = context.Projects.FirstOrDefault(project => project.ProjectId == id);

        if (project == null)
        {
            return NotFound();
        }

        project.Name = input.Name!;

        context.SaveChanges();

        return NoContent();
    }

    [HttpPut("{id:int}/users/{userId:int}")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult CreateLinkedUser(int id, int userId)
    {
        var project = context.Projects.Include(rel => rel.UsersProjects).FirstOrDefault(project => project.ProjectId == id);

        if (project == null)
        {
            return NotFound($"Project not found with id: {id}");
        }

        if (project.UsersProjects.Any(rel => rel.UserId == userId))
        {
            return BadRequest();
        }

        var user = context.Users.FirstOrDefault(user => user.UserId == userId);

        if (user == null)
        {
            return NotFound($"User not found with id: {userId}");
        }

        project.UsersProjects.Add(new Persistence.Models.UsersProjects { ProjectId = id, UserId = userId });

        context.SaveChanges();

        return CreatedAtAction(nameof(CreateLinkedUser), new { projectId = id, userId = userId });
    }

    [HttpDelete("{id:int}/users/{userId:int}")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult DeleteLinkedUser(int id, int userId)
    {
        var project = context.Projects.Include(rel => rel.UsersProjects).FirstOrDefault(project => project.ProjectId == id);

        if (project == null)
        {
            return NotFound($"Project not found with id: {id}");
        }

        if (!project.UsersProjects.Any(rel => rel.UserId == userId))
        {
            return BadRequest();
        }

        var user = context.Users.FirstOrDefault(user => user.UserId == userId);

        if (user == null)
        {
            return NotFound($"User not found with id: {userId}");
        }

        Persistence.Models.UsersProjects relation = project.UsersProjects.First(rel => rel.ProjectId == id && rel.UserId == userId);

        project.UsersProjects.Remove(relation);

        context.SaveChanges();

        return CreatedAtAction(nameof(DeleteLinkedUser), new { projectId = id, userId = userId });
    }

    [HttpPut("{id:int}/documents/{documentId:int}")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult CreateLinkedDocument(int id, int documentId)
    {
        var project = context.Projects.Include(rel => rel.Documents).FirstOrDefault(project => project.ProjectId == id);

        if (project == null)
        {
            return NotFound($"Project not found with id: {id}");
        }

        if (project.Documents.Any(rel => rel.DocumentId == documentId))
        {
            return BadRequest();
        }

        var document = context.Documents.FirstOrDefault(document => document.DocumentId == documentId);

        if (document == null)
        {
            return NotFound($"Document not found with id: {documentId}");
        }

        project.Documents.Add(document);

        context.SaveChanges();

        return CreatedAtAction(nameof(CreateLinkedDocument), new { projectId = id, documentId = documentId });
    }

    [HttpDelete("{id:int}/documents/{documentId:int}")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(OutputProjectDto))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult DeleteLinkedDocument(int id, int documentId)
    {
        var project = context.Projects.Include(rel => rel.Documents).FirstOrDefault(project => project.ProjectId == id);

        if (project == null)
        {
            return NotFound($"Project not found with id: {id}");
        }

        if (!project.Documents.Any(rel => rel.DocumentId == documentId))
        {
            return BadRequest();
        }

        var document = context.Documents.FirstOrDefault(document => document.DocumentId == documentId);

        if (document == null)
        {
            return NotFound($"Document not found with id: {id}");
        }

        project.Documents.Remove(document);

        context.SaveChanges();

        return CreatedAtAction(nameof(DeleteLinkedDocument), new { ptojectId = id, documentId = documentId });
    }

    [HttpDelete("{id:int}")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult Delete(int id)
    {
        var project = context.Projects.FirstOrDefault(project => project.ProjectId == id);

        if (project == null)
        {
            return NotFound();
        }

        context.Projects.Remove(project);

        context.SaveChanges();

        return Ok();
    }


}