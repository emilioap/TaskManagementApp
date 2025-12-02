using Microsoft.EntityFrameworkCore;
using Tasks.Application.Abstractions;
using Tasks.Domain.Entities;
using Tasks.Infrastructure.Persistence;

namespace Tasks.Infrastructure.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly TasksDbContext _context;

    public TaskRepository(TasksDbContext context)
    {
        _context = context;
    }

    public async Task<List<TaskItem>> GetAllAsync()
    {
        return await _context.Tasks.AsNoTracking().OrderByDescending(t => t.CreatedAt).ToListAsync();
    }

    public async Task<TaskItem?> GetByIdAsync(Guid id)
    {
        return await _context.Tasks.FindAsync(id);
    }

    public async Task<bool> ExistsByTitleAsync(string title)
    {
        var normalized = title.Trim().ToLowerInvariant();
        return await _context.Tasks.AsNoTracking().AnyAsync(t => t.Title.ToLower() == normalized);
    }

    public async Task<TaskItem> AddAsync(TaskItem task)
    {
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();
        return task;
    }

    public async Task ToggleAsync(Guid id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task is null)
        {
            throw new KeyNotFoundException("Task not found.");
        }

        task.Completed = !task.Completed;
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task is null)
        {
            throw new KeyNotFoundException("Task not found.");
        }

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
    }
}
