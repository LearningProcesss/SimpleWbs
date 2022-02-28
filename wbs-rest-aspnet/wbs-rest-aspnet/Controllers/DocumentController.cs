using Microsoft.AspNetCore.Mvc;
using System.Net.Mime;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using wbs_rest_aspnet.Persistence.Context;
using wbs_rest_aspnet.InterfaceAdapters.Dtos;
using wbs_rest_aspnet.InterfaceAdapters.Dtos.Request;
using System.IO;

namespace wbs_rest_aspnet.Controllers;

[ApiController]
[Route("api/v1/documents")]
public class DocumentController : ControllerBase
{
    private WbsContext context;
    private IConfiguration config;

    public DocumentController(WbsContext context, IConfiguration config)
    {
        this.context = context;
        this.config = config;
    }

    [HttpGet(Name = "GetAllDocuments")]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<OutputDocumentDto>))]
    public IActionResult GetAll()
    {
        var documents = context.Documents.Include(rel => rel.Project).Select(model => new OutputDocumentDto
        {
            DocumentId = model.DocumentId,
            FileName = model.FileName,
            IsApproved = model.IsApproved,
            ApprovedBy = model.ApprovedBy,
            Project = new OutputProjectDto { ProjectId = model.Project.ProjectId }
        }).ToList();

        return Ok(documents);
    }

    [HttpGet("{id:int}", Name = "GetOneDocumentById")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(OutputDocumentDto))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetOneById(int id)
    {
        var model = context.Documents.Include(rel => rel.Project).FirstOrDefault(document => document.DocumentId == id);

        if (model == null)
        {
            return NotFound();
        }

        var document = new OutputDocumentDto
        {
            DocumentId = model.DocumentId,
            FileName = model.FileName,
            IsApproved = model.IsApproved,
            Project = new OutputProjectDto
            {
                ProjectId = model.Project.ProjectId,
            }
        };

        return Ok(document);
    }

    [HttpPost, DisableRequestSizeLimit]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult Upload(int projectId, IFormFile file)
    {

        var project = context.Projects.FirstOrDefault(project => project.ProjectId == projectId);

        if (project == null)
        {
            return NotFound("No project found with specified id");
        }

        var document = new Persistence.Models.Document
        {
            VaultPath = "",
            FileName = file.FileName,
            ProjectId = projectId,
            IsApproved = false
        };

        context.Documents.Add(document);

        context.SaveChanges();

        string fileWithServerPath = Path.Combine(config["FileServerPath"], $"{document.DocumentId}_{file.FileName}");

        using (var stream = new FileStream(fileWithServerPath, FileMode.Create))
        {
            file.CopyTo(stream);
        }

        document.VaultPath = fileWithServerPath;

        context.SaveChanges();

        return Ok(new { documentId = document.DocumentId });
    }

    [HttpPut("{id:int}/setApprovation")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult SetApprovation(int id, [FromBody] bool approvation)
    {
        var model = context.Documents.FirstOrDefault(document => document.DocumentId == id);

        if (model == null)
        {
            return NotFound();
        }

        model.IsApproved = approvation;

        context.SaveChanges();

        return Ok();
    }

    [HttpDelete("{id:int}")]
    [Consumes(MediaTypeNames.Application.Json)]
    [Produces("application/json")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult Delete(int id)
    {
        var document = context.Documents.FirstOrDefault(document => document.DocumentId == id);

        if (document == null)
        {
            return NotFound();
        }

        context.Documents.Remove(document);

        context.SaveChanges();

        string currentFileWithServerPath = Path.Combine(config["FileServerPath"], $"{document.DocumentId}_{document.FileName}");

        string remFileWithServerPath = Path.Combine(config["FileServerPath"], $"_{document.DocumentId}_{document.FileName}");
        
        System.IO.File.Move(currentFileWithServerPath, remFileWithServerPath);

        return Ok();
    }


}