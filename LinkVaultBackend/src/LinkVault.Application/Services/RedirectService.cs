using Microsoft.Extensions.Logging;
using LinkVault.Application.DTOs.Common;
using LinkVault.Application.Exceptions;
using LinkVault.Application.Interfaces;
using LinkVault.Core.Entities;
using LinkVault.Core.Interfaces;

namespace LinkVault.Application.Services;

public class RedirectService : IRedirectService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<RedirectService> _logger;

    public RedirectService(IUnitOfWork unitOfWork, ILogger<RedirectService> logger)
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<ApiResponse<string>> GetOriginalUrlAsync(string shortCode, string? userAgent = null, string? ipAddress = null, string? referer = null)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var clickLogRepo = _unitOfWork.Repository<ClickLog>();
        var link = await linkRepo.FirstOrDefaultAsync(l => l.ShortCode == shortCode);

        if (link == null)
            throw new NotFoundException(nameof(Link), shortCode);

        if (link.ExpiryDate != null && link.ExpiryDate < DateTime.UtcNow)
            throw new BadRequestException("This link has expired.");

        if (!string.IsNullOrEmpty(link.PasswordHash))
            throw new UnauthorizedException("This link is password protected.");

        link.ClickCount++;
        link.LastClickedAt = DateTime.UtcNow;
        linkRepo.Update(link);

        var clickLog = CreateClickLog(link.Id, userAgent, ipAddress, referer);
        await clickLogRepo.AddAsync(clickLog);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Redirect: {ShortCode} -> {Url} from {IP}", shortCode, link.OriginalUrl, ipAddress);

        return ApiResponse<string>.Ok(link.OriginalUrl);
    }

    public async Task<ApiResponse<bool>> CheckLinkAsync(string shortCode)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var link = await linkRepo.FirstOrDefaultAsync(l => l.ShortCode == shortCode);

        if (link == null)
            return ApiResponse<bool>.Fail("Link not found");

        if (link.ExpiryDate != null && link.ExpiryDate < DateTime.UtcNow)
            return ApiResponse<bool>.Fail("This link has expired.");

        if (!string.IsNullOrEmpty(link.PasswordHash))
            return ApiResponse<bool>.Fail("This link is password protected.");

        return ApiResponse<bool>.Ok(true, "Link is valid");
    }

    public async Task<ApiResponse<string>> VerifyPasswordAsync(string shortCode, string password, string? userAgent = null, string? ipAddress = null, string? referer = null)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var clickLogRepo = _unitOfWork.Repository<ClickLog>();
        var link = await linkRepo.FirstOrDefaultAsync(l => l.ShortCode == shortCode);

        if (link == null)
            throw new NotFoundException(nameof(Link), shortCode);

        if (link.ExpiryDate != null && link.ExpiryDate < DateTime.UtcNow)
            throw new BadRequestException("This link has expired.");

        if (string.IsNullOrEmpty(link.PasswordHash))
        {
            link.ClickCount++;
            link.LastClickedAt = DateTime.UtcNow;
            linkRepo.Update(link);

            var clickLog = CreateClickLog(link.Id, userAgent, ipAddress, referer);
            await clickLogRepo.AddAsync(clickLog);
            await _unitOfWork.SaveChangesAsync();

            return ApiResponse<string>.Ok(link.OriginalUrl);
        }

        if (!BCrypt.Net.BCrypt.Verify(password, link.PasswordHash))
            throw new UnauthorizedException("Invalid password");

        link.ClickCount++;
        link.LastClickedAt = DateTime.UtcNow;
        linkRepo.Update(link);

        var clickLog2 = CreateClickLog(link.Id, userAgent, ipAddress, referer);
        await clickLogRepo.AddAsync(clickLog2);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Password verified redirect: {ShortCode} -> {Url}", shortCode, link.OriginalUrl);

        return ApiResponse<string>.Ok(link.OriginalUrl);
    }

    private static ClickLog CreateClickLog(Guid linkId, string? userAgent, string? ipAddress, string? referer)
    {
        var clickLog = new ClickLog
        {
            LinkId = linkId,
            IPAddress = ipAddress,
            Referer = referer,
            UserAgent = userAgent
        };

        if (!string.IsNullOrEmpty(userAgent))
        {
            clickLog.Browser = DetectBrowser(userAgent);
            clickLog.BrowserVersion = DetectBrowserVersion(userAgent);
            clickLog.OS = DetectOS(userAgent);
            clickLog.Device = DetectDevice(userAgent);
        }

        return clickLog;
    }

    private static string? DetectBrowser(string userAgent)
    {
        if (userAgent.Contains("Edg/", StringComparison.OrdinalIgnoreCase)) return "Edge";
        if (userAgent.Contains("Chrome/", StringComparison.OrdinalIgnoreCase)) return "Chrome";
        if (userAgent.Contains("Firefox/", StringComparison.OrdinalIgnoreCase)) return "Firefox";
        if (userAgent.Contains("Safari/", StringComparison.OrdinalIgnoreCase)) return "Safari";
        if (userAgent.Contains("OPR/", StringComparison.OrdinalIgnoreCase)) return "Opera";
        return "Unknown";
    }

    private static string? DetectBrowserVersion(string userAgent)
    {
        var browser = DetectBrowser(userAgent);
        var searchString = browser switch
        {
            "Edge" => "Edg/",
            "Chrome" => "Chrome/",
            "Firefox" => "Firefox/",
            "Safari" => "Version/",
            "Opera" => "OPR/",
            _ => null
        };

        if (searchString == null) return null;
        var index = userAgent.IndexOf(searchString, StringComparison.OrdinalIgnoreCase);
        if (index < 0) return null;
        var start = index + searchString.Length;
        var end = userAgent.IndexOf(' ', start);
        return end > start ? userAgent[start..end] : userAgent[start..];
    }

    private static string? DetectOS(string userAgent)
    {
        if (userAgent.Contains("Windows NT", StringComparison.OrdinalIgnoreCase)) return "Windows";
        if (userAgent.Contains("Mac OS X", StringComparison.OrdinalIgnoreCase)) return "macOS";
        if (userAgent.Contains("Linux", StringComparison.OrdinalIgnoreCase) && !userAgent.Contains("Android", StringComparison.OrdinalIgnoreCase)) return "Linux";
        if (userAgent.Contains("Android", StringComparison.OrdinalIgnoreCase)) return "Android";
        if (userAgent.Contains("iPhone", StringComparison.OrdinalIgnoreCase) || userAgent.Contains("iPad", StringComparison.OrdinalIgnoreCase)) return "iOS";
        if (userAgent.Contains("CrOS", StringComparison.OrdinalIgnoreCase)) return "ChromeOS";
        return "Unknown";
    }

    private static string? DetectDevice(string userAgent)
    {
        if (userAgent.Contains("Mobile", StringComparison.OrdinalIgnoreCase)) return "Mobile";
        if (userAgent.Contains("Tablet", StringComparison.OrdinalIgnoreCase)) return "Tablet";
        if (userAgent.Contains("iPad", StringComparison.OrdinalIgnoreCase)) return "Tablet";
        return "Desktop";
    }
}
