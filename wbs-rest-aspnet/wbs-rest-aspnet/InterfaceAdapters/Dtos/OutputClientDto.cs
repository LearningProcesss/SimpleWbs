using System.Text.Json.Serialization;

namespace wbs_rest_aspnet.InterfaceAdapters.Dtos;

public class OutputClientDto
{
    public int ClientId { get; set; }
    
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    
    public string? Name { get; set; }
    
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    
    public string? Vat { get; set; }
    // public string? Industry { get; set; }
    public DateTime CreateOn { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IEnumerable<int>? Users { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IEnumerable<int>? Projects { get; set; }
}