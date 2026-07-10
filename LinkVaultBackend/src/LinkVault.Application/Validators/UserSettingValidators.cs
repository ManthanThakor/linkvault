using FluentValidation;
using LinkVault.Application.DTOs.UserSetting;

namespace LinkVault.Application.Validators;

public class UpdateUserSettingRequestValidator : AbstractValidator<UpdateUserSettingRequest>
{
    public UpdateUserSettingRequestValidator()
    {
        When(x => x.Theme != null, () =>
        {
            RuleFor(x => x.Theme).Must(t => t is "light" or "dark" or "system")
                .WithMessage("Theme must be 'light', 'dark', or 'system'");
        });
        When(x => x.DefaultShortCodeLength != null, () =>
        {
            RuleFor(x => x.DefaultShortCodeLength).Must(l => int.TryParse(l, out var val) && val >= 4 && val <= 20)
                .WithMessage("Short code length must be between 4 and 20");
        });
    }
}
