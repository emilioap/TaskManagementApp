using Tasks.Api.Middleware;
using Tasks.Api.Models;
using Tasks.Application.Abstractions;
using Tasks.Application.Common;
using Tasks.Application.Services;
using Tasks.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .SetIsOriginAllowed(_ => true);
    });
});

builder.Services.AddInfrastructure();
builder.Services.AddScoped<ITaskService, TaskService>();

var app = builder.Build();

app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapGet("/api/tasks", async (ITaskService service) =>
{
    var tasks = await service.GetAllAsync();
    return Results.Ok(tasks);
});

app.MapPost("/api/tasks", async (CreateTaskRequest request, ITaskService service) =>
{
    var result = await service.CreateAsync(request.Title);
    return ToHttpResult(result, createdRoute: $"/api/tasks/{result.Value?.Id}");
});

app.MapPut("/api/tasks/{id:guid}/toggle", async (Guid id, ITaskService service) =>
{
    var result = await service.ToggleAsync(id);
    return ToHttpResult(result);
});

app.MapDelete("/api/tasks/{id:guid}", async (Guid id, ITaskService service) =>
{
    var result = await service.DeleteAsync(id);
    return result.IsSuccess ? Results.NoContent() : Results.NotFound(new { error = result.Error });
});

app.Run();

IResult ToHttpResult<T>(Result<T> result, string? createdRoute = null)
{
    if (result.IsSuccess && createdRoute is not null)
    {
        return Results.Created(createdRoute, result.Value);
    }

    if (result.IsSuccess)
    {
        return Results.Ok(result.Value);
    }

    var status = result.Error?.Contains("not found", StringComparison.OrdinalIgnoreCase) == true
        ? StatusCodes.Status404NotFound
        : StatusCodes.Status400BadRequest;

    return Results.Json(new { error = result.Error }, statusCode: status);
}
