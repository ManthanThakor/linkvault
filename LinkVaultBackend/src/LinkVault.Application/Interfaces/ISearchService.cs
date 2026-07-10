using LinkVault.Application.DTOs.Common;
using LinkVault.Application.DTOs.Link;

namespace LinkVault.Application.Interfaces;

public interface ISearchService
{
    Task<ApiResponse<IEnumerable<LinkResponse>>> SearchAllAsync(Guid userId, string query);
    Task<ApiResponse<IEnumerable<LinkResponse>>> SearchByTitleAsync(Guid userId, string query);
    Task<ApiResponse<IEnumerable<LinkResponse>>> SearchByUrlAsync(Guid userId, string query);
    Task<ApiResponse<IEnumerable<LinkResponse>>> SearchByCategoryAsync(Guid userId, string categoryName);
    Task<ApiResponse<IEnumerable<LinkResponse>>> SearchByNotesAsync(Guid userId, string query);
}
