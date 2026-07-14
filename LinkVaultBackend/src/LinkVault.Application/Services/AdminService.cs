using AutoMapper;
using Microsoft.Extensions.Logging;
using LinkVault.Application.DTOs.Admin;
using LinkVault.Application.DTOs.Common;
using LinkVault.Application.Exceptions;
using LinkVault.Application.Interfaces;
using LinkVault.Core.Entities;
using LinkVault.Core.Enums;
using LinkVault.Core.Interfaces;

namespace LinkVault.Application.Services;

public class AdminService : IAdminService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<AdminService> _logger;

    public AdminService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<AdminService> logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<ApiResponse<AdminDashboardResponse>> GetDashboardAsync()
    {
        var userRepo = _unitOfWork.Repository<User>();
        var linkRepo = _unitOfWork.Repository<Link>();
        var auditRepo = _unitOfWork.Repository<AuditLog>();
        var now = DateTime.UtcNow;

        var totalUsers = await userRepo.CountAsync();
        var allLinks = await linkRepo.GetAllAsync();
        var linksList = allLinks.ToList();
        var totalLinks = linksList.Count;
        var totalClicks = linksList.Sum(l => l.ClickCount);

        var activeToday = await userRepo.CountAsync(u => u.LastLoginAt != null && u.LastLoginAt.Value.Date == now.Date);

        var recentAudits = (await auditRepo.FindAsync(a => true))
            .OrderByDescending(a => a.CreatedAt)
            .Take(10)
            .ToList();

        var response = new AdminDashboardResponse
        {
            TotalUsers = totalUsers,
            TotalLinks = totalLinks,
            TotalClicks = totalClicks,
            ActiveUsersToday = activeToday,
            RecentAuditLogs = _mapper.Map<List<AuditLogResponse>>(recentAudits)
        };

        return ApiResponse<AdminDashboardResponse>.Ok(response);
    }

    public async Task<ApiResponse<IEnumerable<UserManagementResponse>>> GetUsersAsync(int page = 1, int pageSize = 20)
    {
        var userRepo = _unitOfWork.Repository<User>();
        var users = await userRepo.GetPagedAsync(page, pageSize, null, u => u.CreatedAt, true);
        var response = _mapper.Map<IEnumerable<UserManagementResponse>>(users);
        return ApiResponse<IEnumerable<UserManagementResponse>>.Ok(response);
    }

    public async Task<ApiResponse<UserManagementResponse>> GetUserByIdAsync(Guid userId)
    {
        var userRepo = _unitOfWork.Repository<User>();
        var user = await userRepo.GetByIdAsync(userId);
        if (user == null)
            throw new NotFoundException(nameof(User), userId);

        var response = _mapper.Map<UserManagementResponse>(user);
        return ApiResponse<UserManagementResponse>.Ok(response);
    }

    public async Task<ApiResponse<string>> UpdateUserRoleAsync(Guid userId, string role)
    {
        var userRepo = _unitOfWork.Repository<User>();
        var user = await userRepo.GetByIdAsync(userId);
        if (user == null)
            throw new NotFoundException(nameof(User), userId);

        if (!Enum.TryParse<UserRole>(role, true, out var userRole))
            throw new BadRequestException("Invalid role. Use 'User' or 'Admin'");

        user.Role = userRole;
        user.UpdatedAt = DateTime.UtcNow;
        userRepo.Update(user);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("User {UserId} role updated to {Role}", userId, role);
        return ApiResponse<string>.Ok($"User role updated to {role}");
    }

    public async Task<ApiResponse<string>> DeleteUserAsync(Guid userId)
    {
        var userRepo = _unitOfWork.Repository<User>();
        var user = await userRepo.GetByIdAsync(userId);
        if (user == null)
            throw new NotFoundException(nameof(User), userId);

        userRepo.Delete(user);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("User {UserId} deleted by admin", userId);
        return ApiResponse<string>.Ok("User deleted successfully");
    }

    public async Task<ApiResponse<IEnumerable<AuditLogResponse>>> GetAuditLogsAsync(int page = 1, int pageSize = 20)
    {
        var auditRepo = _unitOfWork.Repository<AuditLog>();
        var logs = await auditRepo.GetPagedAsync(page, pageSize, null, a => a.CreatedAt, true);
        var response = _mapper.Map<IEnumerable<AuditLogResponse>>(logs);
        return ApiResponse<IEnumerable<AuditLogResponse>>.Ok(response);
    }

    public Task<ApiResponse<IEnumerable<RoleResponse>>> GetRolesAsync()
    {
        var roles = new List<RoleResponse>
        {
            new() { Id = "user", Name = "User", Description = "Regular user with basic permissions" },
            new() { Id = "admin", Name = "Admin", Description = "Full system access" }
        };
        return Task.FromResult(ApiResponse<IEnumerable<RoleResponse>>.Ok(roles));
    }
}
