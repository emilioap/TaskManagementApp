using Microsoft.EntityFrameworkCore;
using Tasks.Domain.Entities;

namespace Tasks.Infrastructure.Persistence;

public class TasksDbContext(DbContextOptions<TasksDbContext> options) : DbContext(options)
{
    public DbSet<TaskItem> Tasks => Set<TaskItem>();
}
