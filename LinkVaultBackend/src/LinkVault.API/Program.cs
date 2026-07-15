using Microsoft.EntityFrameworkCore;
using Serilog;
using LinkVault.API.Extensions;
using LinkVault.API.Middleware;
using LinkVault.Application.Extensions;
using LinkVault.Infrastructure.Extensions;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/linkvault-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

try
{
    Log.Information("Starting LinkVault API");

    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog();

    var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

    builder.Services.AddControllers();
    builder.Services.AddOpenApi();

    builder.Services.AddJwtAuthentication(builder.Configuration);
    builder.Services.AddSwaggerConfiguration();
    builder.Services.AddCorsConfiguration();
    builder.Services.AddHealthChecksConfiguration(builder.Configuration);
    builder.Services.AddRateLimitingConfiguration();

    builder.Services.AddInfrastructure(builder.Configuration);
    builder.Services.AddApplication();

    var app = builder.Build();

    using (var scope = app.Services.CreateScope())
    {
        var db = scope.ServiceProvider.GetRequiredService<LinkVault.Infrastructure.Data.ApplicationDbContext>();
        db.Database.Migrate();
    }

    app.UseMiddleware<ExceptionMiddleware>();

    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
    }

    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "LinkVault API v1");
        c.RoutePrefix = "swagger";
    });

    if (!app.Environment.IsDevelopment())
    {
        app.UseHttpsRedirection();
    }
    app.UseCors("AllowAll");
    app.UseRateLimiter();
    app.UseAuthentication();
    app.UseAuthorization();

    app.MapControllers();
    app.MapHealthChecks("/api/health/status");

    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application terminated unexpectedly");
}
finally
{
    Log.CloseAndFlush();
}
