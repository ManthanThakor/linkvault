using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LinkVault.Application.DTOs.Collection;
using LinkVault.Application.Interfaces;

namespace LinkVault.API.Controllers;

[ApiController]
[Route("api/collections")]
[Authorize]
public class CollectionsController : ControllerBase
{
    private readonly ICollectionService _collectionService;

    public CollectionsController(ICollectionService collectionService)
    {
        _collectionService = collectionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCollections()
    {
        var userId = GetUserId();
        var result = await _collectionService.GetCollectionsAsync(userId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCollection(Guid id)
    {
        var userId = GetUserId();
        var result = await _collectionService.GetCollectionByIdAsync(userId, id);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCollection([FromBody] CollectionRequest request)
    {
        var userId = GetUserId();
        var result = await _collectionService.CreateCollectionAsync(userId, request);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCollection(Guid id, [FromBody] CollectionRequest request)
    {
        var userId = GetUserId();
        var result = await _collectionService.UpdateCollectionAsync(userId, id, request);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCollection(Guid id)
    {
        var userId = GetUserId();
        var result = await _collectionService.DeleteCollectionAsync(userId, id);
        return Ok(result);
    }

    [HttpGet("{id}/links")]
    public async Task<IActionResult> GetCollectionLinks(Guid id)
    {
        var userId = GetUserId();
        var result = await _collectionService.GetCollectionLinksAsync(userId, id);
        return Ok(result);
    }

    [HttpPost("{collectionId}/links/{linkId}")]
    public async Task<IActionResult> AddLinkToCollection(Guid collectionId, Guid linkId)
    {
        var userId = GetUserId();
        var result = await _collectionService.AddLinkToCollectionAsync(userId, collectionId, linkId);
        return Ok(result);
    }

    [HttpDelete("{collectionId}/links/{linkId}")]
    public async Task<IActionResult> RemoveLinkFromCollection(Guid collectionId, Guid linkId)
    {
        var userId = GetUserId();
        var result = await _collectionService.RemoveLinkFromCollectionAsync(userId, collectionId, linkId);
        return Ok(result);
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        return Guid.Parse(claim!.Value);
    }
}
