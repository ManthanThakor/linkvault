namespace LinkVault.Application.DTOs.Link;

public class UpdateLinkRequest
{
    public string OriginalUrl { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Notes { get; set; }
    public Guid? CategoryId { get; set; }
    public Guid? CollectionId { get; set; }
    public List<Guid>? TagIds { get; set; }
}
