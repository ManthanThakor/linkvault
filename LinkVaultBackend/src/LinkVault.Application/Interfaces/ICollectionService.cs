using LinkVault.Application.DTOs.Collection;
using LinkVault.Application.DTOs.Common;
using LinkVault.Application.DTOs.Link;

namespace LinkVault.Application.Interfaces;

public interface ICollectionService
{
    Task<ApiResponse<IEnumerable<CollectionResponse>>> GetCollectionsAsync(Guid userId);
    Task<ApiResponse<CollectionResponse>> GetCollectionByIdAsync(Guid userId, Guid id);
    Task<ApiResponse<CollectionResponse>> CreateCollectionAsync(Guid userId, CollectionRequest request);
    Task<ApiResponse<CollectionResponse>> UpdateCollectionAsync(Guid userId, Guid id, CollectionRequest request);
    Task<ApiResponse<string>> DeleteCollectionAsync(Guid userId, Guid id);
    Task<ApiResponse<IEnumerable<LinkResponse>>> GetCollectionLinksAsync(Guid userId, Guid collectionId);
    Task<ApiResponse<string>> AddLinkToCollectionAsync(Guid userId, Guid collectionId, Guid linkId);
    Task<ApiResponse<string>> RemoveLinkFromCollectionAsync(Guid userId, Guid collectionId, Guid linkId);
}
