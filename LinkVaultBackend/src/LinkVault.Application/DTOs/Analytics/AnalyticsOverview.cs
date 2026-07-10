namespace LinkVault.Application.DTOs.Analytics;

public class AnalyticsOverview
{
    public int TotalClicks { get; set; }
    public int TodayClicks { get; set; }
    public DateTime? LastClick { get; set; }
    public List<LinkAnalytics> TopLinks { get; set; } = new();
    public List<CategoryAnalytics> MostUsedCategories { get; set; } = new();
    public List<LinkAnalytics> RecentlyCreatedLinks { get; set; } = new();
}

public class LinkAnalytics
{
    public Guid Id { get; set; }
    public string OriginalUrl { get; set; } = string.Empty;
    public string ShortCode { get; set; } = string.Empty;
    public string? Title { get; set; }
    public int ClickCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CategoryAnalytics
{
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public int LinkCount { get; set; }
}
