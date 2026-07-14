using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LinkVault.Application.Interfaces;

namespace LinkVault.API.Controllers;

[ApiController]
[Route("api/analytics")]
[Authorize]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;

    public AnalyticsController(IAnalyticsService analyticsService)
    {
        _analyticsService = analyticsService;
    }

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview()
    {
        var userId = GetUserId();
        var result = await _analyticsService.GetOverviewAsync(userId);
        return Ok(result);
    }

    [HttpGet("top-links")]
    public async Task<IActionResult> GetTopLinks([FromQuery] int count = 10)
    {
        var userId = GetUserId();
        var result = await _analyticsService.GetTopLinksAsync(userId, count);
        return Ok(result);
    }

    [HttpGet("total-clicks")]
    public async Task<IActionResult> GetTotalClicks()
    {
        var userId = GetUserId();
        var result = await _analyticsService.GetTotalClicksAsync(userId);
        return Ok(result);
    }

    [HttpGet("recent-clicks")]
    public async Task<IActionResult> GetRecentClicks([FromQuery] int count = 10)
    {
        var userId = GetUserId();
        var result = await _analyticsService.GetRecentClicksAsync(userId, count);
        return Ok(result);
    }

    [HttpGet("link/{id}")]
    public async Task<IActionResult> GetLinkAnalytics(Guid id)
    {
        var userId = GetUserId();
        var result = await _analyticsService.GetLinkAnalyticsAsync(userId, id);
        return Ok(result);
    }

    [HttpGet("daily")]
    public async Task<IActionResult> GetDailyClicks([FromQuery] int days = 7)
    {
        var userId = GetUserId();
        var result = await _analyticsService.GetDailyClicksAsync(userId, days);
        return Ok(result);
    }

    [HttpGet("monthly")]
    public async Task<IActionResult> GetMonthlyClicks([FromQuery] int months = 6)
    {
        var userId = GetUserId();
        var result = await _analyticsService.GetMonthlyClicksAsync(userId, months);
        return Ok(result);
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst("sub");
        return Guid.Parse(claim!.Value);
    }
}
