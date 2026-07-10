namespace LinkVault.Application.DTOs.Link;

public class CreateLinkRequest
{
    public string OriginalUrl { get; set; } = string.Empty;
    public string? CustomAlias { get; set; }
    public string? Title { get; set; }
    public string? Notes { get; set; }
    public Guid? CategoryId { get; set; }
    public Guid? CollectionId { get; set; }
    public string? Password { get; set; }
    public DateTime? ExpiryDate { get; set; }
}
