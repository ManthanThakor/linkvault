using AutoMapper;
using Microsoft.Extensions.Logging;
using LinkVault.Application.DTOs.Category;
using LinkVault.Application.DTOs.Common;
using LinkVault.Application.DTOs.Link;
using LinkVault.Application.Exceptions;
using LinkVault.Application.Interfaces;
using LinkVault.Core.Entities;
using LinkVault.Core.Interfaces;

namespace LinkVault.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<CategoryService> _logger;

    public CategoryService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<CategoryService> logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<ApiResponse<IEnumerable<CategoryResponse>>> GetCategoriesAsync(Guid userId)
    {
        var categoryRepo = _unitOfWork.Repository<Category>();
        var categories = await categoryRepo.FindAsync(c => c.UserId == userId);
        var response = _mapper.Map<IEnumerable<CategoryResponse>>(categories);
        return ApiResponse<IEnumerable<CategoryResponse>>.Ok(response);
    }

    public async Task<ApiResponse<CategoryResponse>> GetCategoryByIdAsync(Guid userId, Guid id)
    {
        var categoryRepo = _unitOfWork.Repository<Category>();
        var category = await categoryRepo.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (category == null)
            throw new NotFoundException(nameof(Category), id);

        var response = _mapper.Map<CategoryResponse>(category);
        return ApiResponse<CategoryResponse>.Ok(response);
    }

    public async Task<ApiResponse<CategoryResponse>> CreateCategoryAsync(Guid userId, CategoryRequest request)
    {
        var categoryRepo = _unitOfWork.Repository<Category>();
        if (await categoryRepo.AnyAsync(c => c.UserId == userId && c.Name == request.Name))
            throw new BadRequestException("Category name already exists");

        var category = new Category
        {
            UserId = userId,
            Name = request.Name
        };

        await categoryRepo.AddAsync(category);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Category created: {Name} for user {UserId}", request.Name, userId);

        var response = _mapper.Map<CategoryResponse>(category);
        return ApiResponse<CategoryResponse>.Ok(response, "Category created successfully");
    }

    public async Task<ApiResponse<CategoryResponse>> UpdateCategoryAsync(Guid userId, Guid id, CategoryRequest request)
    {
        var categoryRepo = _unitOfWork.Repository<Category>();
        var category = await categoryRepo.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (category == null)
            throw new NotFoundException(nameof(Category), id);

        if (await categoryRepo.AnyAsync(c => c.UserId == userId && c.Name == request.Name && c.Id != id))
            throw new BadRequestException("Category name already exists");

        category.Name = request.Name;
        categoryRepo.Update(category);
        await _unitOfWork.SaveChangesAsync();

        var response = _mapper.Map<CategoryResponse>(category);
        return ApiResponse<CategoryResponse>.Ok(response, "Category updated successfully");
    }

    public async Task<ApiResponse<string>> DeleteCategoryAsync(Guid userId, Guid id)
    {
        var categoryRepo = _unitOfWork.Repository<Category>();
        var category = await categoryRepo.FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);
        if (category == null)
            throw new NotFoundException(nameof(Category), id);

        categoryRepo.Delete(category);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Ok("Category deleted successfully");
    }

    public async Task<ApiResponse<IEnumerable<LinkResponse>>> GetCategoryLinksAsync(Guid userId, Guid categoryId)
    {
        var linkRepo = _unitOfWork.Repository<Link>();
        var links = await linkRepo.FindAsync(l => l.UserId == userId && l.CategoryId == categoryId);
        var response = _mapper.Map<IEnumerable<LinkResponse>>(links);
        return ApiResponse<IEnumerable<LinkResponse>>.Ok(response);
    }
}
