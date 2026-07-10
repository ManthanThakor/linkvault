namespace LinkVault.Application.DTOs.UserSetting;

public class UserSettingResponse
{
    public string? Theme { get; set; }
    public string? Language { get; set; }
    public bool EmailNotifications { get; set; }
    public bool LinkExpiryNotifications { get; set; }
    public bool ClickNotifications { get; set; }
    public int DefaultLinkExpiryDays { get; set; }
    public string? DefaultShortCodeLength { get; set; }
}

public class UpdateUserSettingRequest
{
    public string? Theme { get; set; }
    public string? Language { get; set; }
    public bool? EmailNotifications { get; set; }
    public bool? LinkExpiryNotifications { get; set; }
    public bool? ClickNotifications { get; set; }
    public int? DefaultLinkExpiryDays { get; set; }
    public string? DefaultShortCodeLength { get; set; }
}
