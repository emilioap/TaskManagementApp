using Tasks.Application.Common;
using Tasks.Domain.Entities;

namespace Tasks.Application.Abstractions;

public interface ITaskService
{
    Task<List<TaskItem>> GetAllAsync();
    Task<Result<TaskItem>> CreateAsync(string title);
    Task<Result<TaskItem>> ToggleAsync(Guid id);
    Task<Result<bool>> DeleteAsync(Guid id);
}
