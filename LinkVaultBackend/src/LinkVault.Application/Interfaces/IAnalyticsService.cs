using LinkVault.Application.DTOs.Analytics;
using LinkVault.Application.DTOs.Common;
using LinkVault.Application.DTOs.Link;

namespace LinkVault.Application.Interfaces;

public interface IAnalyticsService
{
    Task<ApiResponse<AnalyticsOverview>> GetOverviewAsync(Guid userId);
    Task<ApiResponse<IEnumerable<LinkAnalytics>>> GetTopLinksAsync(Guid userId, int count = 10);
    Task<ApiResponse<int>> GetTotalClicksAsync(Guid userId);
    Task<ApiResponse<IEnumerable<LinkResponse>>> GetRecentClicksAsync(Guid userId, int count = 10);
    Task<ApiResponse<LinkAnalytics>> GetLinkAnalyticsAsync(Guid userId, Guid linkId);
    Task<ApiResponse<Dictionary<string, int>>> GetDailyClicksAsync(Guid userId, int days = 7);
    Task<ApiResponse<Dictionary<string, int>>> GetMonthlyClicksAsync(Guid userId, int months = 6);
}
