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
        var projects = context.Projects.Include(rel => rel.Client).Include(rel => rel.UsersProjects).Select(model => new OutputProjectDto
        {
            ProjectId = model.ProjectId,
            Name = model.Name,
            CreateOn = model.CreateOn,
            Users = model.UsersProjects.Select(rel => rel.UserId),
            Client = new OutputClientDto { ClientId = model.Client.ClientId }
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
        var model = context.Projects.Include(rel => rel.Client).Include(rel => rel.UsersProjects).FirstOrDefault(project => project.ProjectId == id);

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
            }
        };

        return Ok(project);
    }

    [HttpGet("{id:int}/users", Name = "GetLinkedUsersFromProject")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(OutputProjectDto))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetLinkedUsers(int id)
    {
        var model = context.Projects.Include(rel => rel.UsersProjects).FirstOrDefault(project => project.ProjectId == id);

        if (model == null)
        {
            return NotFound();
        }

        return Ok(new { ProjectId = model.ProjectId, Users = model.UsersProjects.Select(rel => rel.UserId) });
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

        Persistence.Models.Project model = new Persistence.Models.Project()
        {
            Name = input.Name
        };

        context.Projects.Add(model);

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
                    Project = model,
                    User = user
                };

                context.UsersProjects.Add(userProject);

                context.SaveChanges();
            }
        }

        OutputProjectDto result = new OutputProjectDto()
        {
            ProjectId = model.ProjectId,
            Name = model.Name
        };

        return CreatedAtAction(nameof(Create), new { id = model.ProjectId }, result);
    }

    [HttpPut("{id:int}")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(OutputProjectDto))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult PartialProjectUpdate(int id, [FromBody] InputProjectDtoPatch input)
    {
        var project = context.Projects.FirstOrDefault(project => project.ProjectId == id);

        if (project == null)
        {
            return NotFound();
        }

        project.Name = input.Name;

        context.SaveChanges();

        return Ok(project);
    }

    [HttpPut("{id:int}/linkedUsers")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(OutputProjectDto))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult UpdateLinkedUsers(int id, [FromBody] InputProjectUserDtoPatch input)
    {
        var project = context.Projects.Include(rel => rel.UsersProjects).FirstOrDefault(project => project.ProjectId == id);

        if (project == null)
        {
            return NotFound();
        }

        foreach (var userId in input.linkedUsers)
        {
            var user = context.Users.FirstOrDefault(user => user.UserId == userId);

            if (user == null)
            {
                continue;
            }

            var usersProjects = context.UsersProjects.FirstOrDefault(rel => rel.ProjectId == id && rel.UserId == userId);

            if (usersProjects == null)
            {
                usersProjects = new Persistence.Models.UsersProjects
                {
                    Project = project,
                    User = user
                };

                context.UsersProjects.Add(usersProjects);

                context.SaveChanges();
            }
        }

        return Ok(new OutputProjectDto
        {
            ProjectId = project.ProjectId,
            Users = project.UsersProjects.Select(rel => rel.UserId)
        });
    }

    [HttpPut("{id:int}/linkedClient")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(OutputProjectDto))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult UpdateLinkedClient(int id, [FromBody] InputProjectUserDtoPatch input)
    {
        var project = context.Projects.Include(rel => rel.Client).FirstOrDefault(project => project.ProjectId == id);

        if (project == null)
        {
            return NotFound();
        }

        return Ok();
    }    
}