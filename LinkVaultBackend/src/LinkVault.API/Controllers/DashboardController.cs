using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LinkVault.Application.Interfaces;

namespace LinkVault.API.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var userId = GetUserId();
        var result = await _dashboardService.GetSummaryAsync(userId);
        return Ok(result);
    }

    [HttpGet("recent-links")]
    public async Task<IActionResult> GetRecentLinks([FromQuery] int count = 5)
    {
        var userId = GetUserId();
        var result = await _dashboardService.GetRecentLinksAsync(userId, count);
        return Ok(result);
    }

    [HttpGet("top-links")]
    public async Task<IActionResult> GetTopLinks([FromQuery] int count = 5)
    {
        var userId = GetUserId();
        var result = await _dashboardService.GetTopLinksAsync(userId, count);
        return Ok(result);
    }

    [HttpGet("recent-activities")]
    public async Task<IActionResult> GetRecentActivities([FromQuery] int count = 10)
    {
        var userId = GetUserId();
        var result = await _dashboardService.GetRecentActivitiesAsync(userId, count);
        return Ok(result);
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(claim!.Value);
    }
}
