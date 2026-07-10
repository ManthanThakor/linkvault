using FluentValidation;
using LinkVault.Application.DTOs.Category;

namespace LinkVault.Application.Validators;

public class CategoryRequestValidator : AbstractValidator<CategoryRequest>
{
    public CategoryRequestValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
    }
}
