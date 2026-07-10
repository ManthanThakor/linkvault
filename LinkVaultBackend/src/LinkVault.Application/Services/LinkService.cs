using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using LinkVault.Application.DTOs.Common;
using LinkVault.Application.DTOs.Link;
using LinkVault.Application.Exceptions;
using LinkVault.Application.Interfaces;
using LinkVault.Core.Entities;
using LinkVault.Core.Interfaces;

namespace LinkVault.Application.Services;

public class LinkService : ILinkService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<LinkService> _logger;
    private readonly IConfiguration _configuration;
    private readonly IQrCodeService _qrCodeService;

    public LinkService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<LinkService> logger, IConfiguration configuration, IQrCodeService qrCodeService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
        _configuration = configuration;
        _qrCodeService = qrCodeService;
    }

    public async Task<ApiResponse<PagedResponse<LinkResponse>>> GetLinksAsync(Guid userId, int page = 1, int pageSize = 10)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var totalCount = await linkRepo.CountAsync(l => l.UserId == userId);
        var links = await linkRepo.GetPagedAsync(page, pageSize, l => l.UserId == userId, l => l.CreatedAt, true);

        var response = new PagedResponse<LinkResponse>
        {
            Items = _mapper.Map<IEnumerable<LinkResponse>>(links),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };

        return ApiResponse<PagedResponse<LinkResponse>>.Ok(response);
    }

    public async Task<ApiResponse<LinkResponse>> GetLinkByIdAsync(Guid userId, Guid id)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var link = await linkRepo.FirstOrDefaultAsync(l => l.Id == id && l.UserId == userId);
        if (link == null)
            throw new NotFoundException(nameof(Link), id);

        var response = _mapper.Map<LinkResponse>(link);
        response.QrCodeUrl = _qrCodeService.GenerateQrCodeBase64($"{_configuration["BaseUrl"]}/{link.ShortCode}");
        return ApiResponse<LinkResponse>.Ok(response);
    }

    public async Task<ApiResponse<LinkResponse>> CreateLinkAsync(Guid userId, CreateLinkRequest request)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var shortCode = request.CustomAlias ?? GenerateShortCode();

        if (await linkRepo.AnyAsync(l => l.ShortCode == shortCode))
            throw new BadRequestException("Short code already in use");

        var link = new Link
        {
            UserId = userId,
            OriginalUrl = request.OriginalUrl,
            ShortCode = shortCode,
            Title = request.Title,
            Notes = request.Notes,
            CategoryId = request.CategoryId,
            CollectionId = request.CollectionId,
            ExpiryDate = request.ExpiryDate
        };

        if (!string.IsNullOrEmpty(request.Password))
            link.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        await linkRepo.AddAsync(link);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Link created: {ShortCode} -> {Url}", shortCode, request.OriginalUrl);

        var response = _mapper.Map<LinkResponse>(link);
        response.QrCodeUrl = _qrCodeService.GenerateQrCodeBase64($"{_configuration["BaseUrl"]}/{shortCode}");
        return ApiResponse<LinkResponse>.Ok(response, "Link created successfully");
    }

    public async Task<ApiResponse<LinkResponse>> UpdateLinkAsync(Guid userId, Guid id, UpdateLinkRequest request)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var link = await linkRepo.FirstOrDefaultAsync(l => l.Id == id && l.UserId == userId);
        if (link == null)
            throw new NotFoundException(nameof(Link), id);

        link.OriginalUrl = request.OriginalUrl;
        link.Title = request.Title;
        link.Notes = request.Notes;
        link.CategoryId = request.CategoryId;
        link.CollectionId = request.CollectionId;
        link.UpdatedAt = DateTime.UtcNow;

        linkRepo.Update(link);
        await _unitOfWork.SaveChangesAsync();

        var response = _mapper.Map<LinkResponse>(link);
        response.QrCodeUrl = _qrCodeService.GenerateQrCodeBase64($"{_configuration["BaseUrl"]}/{link.ShortCode}");
        return ApiResponse<LinkResponse>.Ok(response, "Link updated successfully");
    }

    public async Task<ApiResponse<string>> DeleteLinkAsync(Guid userId, Guid id)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var link = await linkRepo.FirstOrDefaultAsync(l => l.Id == id && l.UserId == userId);
        if (link == null)
            throw new NotFoundException(nameof(Link), id);

        linkRepo.Delete(link);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Ok("Link deleted successfully");
    }

    public async Task<ApiResponse<IEnumerable<LinkResponse>>> SearchLinksAsync(Guid userId, string query)
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

    public async Task<ApiResponse<PagedResponse<LinkResponse>>> FilterLinksAsync(Guid userId, string? filter, int page = 1, int pageSize = 10)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var now = DateTime.UtcNow;

        var predicate = filter?.ToLower() switch
        {
            "active" => (System.Linq.Expressions.Expression<Func<Link, bool>>)(l => l.UserId == userId && (l.ExpiryDate == null || l.ExpiryDate > now)),
            "expired" => l => l.UserId == userId && l.ExpiryDate != null && l.ExpiryDate <= now,
            "favorites" => l => l.UserId == userId && l.IsFavorite,
            _ => l => l.UserId == userId
        };

        var totalCount = await linkRepo.CountAsync(predicate);
        var links = await linkRepo.GetPagedAsync(page, pageSize, predicate, l => l.CreatedAt, true);

        var response = new PagedResponse<LinkResponse>
        {
            Items = _mapper.Map<IEnumerable<LinkResponse>>(links),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount
        };

        return ApiResponse<PagedResponse<LinkResponse>>.Ok(response);
    }

    public async Task<ApiResponse<LinkResponse>> GetLinkByShortCodeAsync(string shortCode)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var link = await linkRepo.FirstOrDefaultAsync(l => l.ShortCode == shortCode);
        if (link == null)
            throw new NotFoundException(nameof(Link), shortCode);

        var response = _mapper.Map<LinkResponse>(link);
        response.QrCodeUrl = _qrCodeService.GenerateQrCodeBase64($"{_configuration["BaseUrl"]}/{shortCode}");
        return ApiResponse<LinkResponse>.Ok(response);
    }

    public async Task<ApiResponse<string>> ToggleFavoriteAsync(Guid userId, Guid id)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var link = await linkRepo.FirstOrDefaultAsync(l => l.Id == id && l.UserId == userId);
        if (link == null)
            throw new NotFoundException(nameof(Link), id);

        link.IsFavorite = !link.IsFavorite;
        link.UpdatedAt = DateTime.UtcNow;
        linkRepo.Update(link);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Ok(link.IsFavorite ? "Added to favorites" : "Removed from favorites");
    }

    public async Task<ApiResponse<string>> SetPasswordAsync(Guid userId, Guid id, string password)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var link = await linkRepo.FirstOrDefaultAsync(l => l.Id == id && l.UserId == userId);
        if (link == null)
            throw new NotFoundException(nameof(Link), id);

        link.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
        link.UpdatedAt = DateTime.UtcNow;
        linkRepo.Update(link);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Ok("Password set successfully");
    }

    public async Task<ApiResponse<string>> RemovePasswordAsync(Guid userId, Guid id)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var link = await linkRepo.FirstOrDefaultAsync(l => l.Id == id && l.UserId == userId);
        if (link == null)
            throw new NotFoundException(nameof(Link), id);

        link.PasswordHash = null;
        link.UpdatedAt = DateTime.UtcNow;
        linkRepo.Update(link);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Ok("Password removed successfully");
    }

    public async Task<ApiResponse<string>> SetExpiryAsync(Guid userId, Guid id, DateTime? expiryDate)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var link = await linkRepo.FirstOrDefaultAsync(l => l.Id == id && l.UserId == userId);
        if (link == null)
            throw new NotFoundException(nameof(Link), id);

        link.ExpiryDate = expiryDate;
        link.UpdatedAt = DateTime.UtcNow;
        linkRepo.Update(link);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Ok("Expiry date set successfully");
    }

    public async Task<ApiResponse<string>> RemoveExpiryAsync(Guid userId, Guid id)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var link = await linkRepo.FirstOrDefaultAsync(l => l.Id == id && l.UserId == userId);
        if (link == null)
            throw new NotFoundException(nameof(Link), id);

        link.ExpiryDate = null;
        link.UpdatedAt = DateTime.UtcNow;
        linkRepo.Update(link);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Ok("Expiry date removed successfully");
    }

    private static string GenerateShortCode()
    {
        const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var random = new Random();
        return new string(Enumerable.Range(0, 7).Select(_ => chars[random.Next(chars.Length)]).ToArray());
    }
}
