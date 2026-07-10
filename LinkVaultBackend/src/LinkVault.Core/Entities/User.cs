using LinkVault.Core.Enums;

namespace LinkVault.Core.Entities;

public class User : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.User;
    public bool EmailVerified { get; set; }
    public string? EmailVerificationToken { get; set; }
    public string? ResetPasswordToken { get; set; }
    public DateTime? ResetPasswordTokenExpiry { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public ICollection<Category> Categories { get; set; } = new List<Category>();
    public ICollection<Link> Links { get; set; } = new List<Link>();
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public ICollection<Collection> Collections { get; set; } = new List<Collection>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public UserSetting? UserSetting { get; set; }
}
