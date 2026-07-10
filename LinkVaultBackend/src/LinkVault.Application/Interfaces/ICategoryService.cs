using LinkVault.Application.DTOs.Category;
using LinkVault.Application.DTOs.Common;
using LinkVault.Application.DTOs.Link;

namespace LinkVault.Application.Interfaces;

public interface ICategoryService
{
    Task<ApiResponse<IEnumerable<CategoryResponse>>> GetCategoriesAsync(Guid userId);
    Task<ApiResponse<CategoryResponse>> GetCategoryByIdAsync(Guid userId, Guid id);
    Task<ApiResponse<CategoryResponse>> CreateCategoryAsync(Guid userId, CategoryRequest request);
    Task<ApiResponse<CategoryResponse>> UpdateCategoryAsync(Guid userId, Guid id, CategoryRequest request);
    Task<ApiResponse<string>> DeleteCategoryAsync(Guid userId, Guid id);
    Task<ApiResponse<IEnumerable<LinkResponse>>> GetCategoryLinksAsync(Guid userId, Guid categoryId);
}
