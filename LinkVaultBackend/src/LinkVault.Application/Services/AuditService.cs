using Microsoft.Extensions.Logging;
using LinkVault.Application.Interfaces;
using LinkVault.Core.Entities;
using LinkVault.Core.Enums;
using LinkVault.Core.Interfaces;

namespace LinkVault.Application.Services;

public class AuditService : IAuditService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<AuditService> _logger;

    public AuditService(IUnitOfWork unitOfWork, ILogger<AuditService> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task LogAsync(Guid? userId, string? userEmail, AuditAction action, string entityName, string? entityId = null, string? oldValues = null, string? newValues = null, string? ipAddress = null)
    {
        var auditLog = new AuditLog
        {
            UserId = userId,
            UserEmail = userEmail,
            Action = action,
            EntityName = entityName,
            EntityId = entityId,
            OldValues = oldValues,
            NewValues = newValues,
            IpAddress = ipAddress
        };

        var auditRepo = _unitOfWork.Repository<AuditLog>();
        await auditRepo.AddAsync(auditLog);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Audit: {Action} on {Entity} by user {UserId}", action, entityName, userId);
    }
}
