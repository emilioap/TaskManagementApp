using Microsoft.Extensions.Logging;
using Tasks.Application.Abstractions;
using Tasks.Application.Common;
using Tasks.Domain.Entities;

namespace Tasks.Application.Services;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _repository;
    private readonly ILogger<TaskService> _logger;

    public TaskService(ITaskRepository repository, ILogger<TaskService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public Task<List<TaskItem>> GetAllAsync() => _repository.GetAllAsync();

    public async Task<Result<TaskItem>> CreateAsync(string title)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            return Result<TaskItem>.Failure("Task title is required.");
        }

        var task = new TaskItem { Title = title.Trim() };
        var created = await _repository.AddAsync(task);

        _logger.LogInformation("Task created with Id {TaskId}", created.Id);
        return Result<TaskItem>.Success(created);
    }

    public async Task<Result<TaskItem>> ToggleAsync(Guid id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing is null)
        {
            return Result<TaskItem>.Failure("Task not found.");
        }

        await _repository.ToggleAsync(id);
        var updated = await _repository.GetByIdAsync(id);

        _logger.LogInformation("Task {TaskId} toggled to {Completed}", id, updated?.Completed);
        return Result<TaskItem>.Success(updated!);
    }

    public async Task<Result<bool>> DeleteAsync(Guid id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing is null)
        {
            return Result<bool>.Failure("Task not found.");
        }

        await _repository.DeleteAsync(id);
        _logger.LogInformation("Task {TaskId} removed", id);
        return Result<bool>.Success(true);
    }
}
