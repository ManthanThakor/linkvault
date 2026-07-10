using LinkVault.Application.DTOs.Common;
using LinkVault.Application.DTOs.UserSetting;

namespace LinkVault.Application.Interfaces;

public interface IUserSettingService
{
    Task<ApiResponse<UserSettingResponse>> GetSettingsAsync(Guid userId);
    Task<ApiResponse<UserSettingResponse>> UpdateSettingsAsync(Guid userId, UpdateUserSettingRequest request);
}
