using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.Extensions.DependencyInjection;
using LinkVault.Application.Interfaces;
using LinkVault.Application.Mapping;
using LinkVault.Application.Services;

namespace LinkVault.Application.Extensions;

public static class ServiceRegistration
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(MappingProfile));
        services.AddFluentValidationAutoValidation();
        services.AddValidatorsFromAssemblyContaining<MappingProfile>();

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ILinkService, LinkService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IAnalyticsService, AnalyticsService>();
        services.AddScoped<IRedirectService, RedirectService>();
        services.AddScoped<ISearchService, SearchService>();
        services.AddScoped<ITagService, TagService>();
        services.AddScoped<ICollectionService, CollectionService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IAdminService, AdminService>();
        services.AddScoped<IAuditService, AuditService>();
        services.AddScoped<IQrCodeService, QrCodeService>();
        services.AddScoped<IUserSettingService, UserSettingService>();

        return services;
    }
}
