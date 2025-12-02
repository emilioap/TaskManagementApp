using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Tasks.Application.Abstractions;
using Tasks.Infrastructure.Persistence;
using Tasks.Infrastructure.Repositories;

namespace Tasks.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddDbContext<TasksDbContext>(options =>
        {
            options.UseInMemoryDatabase("TasksDb");
        });

        services.AddScoped<ITaskRepository, TaskRepository>();

        return services;
    }
}
