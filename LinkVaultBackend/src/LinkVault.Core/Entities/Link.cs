namespace LinkVault.Core.Entities;

public class Link : BaseEntity
{
    public Guid UserId { get; set; }
    public string OriginalUrl { get; set; } = string.Empty;
    public string ShortCode { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Notes { get; set; }
    public Guid? CategoryId { get; set; }
    public Guid? CollectionId { get; set; }
    public string? PasswordHash { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public bool IsFavorite { get; set; }
    public int ClickCount { get; set; }
    public DateTime? LastClickedAt { get; set; }
    public User User { get; set; } = null!;
    public Category? Category { get; set; }
    public Collection? Collection { get; set; }
    public ICollection<ClickLog> ClickLogs { get; set; } = new List<ClickLog>();
    public ICollection<LinkTag> LinkTags { get; set; } = new List<LinkTag>();
}
