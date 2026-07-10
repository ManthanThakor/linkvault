using LinkVault.Application.DTOs.Common;
using LinkVault.Application.DTOs.Link;

namespace LinkVault.Application.Interfaces;

public interface ILinkService
{
    Task<ApiResponse<PagedResponse<LinkResponse>>> GetLinksAsync(Guid userId, int page = 1, int pageSize = 10);
    Task<ApiResponse<LinkResponse>> GetLinkByIdAsync(Guid userId, Guid id);
    Task<ApiResponse<LinkResponse>> CreateLinkAsync(Guid userId, CreateLinkRequest request);
    Task<ApiResponse<LinkResponse>> UpdateLinkAsync(Guid userId, Guid id, UpdateLinkRequest request);
    Task<ApiResponse<string>> DeleteLinkAsync(Guid userId, Guid id);
    Task<ApiResponse<IEnumerable<LinkResponse>>> SearchLinksAsync(Guid userId, string query);
    Task<ApiResponse<PagedResponse<LinkResponse>>> FilterLinksAsync(Guid userId, string? filter, int page = 1, int pageSize = 10);
    Task<ApiResponse<LinkResponse>> GetLinkByShortCodeAsync(string shortCode);
    Task<ApiResponse<string>> ToggleFavoriteAsync(Guid userId, Guid id);
    Task<ApiResponse<string>> SetPasswordAsync(Guid userId, Guid id, string password);
    Task<ApiResponse<string>> RemovePasswordAsync(Guid userId, Guid id);
    Task<ApiResponse<string>> SetExpiryAsync(Guid userId, Guid id, DateTime? expiryDate);
    Task<ApiResponse<string>> RemoveExpiryAsync(Guid userId, Guid id);
}
