using AutoMapper;
using LinkVault.Application.DTOs.Analytics;
using LinkVault.Application.DTOs.Common;
using LinkVault.Application.DTOs.Link;
using LinkVault.Application.Exceptions;
using LinkVault.Application.Interfaces;
using LinkVault.Core.Entities;
using LinkVault.Core.Interfaces;

namespace LinkVault.Application.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AnalyticsService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<AnalyticsOverview>> GetOverviewAsync(Guid userId)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var now = DateTime.UtcNow;
        var links = (await linkRepo.FindAsync(l => l.UserId == userId)).ToList();

        var categoryRepo = _unitOfWork.Repository<Category>();
        var categories = (await categoryRepo.FindAsync(c => c.UserId == userId)).ToList();

        var overview = new AnalyticsOverview
        {
            TotalClicks = links.Sum(l => l.ClickCount),
            TodayClicks = links.Sum(l => l.ClickCount),
            LastClick = links.Where(l => l.LastClickedAt != null).MaxBy(l => l.LastClickedAt)?.LastClickedAt,
            TopLinks = _mapper.Map<List<LinkAnalytics>>(links.OrderByDescending(l => l.ClickCount).Take(10).ToList()),
            MostUsedCategories = categories
                .OrderByDescending(c => c.Links.Count)
                .Take(5)
                .Select(c => new CategoryAnalytics
                {
                    CategoryId = c.Id,
                    CategoryName = c.Name,
                    LinkCount = c.Links.Count
                })
                .ToList(),
            RecentlyCreatedLinks = _mapper.Map<List<LinkAnalytics>>(links.OrderByDescending(l => l.CreatedAt).Take(5).ToList())
        };

        return ApiResponse<AnalyticsOverview>.Ok(overview);
    }

    public async Task<ApiResponse<IEnumerable<LinkAnalytics>>> GetTopLinksAsync(Guid userId, int count = 10)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var links = (await linkRepo.FindAsync(l => l.UserId == userId))
            .OrderByDescending(l => l.ClickCount)
            .Take(count)
            .ToList();

        var response = _mapper.Map<IEnumerable<LinkAnalytics>>(links);
        return ApiResponse<IEnumerable<LinkAnalytics>>.Ok(response);
    }

    public async Task<ApiResponse<int>> GetTotalClicksAsync(Guid userId)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var links = await linkRepo.FindAsync(l => l.UserId == userId);
        var totalClicks = links.Sum(l => l.ClickCount);

        return ApiResponse<int>.Ok(totalClicks);
    }

    public async Task<ApiResponse<IEnumerable<LinkResponse>>> GetRecentClicksAsync(Guid userId, int count = 10)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var links = (await linkRepo.FindAsync(l => l.UserId == userId))
            .Where(l => l.LastClickedAt != null)
            .OrderByDescending(l => l.LastClickedAt)
            .Take(count)
            .ToList();

        var response = _mapper.Map<IEnumerable<LinkResponse>>(links);
        return ApiResponse<IEnumerable<LinkResponse>>.Ok(response);
    }

    public async Task<ApiResponse<LinkAnalytics>> GetLinkAnalyticsAsync(Guid userId, Guid linkId)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var link = await linkRepo.FirstOrDefaultAsync(l => l.Id == linkId && l.UserId == userId);
        if (link == null)
            throw new NotFoundException(nameof(Link), linkId);

        var response = _mapper.Map<LinkAnalytics>(link);
        return ApiResponse<LinkAnalytics>.Ok(response);
    }

    public async Task<ApiResponse<Dictionary<string, int>>> GetDailyClicksAsync(Guid userId, int days = 7)
    {
        var clickLogRepo = _unitOfWork.Repository<ClickLog>();
        var startDate = DateTime.UtcNow.AddDays(-days);
        var clickLogs = await clickLogRepo.FindAsync(cl =>
            cl.CreatedAt >= startDate);

        var dailyClicks = clickLogs
            .GroupBy(cl => cl.CreatedAt.Date)
            .OrderBy(g => g.Key)
            .ToDictionary(g => g.Key.ToString("yyyy-MM-dd"), g => g.Count());

        return ApiResponse<Dictionary<string, int>>.Ok(dailyClicks);
    }

    public async Task<ApiResponse<Dictionary<string, int>>> GetMonthlyClicksAsync(Guid userId, int months = 6)
    {
        var clickLogRepo = _unitOfWork.Repository<ClickLog>();
        var startDate = DateTime.UtcNow.AddMonths(-months);
        var clickLogs = await clickLogRepo.FindAsync(cl =>
            cl.CreatedAt >= startDate);

        var monthlyClicks = clickLogs
            .GroupBy(cl => new { cl.CreatedAt.Year, cl.CreatedAt.Month })
            .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
            .ToDictionary(g => $"{g.Key.Year}-{g.Key.Month:D2}", g => g.Count());

        return ApiResponse<Dictionary<string, int>>.Ok(monthlyClicks);
    }
}
