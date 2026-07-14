using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LinkVault.Application.DTOs.Common;
using LinkVault.Application.DTOs.Link;
using LinkVault.Application.Interfaces;
using LinkVault.Core.Interfaces;
using LinkVault.Core.Entities;
using AutoMapper;

namespace LinkVault.API.Controllers;

[ApiController]
[Route("api/favorites")]
[Authorize]
public class FavoritesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public FavoritesController(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> GetFavorites()
    {
        var userId = GetUserId();
        var linkRepo = _unitOfWork.Repository<Link>();
        var links = await linkRepo.FindAsync(l => l.UserId == userId && l.IsFavorite);
        var response = _mapper.Map<IEnumerable<LinkResponse>>(links);
        return Ok(ApiResponse<IEnumerable<LinkResponse>>.Ok(response));
    }

    [HttpPost("{linkId}")]
    public async Task<IActionResult> AddFavorite(Guid linkId)
    {
        var userId = GetUserId();
        var linkRepo = _unitOfWork.Repository<Link>();
        var link = await linkRepo.FirstOrDefaultAsync(l => l.Id == linkId && l.UserId == userId);
        if (link == null)
            return NotFound(ApiResponse<string>.Fail("Link not found"));

        link.IsFavorite = true;
        linkRepo.Update(link);
        await _unitOfWork.SaveChangesAsync();

        return Ok(ApiResponse<string>.Ok("Added to favorites"));
    }

    [HttpDelete("{linkId}")]
    public async Task<IActionResult> RemoveFavorite(Guid linkId)
    {
        var userId = GetUserId();
        var linkRepo = _unitOfWork.Repository<Link>();
        var link = await linkRepo.FirstOrDefaultAsync(l => l.Id == linkId && l.UserId == userId);
        if (link == null)
            return NotFound(ApiResponse<string>.Fail("Link not found"));

        link.IsFavorite = false;
        linkRepo.Update(link);
        await _unitOfWork.SaveChangesAsync();

        return Ok(ApiResponse<string>.Ok("Removed from favorites"));
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst("sub");
        return Guid.Parse(claim!.Value);
    }
}
