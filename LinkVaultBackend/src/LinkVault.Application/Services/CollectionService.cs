using AutoMapper;
using Microsoft.Extensions.Logging;
using LinkVault.Application.DTOs.Collection;
using LinkVault.Application.DTOs.Common;
using LinkVault.Application.DTOs.Link;
using LinkVault.Application.Exceptions;
using LinkVault.Application.Interfaces;
using LinkVault.Core.Entities;
using LinkVault.Core.Interfaces;

namespace LinkVault.Application.Services;

public class CollectionService : ICollectionService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<CollectionService> _logger;

    public CollectionService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<CollectionService> logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<ApiResponse<IEnumerable<CollectionResponse>>> GetCollectionsAsync(Guid userId)
    {
        var collectionRepo = _unitOfWork.Repository<Collection>();
        var collections = await collectionRepo.FindAsync(c => c.UserId == userId);
        var response = _mapper.Map<IEnumerable<CollectionResponse>>(collections);
        return ApiResponse<IEnumerable<CollectionResponse>>.Ok(response);
    }

    public async Task<ApiResponse<CollectionResponse>> GetCollectionByIdAsync(Guid userId, Guid id)
    {
        var collectionRepo = _unitOfWork.Repository<Collection>();
        var collection = await collectionRepo.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (collection == null)
            throw new NotFoundException(nameof(Collection), id);

        var response = _mapper.Map<CollectionResponse>(collection);
        return ApiResponse<CollectionResponse>.Ok(response);
    }

    public async Task<ApiResponse<CollectionResponse>> CreateCollectionAsync(Guid userId, CollectionRequest request)
    {
        var collectionRepo = _unitOfWork.Repository<Collection>();
        if (await collectionRepo.AnyAsync(c => c.UserId == userId && c.Name == request.Name))
            throw new BadRequestException("Collection name already exists");

        var collection = new Collection
        {
            UserId = userId,
            Name = request.Name,
            Description = request.Description,
            Icon = request.Icon
        };

        await collectionRepo.AddAsync(collection);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Collection created: {Name} for user {UserId}", request.Name, userId);

        var response = _mapper.Map<CollectionResponse>(collection);
        return ApiResponse<CollectionResponse>.Ok(response, "Collection created successfully");
    }

    public async Task<ApiResponse<CollectionResponse>> UpdateCollectionAsync(Guid userId, Guid id, CollectionRequest request)
    {
        var collectionRepo = _unitOfWork.Repository<Collection>();
        var collection = await collectionRepo.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (collection == null)
            throw new NotFoundException(nameof(Collection), id);

        if (await collectionRepo.AnyAsync(c => c.UserId == userId && c.Name == request.Name && c.Id != id))
            throw new BadRequestException("Collection name already exists");

        collection.Name = request.Name;
        collection.Description = request.Description;
        collection.Icon = request.Icon;
        collection.UpdatedAt = DateTime.UtcNow;
        collectionRepo.Update(collection);
        await _unitOfWork.SaveChangesAsync();

        var response = _mapper.Map<CollectionResponse>(collection);
        return ApiResponse<CollectionResponse>.Ok(response, "Collection updated successfully");
    }

    public async Task<ApiResponse<string>> DeleteCollectionAsync(Guid userId, Guid id)
    {
        var collectionRepo = _unitOfWork.Repository<Collection>();
        var collection = await collectionRepo.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (collection == null)
            throw new NotFoundException(nameof(Collection), id);

        collectionRepo.Delete(collection);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Ok("Collection deleted successfully");
    }

    public async Task<ApiResponse<IEnumerable<LinkResponse>>> GetCollectionLinksAsync(Guid userId, Guid collectionId)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var links = await linkRepo.FindAsync(l => l.UserId == userId && l.CollectionId == collectionId);
        var response = _mapper.Map<IEnumerable<LinkResponse>>(links);
        return ApiResponse<IEnumerable<LinkResponse>>.Ok(response);
    }

    public async Task<ApiResponse<string>> AddLinkToCollectionAsync(Guid userId, Guid collectionId, Guid linkId)
    {
        var collectionRepo = _unitOfWork.Repository<Collection>();
        var collection = await collectionRepo.FirstOrDefaultAsync(c => c.Id == collectionId && c.UserId == userId);
        if (collection == null)
            throw new NotFoundException(nameof(Collection), collectionId);

        var linkRepo = _unitOfWork.Repository<Link>();
        var link = await linkRepo.FirstOrDefaultAsync(l => l.Id == linkId && l.UserId == userId);
        if (link == null)
            throw new NotFoundException(nameof(Link), linkId);

        link.CollectionId = collectionId;
        link.UpdatedAt = DateTime.UtcNow;
        linkRepo.Update(link);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Ok("Link added to collection successfully");
    }

    public async Task<ApiResponse<string>> RemoveLinkFromCollectionAsync(Guid userId, Guid collectionId, Guid linkId)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var link = await linkRepo.FirstOrDefaultAsync(l => l.Id == linkId && l.UserId == userId && l.CollectionId == collectionId);
        if (link == null)
            throw new NotFoundException(nameof(Link), linkId);

        link.CollectionId = null;
        link.UpdatedAt = DateTime.UtcNow;
        linkRepo.Update(link);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Ok("Link removed from collection successfully");
    }
}
