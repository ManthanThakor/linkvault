using AutoMapper;
using LinkVault.Application.DTOs.Common;
using LinkVault.Application.DTOs.Dashboard;
using LinkVault.Application.DTOs.Link;
using LinkVault.Application.DTOs.Analytics;
using LinkVault.Application.Interfaces;
using LinkVault.Core.Entities;
using LinkVault.Core.Interfaces;

namespace LinkVault.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public DashboardService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<DashboardSummary>> GetSummaryAsync(Guid userId)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var categoryRepo = _unitOfWork.Repository<Category>();
        var tagRepo = _unitOfWork.Repository<Tag>();
        var clickLogRepo = _unitOfWork.Repository<ClickLog>();
        var now = DateTime.UtcNow;

        var links = await linkRepo.FindAsync(l => l.UserId == userId);
        var linksList = links.ToList();

        var allLinks = linksList.AsQueryable();
        var recentLinks = allLinks.OrderByDescending(l => l.CreatedAt).Take(5).ToList();
        var topLinks = allLinks.OrderByDescending(l => l.ClickCount).Take(5).ToList();

        var categories = await categoryRepo.FindAsync(c => c.UserId == userId);
        var tags = await tagRepo.FindAsync(t => t.UserId == userId);

        var summary = new DashboardSummary
        {
            TotalLinks = linksList.Count,
            ActiveLinks = linksList.Count(l => l.ExpiryDate == null || l.ExpiryDate > now),
            ExpiredLinks = linksList.Count(l => l.ExpiryDate != null && l.ExpiryDate <= now),
            FavoriteLinks = linksList.Count(l => l.IsFavorite),
            TotalClicks = linksList.Sum(l => l.ClickCount),
            TodayClicks = await clickLogRepo.CountAsync(cl =>
                cl.Link != null && cl.Link.UserId == userId && cl.CreatedAt.Date == now.Date),
            TotalCategories = categories.Count(),
            TotalTags = tags.Count(),
            RecentLinks = _mapper.Map<List<LinkResponse>>(recentLinks),
            TopLinks = _mapper.Map<List<LinkAnalytics>>(topLinks)
        };

        return ApiResponse<DashboardSummary>.Ok(summary);
    }

    public async Task<ApiResponse<IEnumerable<LinkResponse>>> GetRecentLinksAsync(Guid userId, int count = 5)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var links = await linkRepo.GetPagedAsync(1, count, l => l.UserId == userId, l => l.CreatedAt, true);
        var response = _mapper.Map<IEnumerable<LinkResponse>>(links);
        return ApiResponse<IEnumerable<LinkResponse>>.Ok(response);
    }

    public async Task<ApiResponse<IEnumerable<LinkAnalytics>>> GetTopLinksAsync(Guid userId, int count = 5)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var links = await linkRepo.GetPagedAsync(1, count, l => l.UserId == userId, l => l.ClickCount, true);
        var response = _mapper.Map<IEnumerable<LinkAnalytics>>(links);
        return ApiResponse<IEnumerable<LinkAnalytics>>.Ok(response);
    }

    public async Task<ApiResponse<IEnumerable<LinkResponse>>> GetRecentActivitiesAsync(Guid userId, int count = 10)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var links = await linkRepo.GetPagedAsync(1, count, l => l.UserId == userId, l => l.CreatedAt, true);
        var response = _mapper.Map<IEnumerable<LinkResponse>>(links);
        return ApiResponse<IEnumerable<LinkResponse>>.Ok(response);
    }
}
