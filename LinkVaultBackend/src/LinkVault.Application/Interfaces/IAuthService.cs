using LinkVault.Application.DTOs.Auth;
using LinkVault.Application.DTOs.Common;
using LinkVault.Application.DTOs.Profile;

namespace LinkVault.Application.Interfaces;

public interface IAuthService
{
    Task<ApiResponse<AuthResponse>> RegisterAsync(RegisterRequest request);
    Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request);
    Task<ApiResponse<string>> LogoutAsync(Guid userId);
    Task<ApiResponse<AuthResponse>> RefreshTokenAsync(RefreshTokenRequest request);
    Task<ApiResponse<ProfileResponse>> GetCurrentUserAsync(Guid userId);
    Task<ApiResponse<string>> ChangePasswordAsync(Guid userId, ChangePasswordRequest request);
    Task<ApiResponse<ProfileResponse>> UpdateProfileAsync(Guid userId, UpdateProfileRequest request);
    Task<ApiResponse<string>> DeleteAccountAsync(Guid userId);
    Task<ApiResponse<string>> ForgotPasswordAsync(ForgotPasswordRequest request);
    Task<ApiResponse<string>> ResetPasswordAsync(ResetPasswordRequest request);
    Task<ApiResponse<string>> VerifyEmailAsync(VerifyEmailRequest request);
    Task<ApiResponse<string>> ResendVerificationEmailAsync(string email);
}
