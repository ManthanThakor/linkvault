namespace LinkVault.Application.DTOs.Notification;

public class MarkAsReadRequest
{
    public List<Guid> NotificationIds { get; set; } = new();
}
