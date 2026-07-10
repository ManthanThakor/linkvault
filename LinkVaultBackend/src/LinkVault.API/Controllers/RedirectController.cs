using Microsoft.AspNetCore.Mvc;
using LinkVault.Application.Interfaces;

namespace LinkVault.API.Controllers;

[ApiController]
public class RedirectController : ControllerBase
{
    private readonly IRedirectService _redirectService;

    public RedirectController(IRedirectService redirectService)
    {
        _redirectService = redirectService;
    }

    [HttpGet("{shortCode}")]
    public async Task<IActionResult> RedirectToUrl(string shortCode)
    {
        var userAgent = Request.Headers.UserAgent.ToString();
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var referer = Request.Headers.Referer.ToString();

        var result = await _redirectService.GetOriginalUrlAsync(shortCode, userAgent, ipAddress, referer);
        if (result.Success && result.Data != null)
            return Redirect(result.Data);
        return BadRequest(result);
    }

    [HttpPost("api/redirect/verify-password")]
    public async Task<IActionResult> VerifyPassword([FromBody] PasswordVerification request)
    {
        var userAgent = Request.Headers.UserAgent.ToString();
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var referer = Request.Headers.Referer.ToString();

        var result = await _redirectService.VerifyPasswordAsync(request.ShortCode, request.Password, userAgent, ipAddress, referer);
        if (result.Success && result.Data != null)
            return Ok(result);
        return Unauthorized(result);
    }

    [HttpGet("api/redirect/check/{shortCode}")]
    public async Task<IActionResult> CheckLink(string shortCode)
    {
        var result = await _redirectService.CheckLinkAsync(shortCode);
        return Ok(result);
    }
}

public class PasswordVerification
{
    public string ShortCode { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
