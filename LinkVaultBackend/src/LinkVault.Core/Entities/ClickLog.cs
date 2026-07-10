namespace LinkVault.Core.Entities;

public class ClickLog : BaseEntity
{
    public Guid LinkId { get; set; }
    public string? Device { get; set; }
    public string? Browser { get; set; }
    public string? BrowserVersion { get; set; }
    public string? OS { get; set; }
    public string? IPAddress { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    public string? Referer { get; set; }
    public string? UserAgent { get; set; }
    public Link Link { get; set; } = null!;
}
