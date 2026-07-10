namespace LinkVault.Application.DTOs.Admin;

public class UserManagementResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public bool EmailVerified { get; set; }
    public int LinkCount { get; set; }
    public int TotalClicks { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
}

public class AdminDashboardResponse
{
    public int TotalUsers { get; set; }
    public int TotalLinks { get; set; }
    public int TotalClicks { get; set; }
    public int ActiveUsersToday { get; set; }
    public List<AuditLogResponse> RecentAuditLogs { get; set; } = new();
}

public class AuditLogResponse
{
    public Guid Id { get; set; }
    public string? UserEmail { get; set; }
    public string Action { get; set; } = string.Empty;
    public string EntityName { get; set; } = string.Empty;
    public string? EntityId { get; set; }
    public DateTime CreatedAt { get; set; }
}
