using LinkVault.Application.DTOs.Common;
using LinkVault.Application.DTOs.Dashboard;
using LinkVault.Application.DTOs.Link;
using LinkVault.Application.DTOs.Analytics;

namespace LinkVault.Application.Interfaces;

public interface IDashboardService
{
    Task<ApiResponse<DashboardSummary>> GetSummaryAsync(Guid userId);
    Task<ApiResponse<IEnumerable<LinkResponse>>> GetRecentLinksAsync(Guid userId, int count = 5);
    Task<ApiResponse<IEnumerable<LinkAnalytics>>> GetTopLinksAsync(Guid userId, int count = 5);
    Task<ApiResponse<IEnumerable<LinkResponse>>> GetRecentActivitiesAsync(Guid userId, int count = 10);
}
