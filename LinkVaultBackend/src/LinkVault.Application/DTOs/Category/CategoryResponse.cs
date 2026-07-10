namespace LinkVault.Application.DTOs.Category;

public class CategoryResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int LinkCount { get; set; }
    public DateTime CreatedAt { get; set; }
}
