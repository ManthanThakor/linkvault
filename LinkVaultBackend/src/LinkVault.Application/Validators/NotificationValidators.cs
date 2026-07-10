using FluentValidation;
using LinkVault.Application.DTOs.Notification;

namespace LinkVault.Application.Validators;

public class MarkAsReadRequestValidator : AbstractValidator<MarkAsReadRequest>
{
    public MarkAsReadRequestValidator()
    {
        RuleFor(x => x.NotificationIds).NotEmpty().WithMessage("At least one notification ID is required");
    }
}
