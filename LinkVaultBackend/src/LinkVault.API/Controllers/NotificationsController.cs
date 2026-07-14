using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using LinkVault.Application.DTOs.Notification;
using LinkVault.Application.Interfaces;

namespace LinkVault.API.Controllers;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications([FromQuery] bool unreadOnly = false)
    {
        var userId = GetUserId();
        var result = await _notificationService.GetNotificationsAsync(userId, unreadOnly);
        return Ok(result);
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        var userId = GetUserId();
        var result = await _notificationService.GetUnreadCountAsync(userId);
        return Ok(result);
    }

    [HttpPut("mark-read")]
    public async Task<IActionResult> MarkAsRead([FromBody] MarkAsReadRequest request)
    {
        var userId = GetUserId();
        var result = await _notificationService.MarkAsReadAsync(userId, request);
        return Ok(result);
    }

    [HttpPut("mark-all-read")]
    public async Task<IActionResult> MarkAllAsRead()
    {
        var userId = GetUserId();
        var result = await _notificationService.MarkAllAsReadAsync(userId);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNotification(Guid id)
    {
        var userId = GetUserId();
        var result = await _notificationService.DeleteNotificationAsync(userId, id);
        return Ok(result);
    }

    private Guid GetUserId()
    {
        var claim = User.FindFirst("sub");
        return Guid.Parse(claim!.Value);
    }
}
