using System.Net;
using System.Text.Json;
using LinkVault.Application.DTOs.Common;
using LinkVault.Application.Exceptions;

namespace LinkVault.API.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionMiddleware> _logger;

    public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var response = exception switch
        {
            NotFoundException => new ApiResponse<object>
            {
                Success = false,
                Message = exception.Message,
                Errors = null
            },
            BadRequestException => new ApiResponse<object>
            {
                Success = false,
                Message = exception.Message,
                Errors = null
            },
            UnauthorizedException => new ApiResponse<object>
            {
                Success = false,
                Message = exception.Message,
                Errors = null
            },
            _ => new ApiResponse<object>
            {
                Success = false,
                Message = "An internal server error occurred.",
                Errors = null
            }
        };

        context.Response.StatusCode = exception switch
        {
            NotFoundException => (int)HttpStatusCode.NotFound,
            BadRequestException => (int)HttpStatusCode.BadRequest,
            UnauthorizedException => (int)HttpStatusCode.Unauthorized,
            _ => (int)HttpStatusCode.InternalServerError
        };

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}
