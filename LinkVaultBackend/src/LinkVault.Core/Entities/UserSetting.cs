namespace LinkVault.Core.Entities;

public class UserSetting : BaseEntity
{
    public Guid UserId { get; set; }
    public string? Theme { get; set; } = "light";
    public string? Language { get; set; } = "en";
    public bool EmailNotifications { get; set; } = true;
    public bool LinkExpiryNotifications { get; set; } = true;
    public bool ClickNotifications { get; set; }
    public int DefaultLinkExpiryDays { get; set; }
    public string? DefaultShortCodeLength { get; set; } = "7";
    public User User { get; set; } = null!;
}
