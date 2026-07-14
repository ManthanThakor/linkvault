using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LinkVault.Application.DTOs.Category;
using LinkVault.Application.Interfaces;

namespace LinkVault.API.Controllers;

[ApiController]
[Route("api/categories")]
[Authorize]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCategories()
    {
        var userId = GetUserId();
        var result = await _categoryService.GetCategoriesAsync(userId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetCategory(Guid id)
    {
        var userId = GetUserId();
        var result = await _categoryService.GetCategoryByIdAsync(userId, id);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateCategory([FromBody] CategoryRequest request)
    {
        var userId = GetUserId();
        var result = await _categoryService.CreateCategoryAsync(userId, request);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCategory(Guid id, [FromBody] CategoryRequest request)
    {
        var userId = GetUserId();
        var result = await _categoryService.UpdateCategoryAsync(userId, id, request);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCategory(Guid id)
    {
        var userId = GetUserId();
        var result = await _categoryService.DeleteCategoryAsync(userId, id);
        return Ok(result);
    }

    [HttpGet("{id}/links")]
    public async Task<IActionResult> GetCategoryLinks(Guid id)
    {
        var userId = GetUserId();
        var result = await _categoryService.GetCategoryLinksAsync(userId, id);
        return Ok(result);
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst("sub");
        return Guid.Parse(claim!.Value);
    }
}
