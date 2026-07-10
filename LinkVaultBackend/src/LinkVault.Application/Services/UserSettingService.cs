using AutoMapper;
using LinkVault.Application.DTOs.Common;
using LinkVault.Application.DTOs.UserSetting;
using LinkVault.Application.Interfaces;
using LinkVault.Core.Entities;
using LinkVault.Core.Interfaces;

namespace LinkVault.Application.Services;

public class UserSettingService : IUserSettingService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UserSettingService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<ApiResponse<UserSettingResponse>> GetSettingsAsync(Guid userId)
    {
        var settingRepo = _unitOfWork.Repository<UserSetting>();
        var settings = await settingRepo.FirstOrDefaultAsync(s => s.UserId == userId);
        if (settings == null)
        {
            settings = new UserSetting { UserId = userId };
            await settingRepo.AddAsync(settings);
            await _unitOfWork.SaveChangesAsync();
        }

        var response = _mapper.Map<UserSettingResponse>(settings);
        return ApiResponse<UserSettingResponse>.Ok(response);
    }

    public async Task<ApiResponse<UserSettingResponse>> UpdateSettingsAsync(Guid userId, UpdateUserSettingRequest request)
    {
        var settingRepo = _unitOfWork.Repository<UserSetting>();
        var settings = await settingRepo.FirstOrDefaultAsync(s => s.UserId == userId);
        if (settings == null)
        {
            settings = new UserSetting { UserId = userId };
            await settingRepo.AddAsync(settings);
        }

        if (request.Theme != null) settings.Theme = request.Theme;
        if (request.Language != null) settings.Language = request.Language;
        if (request.EmailNotifications.HasValue) settings.EmailNotifications = request.EmailNotifications.Value;
        if (request.LinkExpiryNotifications.HasValue) settings.LinkExpiryNotifications = request.LinkExpiryNotifications.Value;
        if (request.ClickNotifications.HasValue) settings.ClickNotifications = request.ClickNotifications.Value;
        if (request.DefaultLinkExpiryDays.HasValue) settings.DefaultLinkExpiryDays = request.DefaultLinkExpiryDays.Value;
        if (request.DefaultShortCodeLength != null) settings.DefaultShortCodeLength = request.DefaultShortCodeLength;

        settings.UpdatedAt = DateTime.UtcNow;
        settingRepo.Update(settings);
        await _unitOfWork.SaveChangesAsync();

        var response = _mapper.Map<UserSettingResponse>(settings);
        return ApiResponse<UserSettingResponse>.Ok(response, "Settings updated successfully");
    }
}
