using Tasks.Domain.Entities;

namespace Tasks.Application.Abstractions;

public interface ITaskRepository
{
    Task<List<TaskItem>> GetAllAsync();
    Task<TaskItem?> GetByIdAsync(Guid id);
    Task<TaskItem> AddAsync(TaskItem task);
    Task<bool> ExistsByTitleAsync(string title);
    Task ToggleAsync(Guid id);
    Task DeleteAsync(Guid id);
}
