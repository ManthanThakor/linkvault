namespace LinkVault.Application.DTOs.Dashboard;

public class DashboardSummary
{
    public int TotalLinks { get; set; }
    public int ActiveLinks { get; set; }
    public int ExpiredLinks { get; set; }
    public int FavoriteLinks { get; set; }
    public int TotalClicks { get; set; }
    public int TodayClicks { get; set; }
}
