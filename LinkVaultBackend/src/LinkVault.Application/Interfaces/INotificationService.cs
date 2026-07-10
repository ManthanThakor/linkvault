using LinkVault.Application.DTOs.Common;
using LinkVault.Application.DTOs.Notification;

namespace LinkVault.Application.Interfaces;

public interface INotificationService
{
    Task<ApiResponse<IEnumerable<NotificationResponse>>> GetNotificationsAsync(Guid userId, bool unreadOnly = false);
    Task<ApiResponse<int>> GetUnreadCountAsync(Guid userId);
    Task<ApiResponse<string>> MarkAsReadAsync(Guid userId, MarkAsReadRequest request);
    Task<ApiResponse<string>> MarkAllAsReadAsync(Guid userId);
    Task<ApiResponse<string>> DeleteNotificationAsync(Guid userId, Guid id);
}
