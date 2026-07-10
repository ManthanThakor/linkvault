using AutoMapper;
using Microsoft.Extensions.Logging;
using LinkVault.Application.DTOs.Common;
using LinkVault.Application.DTOs.Notification;
using LinkVault.Application.Exceptions;
using LinkVault.Application.Interfaces;
using LinkVault.Core.Entities;
using LinkVault.Core.Interfaces;

namespace LinkVault.Application.Services;

public class NotificationService : INotificationService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(IUnitOfWork unitOfWork, IMapper mapper, ILogger<NotificationService> logger)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<ApiResponse<IEnumerable<NotificationResponse>>> GetNotificationsAsync(Guid userId, bool unreadOnly = false)
    {
        var notifRepo = _unitOfWork.Repository<Notification>();
        IEnumerable<Notification> notifications;
        if (unreadOnly)
            notifications = await notifRepo.FindAsync(n => n.UserId == userId && !n.IsRead);
        else
            notifications = await notifRepo.FindAsync(n => n.UserId == userId);

        notifications = notifications.OrderByDescending(n => n.CreatedAt);
        var response = _mapper.Map<IEnumerable<NotificationResponse>>(notifications);
        return ApiResponse<IEnumerable<NotificationResponse>>.Ok(response);
    }

    public async Task<ApiResponse<int>> GetUnreadCountAsync(Guid userId)
    {
        var notifRepo = _unitOfWork.Repository<Notification>();
        var count = await notifRepo.CountAsync(n => n.UserId == userId && !n.IsRead);
        return ApiResponse<int>.Ok(count);
    }

    public async Task<ApiResponse<string>> MarkAsReadAsync(Guid userId, MarkAsReadRequest request)
    {
        var notifRepo = _unitOfWork.Repository<Notification>();
        var notifications = await notifRepo.FindAsync(n => n.UserId == userId && request.NotificationIds.Contains(n.Id));
        foreach (var notification in notifications)
        {
            notification.IsRead = true;
            notifRepo.Update(notification);
        }
        await _unitOfWork.SaveChangesAsync();
        return ApiResponse<string>.Ok("Notifications marked as read");
    }

    public async Task<ApiResponse<string>> MarkAllAsReadAsync(Guid userId)
    {
        var notifRepo = _unitOfWork.Repository<Notification>();
        var notifications = await notifRepo.FindAsync(n => n.UserId == userId && !n.IsRead);
        foreach (var notification in notifications)
        {
            notification.IsRead = true;
            notifRepo.Update(notification);
        }
        await _unitOfWork.SaveChangesAsync();
        return ApiResponse<string>.Ok("All notifications marked as read");
    }

    public async Task<ApiResponse<string>> DeleteNotificationAsync(Guid userId, Guid id)
    {
        var notifRepo = _unitOfWork.Repository<Notification>();
        var notification = await notifRepo.FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
        if (notification == null)
            throw new NotFoundException(nameof(Notification), id);

        notifRepo.Delete(notification);
        await _unitOfWork.SaveChangesAsync();
        return ApiResponse<string>.Ok("Notification deleted");
    }
}
