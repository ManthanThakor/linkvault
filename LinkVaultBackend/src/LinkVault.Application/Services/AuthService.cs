using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using LinkVault.Application.DTOs.Auth;
using LinkVault.Application.DTOs.Common;
using LinkVault.Application.DTOs.Profile;
using LinkVault.Application.Exceptions;
using LinkVault.Application.Interfaces;
using LinkVault.Core.Entities;
using LinkVault.Core.Enums;
using LinkVault.Core.Interfaces;

namespace LinkVault.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;
    private readonly IAuditService _auditService;
    private readonly IQrCodeService _qrCodeService;

    public AuthService(IUnitOfWork unitOfWork, IMapper mapper, IConfiguration configuration, ILogger<AuthService> logger, IAuditService auditService, IQrCodeService qrCodeService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _configuration = configuration;
        _logger = logger;
        _auditService = auditService;
        _qrCodeService = qrCodeService;
    }

    public async Task<ApiResponse<AuthResponse>> RegisterAsync(RegisterRequest request)
    {
        var userRepo = _unitOfWork.Repository<User>();

        if (await userRepo.AnyAsync(u => u.Email == request.Email))
            throw new BadRequestException("Email already registered");

        var user = new User
        {
            Name = request.Name,
            Email = request.Email,
            PasswordHash = HashPassword(request.Password),
            EmailVerificationToken = GenerateToken()
        };

        await userRepo.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("User registered: {Email}", user.Email);

        await _auditService.LogAsync(user.Id, user.Email, AuditAction.Register, nameof(User), user.Id.ToString(), ipAddress: null);

        var (token, expiresAt) = GenerateJwtToken(user);
        var refreshToken = await GenerateRefreshToken(user.Id);

        var response = _mapper.Map<AuthResponse>(user);
        response.Token = token;
        response.RefreshToken = refreshToken.Token;
        response.ExpiresAt = expiresAt;

        return ApiResponse<AuthResponse>.Ok(response, "Registration successful. Please verify your email.");
    }

    public async Task<ApiResponse<AuthResponse>> LoginAsync(LoginRequest request)
    {
        var userRepo = _unitOfWork.Repository<User>();
        var user = await userRepo.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null || !VerifyPassword(request.Password, user.PasswordHash))
            throw new UnauthorizedException("Invalid email or password");

        user.LastLoginAt = DateTime.UtcNow;
        userRepo.Update(user);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("User logged in: {Email}", user.Email);

        await _auditService.LogAsync(user.Id, user.Email, AuditAction.Login, nameof(User), user.Id.ToString());

        var (token, expiresAt) = GenerateJwtToken(user);
        var refreshToken = await GenerateRefreshToken(user.Id);

        var response = _mapper.Map<AuthResponse>(user);
        response.Token = token;
        response.RefreshToken = refreshToken.Token;
        response.ExpiresAt = expiresAt;

        return ApiResponse<AuthResponse>.Ok(response, "Login successful");
    }

    public async Task<ApiResponse<string>> LogoutAsync(Guid userId)
    {
        var refreshTokenRepo = _unitOfWork.Repository<RefreshToken>();
        var tokens = await refreshTokenRepo.FindAsync(rt => rt.UserId == userId && !rt.IsRevoked);
        foreach (var token in tokens)
        {
            token.IsRevoked = true;
            refreshTokenRepo.Update(token);
        }
        await _unitOfWork.SaveChangesAsync();

        await _auditService.LogAsync(userId, null, AuditAction.Logout, nameof(User), userId.ToString());

        return ApiResponse<string>.Ok("Logged out successfully");
    }

    public async Task<ApiResponse<AuthResponse>> RefreshTokenAsync(RefreshTokenRequest request)
    {
        var refreshTokenRepo = _unitOfWork.Repository<RefreshToken>();
        var storedToken = await refreshTokenRepo.FirstOrDefaultAsync(rt => rt.Token == request.RefreshToken && !rt.IsRevoked);

        if (storedToken == null || storedToken.ExpiryDate < DateTime.UtcNow)
            throw new UnauthorizedException("Invalid or expired refresh token");

        storedToken.IsRevoked = true;
        refreshTokenRepo.Update(storedToken);

        var userRepo = _unitOfWork.Repository<User>();
        var user = await userRepo.GetByIdAsync(storedToken.UserId);
        if (user == null)
            throw new NotFoundException(nameof(User), storedToken.UserId);

        var (token, expiresAt) = GenerateJwtToken(user);
        var newRefreshToken = await GenerateRefreshToken(user.Id);

        await _unitOfWork.SaveChangesAsync();

        var response = _mapper.Map<AuthResponse>(user);
        response.Token = token;
        response.RefreshToken = newRefreshToken.Token;
        response.ExpiresAt = expiresAt;

        return ApiResponse<AuthResponse>.Ok(response, "Token refreshed successfully");
    }

    public async Task<ApiResponse<ProfileResponse>> GetCurrentUserAsync(Guid userId)
    {
        var userRepo = _unitOfWork.Repository<User>();
        var user = await userRepo.GetByIdAsync(userId);
        if (user == null)
            throw new NotFoundException(nameof(User), userId);

        var response = _mapper.Map<ProfileResponse>(user);
        return ApiResponse<ProfileResponse>.Ok(response);
    }

    public async Task<ApiResponse<string>> ChangePasswordAsync(Guid userId, ChangePasswordRequest request)
    {
        var userRepo = _unitOfWork.Repository<User>();
        var user = await userRepo.GetByIdAsync(userId);
        if (user == null)
            throw new NotFoundException(nameof(User), userId);

        if (!VerifyPassword(request.CurrentPassword, user.PasswordHash))
            throw new BadRequestException("Current password is incorrect");

        user.PasswordHash = HashPassword(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;
        userRepo.Update(user);
        await _unitOfWork.SaveChangesAsync();

        await _auditService.LogAsync(userId, user.Email, AuditAction.PasswordChange, nameof(User), userId.ToString());

        return ApiResponse<string>.Ok("Password changed successfully");
    }

    public async Task<ApiResponse<ProfileResponse>> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
    {
        var userRepo = _unitOfWork.Repository<User>();
        var user = await userRepo.GetByIdAsync(userId);
        if (user == null)
            throw new NotFoundException(nameof(User), userId);

        user.Name = request.Name;
        user.UpdatedAt = DateTime.UtcNow;
        userRepo.Update(user);
        await _unitOfWork.SaveChangesAsync();

        var response = _mapper.Map<ProfileResponse>(user);
        return ApiResponse<ProfileResponse>.Ok(response);
    }

    public async Task<ApiResponse<string>> DeleteAccountAsync(Guid userId)
    {
        var userRepo = _unitOfWork.Repository<User>();
        var user = await userRepo.GetByIdAsync(userId);
        if (user == null)
            throw new NotFoundException(nameof(User), userId);

        userRepo.Delete(user);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Ok("Account deleted successfully");
    }

    public async Task<ApiResponse<string>> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        var userRepo = _unitOfWork.Repository<User>();
        var user = await userRepo.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null)
            return ApiResponse<string>.Ok("If the email exists, a reset link has been sent.");

        user.ResetPasswordToken = GenerateToken();
        user.ResetPasswordTokenExpiry = DateTime.UtcNow.AddHours(1);
        userRepo.Update(user);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("Password reset requested for {Email}", request.Email);
        return ApiResponse<string>.Ok("If the email exists, a reset link has been sent.");
    }

    public async Task<ApiResponse<string>> ResetPasswordAsync(ResetPasswordRequest request)
    {
        var userRepo = _unitOfWork.Repository<User>();
        var user = await userRepo.FirstOrDefaultAsync(u => u.Email == request.Email && u.ResetPasswordToken == request.Token);
        if (user == null || user.ResetPasswordTokenExpiry < DateTime.UtcNow)
            throw new BadRequestException("Invalid or expired reset token");

        user.PasswordHash = HashPassword(request.NewPassword);
        user.ResetPasswordToken = null;
        user.ResetPasswordTokenExpiry = null;
        user.UpdatedAt = DateTime.UtcNow;
        userRepo.Update(user);
        await _unitOfWork.SaveChangesAsync();

        await _auditService.LogAsync(user.Id, user.Email, AuditAction.ResetPassword, nameof(User), user.Id.ToString());

        return ApiResponse<string>.Ok("Password reset successfully");
    }

    public async Task<ApiResponse<string>> VerifyEmailAsync(VerifyEmailRequest request)
    {
        var userRepo = _unitOfWork.Repository<User>();
        var user = await userRepo.FirstOrDefaultAsync(u => u.EmailVerificationToken == request.Token);
        if (user == null)
            throw new BadRequestException("Invalid verification token");

        user.EmailVerified = true;
        user.EmailVerificationToken = null;
        user.UpdatedAt = DateTime.UtcNow;
        userRepo.Update(user);
        await _unitOfWork.SaveChangesAsync();

        await _auditService.LogAsync(user.Id, user.Email, AuditAction.EmailVerify, nameof(User), user.Id.ToString());

        return ApiResponse<string>.Ok("Email verified successfully");
    }

    public async Task<ApiResponse<string>> ResendVerificationEmailAsync(string email)
    {
        var userRepo = _unitOfWork.Repository<User>();
        var user = await userRepo.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
            return ApiResponse<string>.Ok("If the email exists, a verification link has been sent.");

        if (user.EmailVerified)
            throw new BadRequestException("Email is already verified");

        user.EmailVerificationToken = GenerateToken();
        userRepo.Update(user);
        await _unitOfWork.SaveChangesAsync();

        return ApiResponse<string>.Ok("If the email exists, a verification link has been sent.");
    }

    private (string token, DateTime expiresAt) GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Secret"]!));
        var expiresAt = DateTime.UtcNow.AddMinutes(double.Parse(jwtSettings["ExpiryInMinutes"]!));

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Name),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: expiresAt,
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return (new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }

    private async Task<RefreshToken> GenerateRefreshToken(Guid userId)
    {
        var refreshTokenRepo = _unitOfWork.Repository<RefreshToken>();
        var token = new RefreshToken
        {
            UserId = userId,
            Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
            ExpiryDate = DateTime.UtcNow.AddDays(7)
        };

        await refreshTokenRepo.AddAsync(token);
        await _unitOfWork.SaveChangesAsync();
        return token;
    }

    private static string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    private static bool VerifyPassword(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }

    private static string GenerateToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(32))
            .Replace("/", "").Replace("+", "").Replace("=", "");
    }
}
