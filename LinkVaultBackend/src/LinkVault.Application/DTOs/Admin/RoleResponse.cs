namespace LinkVault.Application.DTOs.Admin;

public class RoleResponse
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public List<string>? Permissions { get; set; }
}
