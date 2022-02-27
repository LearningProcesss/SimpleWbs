using System.Text.Json.Serialization;

namespace wbs_rest_aspnet.InterfaceAdapters.Dtos;

public class OutputProjectDto
{
    public int ProjectId { get; set; }
    
    public string Name { get; set; }
    
    public DateTime CreateOn { get; set; }
    // public int? CreateBy { get; set; }
    
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public OutputClientDto? Client { get; set; }

    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public IEnumerable<int>? Users { get; set; }
}