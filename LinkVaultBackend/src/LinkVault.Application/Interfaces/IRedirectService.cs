using LinkVault.Application.DTOs.Common;

namespace LinkVault.Application.Interfaces;

public interface IRedirectService
{
    Task<ApiResponse<string>> GetOriginalUrlAsync(string shortCode, string? userAgent = null, string? ipAddress = null, string? referer = null);
    Task<ApiResponse<bool>> CheckLinkAsync(string shortCode);
    Task<ApiResponse<string>> VerifyPasswordAsync(string shortCode, string password, string? userAgent = null, string? ipAddress = null, string? referer = null);
}
