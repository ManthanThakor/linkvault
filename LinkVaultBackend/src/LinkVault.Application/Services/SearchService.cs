using AutoMapper;
using LinkVault.Application.DTOs.Common;
using LinkVault.Application.DTOs.Link;
using LinkVault.Application.Interfaces;
using LinkVault.Core.Entities;
using LinkVault.Core.Interfaces;

namespace LinkVault.Application.Services;

public class SearchService : ISearchService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public SearchService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<IEnumerable<LinkResponse>>> SearchAllAsync(Guid userId, string query)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var links = await linkRepo.FindAsync(l =>
            l.UserId == userId &&
            (l.Title != null && l.Title.Contains(query) ||
             l.OriginalUrl.Contains(query) ||
             l.ShortCode.Contains(query) ||
             l.Notes != null && l.Notes.Contains(query)));

        var response = _mapper.Map<IEnumerable<LinkResponse>>(links);
        return ApiResponse<IEnumerable<LinkResponse>>.Ok(response);
    }

    public async Task<ApiResponse<IEnumerable<LinkResponse>>> SearchByTitleAsync(Guid userId, string query)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var links = await linkRepo.FindAsync(l =>
            l.UserId == userId && l.Title != null && l.Title.Contains(query));

        var response = _mapper.Map<IEnumerable<LinkResponse>>(links);
        return ApiResponse<IEnumerable<LinkResponse>>.Ok(response);
    }

    public async Task<ApiResponse<IEnumerable<LinkResponse>>> SearchByUrlAsync(Guid userId, string query)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var links = await linkRepo.FindAsync(l =>
            l.UserId == userId && l.OriginalUrl.Contains(query));

        var response = _mapper.Map<IEnumerable<LinkResponse>>(links);
        return ApiResponse<IEnumerable<LinkResponse>>.Ok(response);
    }

    public async Task<ApiResponse<IEnumerable<LinkResponse>>> SearchByCategoryAsync(Guid userId, string categoryName)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var links = await linkRepo.FindAsync(l =>
            l.UserId == userId && l.Category != null && l.Category.Name.Contains(categoryName));

        var response = _mapper.Map<IEnumerable<LinkResponse>>(links);
        return ApiResponse<IEnumerable<LinkResponse>>.Ok(response);
    }

    public async Task<ApiResponse<IEnumerable<LinkResponse>>> SearchByNotesAsync(Guid userId, string query)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var links = await linkRepo.FindAsync(l =>
            l.UserId == userId && l.Notes != null && l.Notes.Contains(query));

        var response = _mapper.Map<IEnumerable<LinkResponse>>(links);
        return ApiResponse<IEnumerable<LinkResponse>>.Ok(response);
    }
}
