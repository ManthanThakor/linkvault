using AutoMapper;
using Microsoft.Extensions.Logging;
using LinkVault.Application.DTOs.Common;
using LinkVault.Application.DTOs.Tag;
using LinkVault.Application.Exceptions;
using LinkVault.Application.Interfaces;
using LinkVault.Core.Entities;
using LinkVault.Core.Interfaces;

namespace LinkVault.Application.Services;

public class TagService : ITagService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<TagService> _logger;

    public TagService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<TagService> logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<ApiResponse<IEnumerable<TagResponse>>> GetTagsAsync(Guid userId)
    {
        var tagRepo = _unitOfWork.Repository<Tag>();
        var tags = await tagRepo.FindAsync(t => t.UserId == userId);
        var response = _mapper.Map<IEnumerable<TagResponse>>(tags);
        return ApiResponse<IEnumerable<TagResponse>>.Ok(response);
    }

    public async Task<ApiResponse<TagResponse>> GetTagByIdAsync(Guid userId, Guid id)
    {
        var tagRepo = _unitOfWork.Repository<Tag>();
        var tag = await tagRepo.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        if (tag == null)
            throw new NotFoundException(nameof(Tag), id);

        var response = _mapper.Map<TagResponse>(tag);
        return ApiResponse<TagResponse>.Ok(response);
    }

    public async Task<ApiResponse<TagResponse>> CreateTagAsync(Guid userId, TagRequest request)
    {
        var tagRepo = _unitOfWork.Repository<Tag>();
        if (await tagRepo.AnyAsync(t => t.UserId == userId && t.Name == request.Name))
            throw new BadRequestException("Tag name already exists");

        var tag = new Tag
        {
            UserId = userId,
            Name = request.Name,
            Color = request.Color
        };

        await tagRepo.AddAsync(tag);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Tag created: {Name} for user {UserId}", request.Name, userId);

        var response = _mapper.Map<TagResponse>(tag);
        return ApiResponse<TagResponse>.Ok(response, "Tag created successfully");
    }

    public async Task<ApiResponse<TagResponse>> UpdateTagAsync(Guid userId, Guid id, TagRequest request)
    {
        var tagRepo = _unitOfWork.Repository<Tag>();
        var tag = await tagRepo.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        if (tag == null)
            throw new NotFoundException(nameof(Tag), id);

        if (await tagRepo.AnyAsync(t => t.UserId == userId && t.Name == request.Name && t.Id != id))
            throw new BadRequestException("Tag name already exists");

        tag.Name = request.Name;
        tag.Color = request.Color;
        tag.UpdatedAt = DateTime.UtcNow;
        tagRepo.Update(tag);
        await _unitOfWork.SaveChangesAsync();

        var response = _mapper.Map<TagResponse>(tag);
        return ApiResponse<TagResponse>.Ok(response, "Tag updated successfully");
    }

    public async Task<ApiResponse<string>> DeleteTagAsync(Guid userId, Guid id)
    {
        var tagRepo = _unitOfWork.Repository<Tag>();
        var tag = await tagRepo.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
        if (tag == null)
            throw new NotFoundException(nameof(Tag), id);

        tagRepo.Delete(tag);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Ok("Tag deleted successfully");
    }

    public async Task<ApiResponse<IEnumerable<TagResponse>>> GetLinkTagsAsync(Guid linkId)
    {
        var linkTagRepo = _unitOfWork.Repository<LinkTag>();
        var linkTags = await linkTagRepo.FindAsync(lt => lt.LinkId == linkId);
        var tags = linkTags.Select(lt => lt.Tag).ToList();
        var response = _mapper.Map<IEnumerable<TagResponse>>(tags);
        return ApiResponse<IEnumerable<TagResponse>>.Ok(response);
    }

    public async Task<ApiResponse<string>> AddTagToLinkAsync(Guid userId, Guid linkId, Guid tagId)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var link = await linkRepo.FirstOrDefaultAsync(l => l.Id == linkId && l.UserId == userId);
        if (link == null)
            throw new NotFoundException(nameof(Link), linkId);

        var tagRepo = _unitOfWork.Repository<Tag>();
        var tag = await tagRepo.FirstOrDefaultAsync(t => t.Id == tagId && t.UserId == userId);
        if (tag == null)
            throw new NotFoundException(nameof(Tag), tagId);

        var linkTagRepo = _unitOfWork.Repository<LinkTag>();
        if (await linkTagRepo.AnyAsync(lt => lt.LinkId == linkId && lt.TagId == tagId))
            throw new BadRequestException("Tag already added to this link");

        var linkTag = new LinkTag { LinkId = linkId, TagId = tagId };
        await linkTagRepo.AddAsync(linkTag);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Ok("Tag added to link successfully");
    }

    public async Task<ApiResponse<string>> RemoveTagFromLinkAsync(Guid userId, Guid linkId, Guid tagId)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var link = await linkRepo.FirstOrDefaultAsync(l => l.Id == linkId && l.UserId == userId);
        if (link == null)
            throw new NotFoundException(nameof(Link), linkId);

        var linkTagRepo = _unitOfWork.Repository<LinkTag>();
        var linkTag = await linkTagRepo.FirstOrDefaultAsync(lt => lt.LinkId == linkId && lt.TagId == tagId);
        if (linkTag == null)
            throw new NotFoundException("LinkTag", $"{linkId}/{tagId}");

        linkTagRepo.Delete(linkTag);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Ok("Tag removed from link successfully");
    }
}
