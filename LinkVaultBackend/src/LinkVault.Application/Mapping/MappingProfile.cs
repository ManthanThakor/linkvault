using AutoMapper;
using LinkVault.Core.Entities;
using LinkVault.Application.DTOs.Auth;
using LinkVault.Application.DTOs.Link;
using LinkVault.Application.DTOs.Category;
using LinkVault.Application.DTOs.Dashboard;
using LinkVault.Application.DTOs.Analytics;
using LinkVault.Application.DTOs.Profile;
using LinkVault.Application.DTOs.Tag;
using LinkVault.Application.DTOs.Collection;
using LinkVault.Application.DTOs.Notification;
using LinkVault.Application.DTOs.UserSetting;
using LinkVault.Application.DTOs.Admin;

namespace LinkVault.Application.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, AuthResponse>()
            .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));

        CreateMap<User, ProfileResponse>()
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()));

        CreateMap<Link, LinkResponse>()
            .ForMember(dest => dest.ShortUrl, opt => opt.MapFrom(src => $"/{src.ShortCode}"))
            .ForMember(dest => dest.HasPassword, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.PasswordHash)))
            .ForMember(dest => dest.IsExpired, opt => opt.MapFrom(src => src.ExpiryDate != null && src.ExpiryDate < DateTime.UtcNow))
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null))
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.LinkTags != null ? src.LinkTags.Where(lt => lt.Tag != null).Select(lt => lt.Tag.Name).ToList() : new List<string>()));

        CreateMap<Category, CategoryResponse>()
            .ForMember(dest => dest.LinkCount, opt => opt.MapFrom(src => src.Links.Count));

        CreateMap<Tag, TagResponse>()
            .ForMember(dest => dest.LinkCount, opt => opt.MapFrom(src => src.LinkTags.Count));

        CreateMap<Collection, CollectionResponse>()
            .ForMember(dest => dest.LinkCount, opt => opt.MapFrom(src => src.Links.Count));

        CreateMap<Notification, NotificationResponse>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()));

        CreateMap<UserSetting, UserSettingResponse>();

        CreateMap<User, UserManagementResponse>()
            .ForMember(dest => dest.Role, opt => opt.MapFrom(src => src.Role.ToString()))
            .ForMember(dest => dest.LinkCount, opt => opt.Ignore())
            .ForMember(dest => dest.TotalClicks, opt => opt.Ignore());

        CreateMap<AuditLog, AuditLogResponse>()
            .ForMember(dest => dest.Action, opt => opt.MapFrom(src => src.Action.ToString()));

        CreateMap<Link, LinkAnalytics>();
        CreateMap<Category, CategoryAnalytics>()
            .ForMember(dest => dest.CategoryId, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Name));
    }
}
