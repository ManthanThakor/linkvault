namespace LinkVault.Core.Entities;

public class Category : BaseEntity
{
    public Guid UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public User User { get; set; } = null!;
    public ICollection<Link> Links { get; set; } = new List<Link>();
}
