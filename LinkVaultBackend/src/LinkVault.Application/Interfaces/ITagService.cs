using LinkVault.Application.DTOs.Common;
using LinkVault.Application.DTOs.Tag;

namespace LinkVault.Application.Interfaces;

public interface ITagService
{
    Task<ApiResponse<IEnumerable<TagResponse>>> GetTagsAsync(Guid userId);
    Task<ApiResponse<TagResponse>> GetTagByIdAsync(Guid userId, Guid id);
    Task<ApiResponse<TagResponse>> CreateTagAsync(Guid userId, TagRequest request);
    Task<ApiResponse<TagResponse>> UpdateTagAsync(Guid userId, Guid id, TagRequest request);
    Task<ApiResponse<string>> DeleteTagAsync(Guid userId, Guid id);
    Task<ApiResponse<IEnumerable<TagResponse>>> GetLinkTagsAsync(Guid linkId);
    Task<ApiResponse<string>> AddTagToLinkAsync(Guid userId, Guid linkId, Guid tagId);
    Task<ApiResponse<string>> RemoveTagFromLinkAsync(Guid userId, Guid linkId, Guid tagId);
}
