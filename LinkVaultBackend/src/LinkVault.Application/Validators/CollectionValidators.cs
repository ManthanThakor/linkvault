using FluentValidation;
using LinkVault.Application.DTOs.Collection;

namespace LinkVault.Application.Validators;

public class CollectionRequestValidator : AbstractValidator<CollectionRequest>
{
    public CollectionRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Description).MaximumLength(500).When(x => !string.IsNullOrEmpty(x.Description));
    }
}
