namespace LinkVault.Core.Entities;

public class LinkTag
{
    public Guid LinkId { get; set; }
    public Link Link { get; set; } = null!;
    public Guid TagId { get; set; }
    public Tag Tag { get; set; } = null!;
}
