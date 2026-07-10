namespace LinkVault.Core.Entities;

public class Tag : BaseEntity
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Color { get; set; }
    public User User { get; set; } = null!;
    public ICollection<LinkTag> LinkTags { get; set; } = new List<LinkTag>();
}
