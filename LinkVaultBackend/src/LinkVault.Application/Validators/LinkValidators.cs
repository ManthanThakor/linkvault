using FluentValidation;
using LinkVault.Application.DTOs.Link;

namespace LinkVault.Application.Validators;

public class CreateLinkRequestValidator : AbstractValidator<CreateLinkRequest>
{
    public CreateLinkRequestValidator()
    {
        RuleFor(x => x.OriginalUrl).NotEmpty().Must(BeValidUrl).WithMessage("Invalid URL format");
        RuleFor(x => x.CustomAlias).MaximumLength(50).When(x => !string.IsNullOrEmpty(x.CustomAlias));
        RuleFor(x => x.Title).MaximumLength(200);
    }

    private bool BeValidUrl(string url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out var uri) &&
               (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
    }
}

public class UpdateLinkRequestValidator : AbstractValidator<UpdateLinkRequest>
{
    public UpdateLinkRequestValidator()
    {
        RuleFor(x => x.OriginalUrl).NotEmpty().Must(BeValidUrl).WithMessage("Invalid URL format");
        RuleFor(x => x.Title).MaximumLength(200);
    }

    private bool BeValidUrl(string url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out var uri) &&
               (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
    }
}
