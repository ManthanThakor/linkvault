using LinkVault.Application.DTOs.Admin;
using LinkVault.Application.DTOs.Common;

namespace LinkVault.Application.Interfaces;

public interface IAdminService
{
    Task<ApiResponse<AdminDashboardResponse>> GetDashboardAsync();
    Task<ApiResponse<IEnumerable<UserManagementResponse>>> GetUsersAsync(int page = 1, int pageSize = 20);
    Task<ApiResponse<UserManagementResponse>> GetUserByIdAsync(Guid userId);
    Task<ApiResponse<string>> UpdateUserRoleAsync(Guid userId, string role);
    Task<ApiResponse<string>> DeleteUserAsync(Guid userId);
    Task<ApiResponse<IEnumerable<AuditLogResponse>>> GetAuditLogsAsync(int page = 1, int pageSize = 20);
}
