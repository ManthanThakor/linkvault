using LinkVault.Core.Enums;

namespace LinkVault.Application.Interfaces;

public interface IAuditService
{
    Task LogAsync(Guid? userId, string? userEmail, AuditAction action, string entityName, string? entityId = null, string? oldValues = null, string? newValues = null, string? ipAddress = null);
}
