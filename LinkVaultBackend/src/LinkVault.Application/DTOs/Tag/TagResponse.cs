namespace LinkVault.Application.DTOs.Tag;

public class TagResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Color { get; set; }
    public int LinkCount { get; set; }
    public DateTime CreatedAt { get; set; }
}
