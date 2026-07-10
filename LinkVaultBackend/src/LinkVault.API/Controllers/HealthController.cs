using Microsoft.AspNetCore.Mvc;

namespace LinkVault.API.Controllers;

[ApiController]
[Route("api")]
public class HealthController : ControllerBase
{
    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
    }

    [HttpGet("version")]
    public IActionResult Version()
    {
        return Ok(new
        {
            version = "1.0.0",
            name = "LinkVault API",
            environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"
        });
    }
}
