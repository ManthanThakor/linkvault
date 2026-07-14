using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LinkVault.Application.DTOs.Link;
using LinkVault.Application.Interfaces;

namespace LinkVault.API.Controllers;

[ApiController]
[Route("api/links")]
[Authorize]
public class LinksController : ControllerBase
{
    private readonly ILinkService _linkService;

    public LinksController(ILinkService linkService)
    {
        _linkService = linkService;
    }

    [HttpGet]
    public async Task<IActionResult> GetLinks([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var userId = GetUserId();
        var result = await _linkService.GetLinksAsync(userId, page, pageSize);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetLink(Guid id)
    {
        var userId = GetUserId();
        var result = await _linkService.GetLinkByIdAsync(userId, id);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateLink([FromBody] CreateLinkRequest request)
    {
        var userId = GetUserId();
        var result = await _linkService.CreateLinkAsync(userId, request);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLink(Guid id, [FromBody] UpdateLinkRequest request)
    {
        var userId = GetUserId();
        var result = await _linkService.UpdateLinkAsync(userId, id, request);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLink(Guid id)
    {
        var userId = GetUserId();
        var result = await _linkService.DeleteLinkAsync(userId, id);
        return Ok(result);
    }

    [HttpGet("search")]
    public async Task<IActionResult> SearchLinks([FromQuery] string query)
    {
        var userId = GetUserId();
        var result = await _linkService.SearchLinksAsync(userId, query);
        return Ok(result);
    }

    [HttpGet("filter")]
    public async Task<IActionResult> FilterLinks([FromQuery] string? filter, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var userId = GetUserId();
        var result = await _linkService.FilterLinksAsync(userId, filter, page, pageSize);
        return Ok(result);
    }

    [HttpGet("short/{shortCode}")]
    public async Task<IActionResult> GetLinkByShortCode(string shortCode)
    {
        var result = await _linkService.GetLinkByShortCodeAsync(shortCode);
        return Ok(result);
    }

    [HttpPost("{id}/favorite")]
    public async Task<IActionResult> ToggleFavorite(Guid id)
    {
        var userId = GetUserId();
        var result = await _linkService.ToggleFavoriteAsync(userId, id);
        return Ok(result);
    }

    [HttpDelete("{id}/favorite")]
    public async Task<IActionResult> RemoveFavorite(Guid id)
    {
        var userId = GetUserId();
        var result = await _linkService.ToggleFavoriteAsync(userId, id);
        return Ok(result);
    }

    [HttpPost("{id}/password")]
    public async Task<IActionResult> SetPassword(Guid id, [FromBody] LinkPasswordRequest request)
    {
        var userId = GetUserId();
        var result = await _linkService.SetPasswordAsync(userId, id, request.Password);
        return Ok(result);
    }

    [HttpDelete("{id}/password")]
    public async Task<IActionResult> RemovePassword(Guid id)
    {
        var userId = GetUserId();
        var result = await _linkService.RemovePasswordAsync(userId, id);
        return Ok(result);
    }

    [HttpPut("{id}/expiry")]
    public async Task<IActionResult> SetExpiry(Guid id, [FromBody] LinkExpiryRequest request)
    {
        var userId = GetUserId();
        var result = await _linkService.SetExpiryAsync(userId, id, request.ExpiryDate);
        return Ok(result);
    }

    [HttpDelete("{id}/expiry")]
    public async Task<IActionResult> RemoveExpiry(Guid id)
    {
        var userId = GetUserId();
        var result = await _linkService.RemoveExpiryAsync(userId, id);
        return Ok(result);
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst("sub");
        return Guid.Parse(claim!.Value);
    }
}
