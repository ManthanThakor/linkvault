using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LinkVault.Application.DTOs.Tag;
using LinkVault.Application.Interfaces;

namespace LinkVault.API.Controllers;

[ApiController]
[Route("api/tags")]
[Authorize]
public class TagsController : ControllerBase
{
    private readonly ITagService _tagService;

    public TagsController(ITagService tagService)
    {
        _tagService = tagService;
    }

    [HttpGet]
    public async Task<IActionResult> GetTags()
    {
        var userId = GetUserId();
        var result = await _tagService.GetTagsAsync(userId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTag(Guid id)
    {
        var userId = GetUserId();
        var result = await _tagService.GetTagByIdAsync(userId, id);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTag([FromBody] TagRequest request)
    {
        var userId = GetUserId();
        var result = await _tagService.CreateTagAsync(userId, request);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTag(Guid id, [FromBody] TagRequest request)
    {
        var userId = GetUserId();
        var result = await _tagService.UpdateTagAsync(userId, id, request);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTag(Guid id)
    {
        var userId = GetUserId();
        var result = await _tagService.DeleteTagAsync(userId, id);
        return Ok(result);
    }

    [HttpGet("link/{linkId}")]
    public async Task<IActionResult> GetLinkTags(Guid linkId)
    {
        var result = await _tagService.GetLinkTagsAsync(linkId);
        return Ok(result);
    }

    [HttpPost("link/{linkId}/tag/{tagId}")]
    public async Task<IActionResult> AddTagToLink(Guid linkId, Guid tagId)
    {
        var userId = GetUserId();
        var result = await _tagService.AddTagToLinkAsync(userId, linkId, tagId);
        return Ok(result);
    }

    [HttpDelete("link/{linkId}/tag/{tagId}")]
    public async Task<IActionResult> RemoveTagFromLink(Guid linkId, Guid tagId)
    {
        var userId = GetUserId();
        var result = await _tagService.RemoveTagFromLinkAsync(userId, linkId, tagId);
        return Ok(result);
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(claim!.Value);
    }
}
