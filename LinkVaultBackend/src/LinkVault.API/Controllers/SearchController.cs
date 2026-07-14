using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LinkVault.Application.Interfaces;

namespace LinkVault.API.Controllers;

[ApiController]
[Route("api/search")]
[Authorize]
public class SearchController : ControllerBase
{
    private readonly ISearchService _searchService;

    public SearchController(ISearchService searchService)
    {
        _searchService = searchService;
    }

    [HttpGet]
    public async Task<IActionResult> SearchAll([FromQuery] string query)
    {
        var userId = GetUserId();
        var result = await _searchService.SearchAllAsync(userId, query);
        return Ok(result);
    }

    [HttpGet("title")]
    public async Task<IActionResult> SearchByTitle([FromQuery] string query)
    {
        var userId = GetUserId();
        var result = await _searchService.SearchByTitleAsync(userId, query);
        return Ok(result);
    }

    [HttpGet("url")]
    public async Task<IActionResult> SearchByUrl([FromQuery] string query)
    {
        var userId = GetUserId();
        var result = await _searchService.SearchByUrlAsync(userId, query);
        return Ok(result);
    }

    [HttpGet("category")]
    public async Task<IActionResult> SearchByCategory([FromQuery] string categoryName)
    {
        var userId = GetUserId();
        var result = await _searchService.SearchByCategoryAsync(userId, categoryName);
        return Ok(result);
    }

    [HttpGet("notes")]
    public async Task<IActionResult> SearchByNotes([FromQuery] string query)
    {
        var userId = GetUserId();
        var result = await _searchService.SearchByNotesAsync(userId, query);
        return Ok(result);
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst("sub");
        return Guid.Parse(claim!.Value);
    }
}
