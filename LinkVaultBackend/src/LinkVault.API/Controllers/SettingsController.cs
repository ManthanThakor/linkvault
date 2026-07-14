using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LinkVault.Application.DTOs.UserSetting;
using LinkVault.Application.Interfaces;

namespace LinkVault.API.Controllers;

[ApiController]
[Route("api/settings")]
[Authorize]
public class SettingsController : ControllerBase
{
    private readonly IUserSettingService _userSettingService;

    public SettingsController(IUserSettingService userSettingService)
    {
        _userSettingService = userSettingService;
    }

    [HttpGet]
    public async Task<IActionResult> GetSettings()
    {
        var userId = GetUserId();
        var result = await _userSettingService.GetSettingsAsync(userId);
        return Ok(result);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateSettings([FromBody] UpdateUserSettingRequest request)
    {
        var userId = GetUserId();
        var result = await _userSettingService.UpdateSettingsAsync(userId, request);
        return Ok(result);
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst("sub");
        return Guid.Parse(claim!.Value);
    }
}
