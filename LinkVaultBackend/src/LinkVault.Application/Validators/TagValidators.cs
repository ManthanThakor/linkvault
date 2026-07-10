using FluentValidation;
using LinkVault.Application.DTOs.Tag;

namespace LinkVault.Application.Validators;

public class TagRequestValidator : AbstractValidator<TagRequest>
{
    public TagRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Color).MaximumLength(7).When(x => !string.IsNullOrEmpty(x.Color));
    }
}
