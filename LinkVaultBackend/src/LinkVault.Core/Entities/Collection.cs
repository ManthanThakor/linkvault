namespace LinkVault.Core.Entities;

public class Collection : BaseEntity
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public User User { get; set; } = null!;
    public ICollection<Link> Links { get; set; } = new List<Link>();
}
