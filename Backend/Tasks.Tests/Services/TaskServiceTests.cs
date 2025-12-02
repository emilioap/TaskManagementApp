using Moq;
using Tasks.Application.Abstractions;
using Tasks.Application.Services;
using Tasks.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace Tasks.Tests.Services;

public class TaskServiceTests
{
    private readonly Mock<ITaskRepository> _repositoryMock = new();
    private readonly Mock<ILogger<TaskService>> _loggerMock = new();
    private readonly TaskService _sut;

    public TaskServiceTests()
    {
        _sut = new TaskService(_repositoryMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task CreateAsync_ValidTitle_ShouldReturnTask()
    {
        // Arrange
        var title = "New Task";
        _repositoryMock.Setup(r => r.ExistsByTitleAsync(title)).ReturnsAsync(false);
        _repositoryMock.Setup(r => r.AddAsync(It.IsAny<TaskItem>()))
            .ReturnsAsync((TaskItem t) => t);

        // Act
        var result = await _sut.CreateAsync(title);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.Equal(title, result.Value!.Title);
        _repositoryMock.Verify(r => r.AddAsync(It.Is<TaskItem>(t => t.Title == title)), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_DuplicateTitle_ShouldReturnFailure()
    {
        // Arrange
        var title = "Duplicate";
        _repositoryMock.Setup(r => r.ExistsByTitleAsync(title)).ReturnsAsync(true);

        // Act
        var result = await _sut.CreateAsync(title);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Contains("already exists", result.Error, StringComparison.OrdinalIgnoreCase);
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<TaskItem>()), Times.Never);
    }

    [Fact]
    public async Task CreateAsync_EmptyTitle_ShouldReturnFailure()
    {
        // Act
        var result = await _sut.CreateAsync(string.Empty);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Contains("required", result.Error, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task ToggleAsync_ExistingTask_ShouldToggleAndReturnUpdated()
    {
        // Arrange
        var id = Guid.NewGuid();
        var existing = new TaskItem { Id = id, Title = "Test", Completed = false };
        var toggled = new TaskItem { Id = id, Title = "Test", Completed = true };

        _repositoryMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(existing);
        _repositoryMock.SetupSequence(r => r.GetByIdAsync(id))
            .ReturnsAsync(existing)
            .ReturnsAsync(toggled);

        // Act
        var result = await _sut.ToggleAsync(id);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.True(result.Value!.Completed);
        _repositoryMock.Verify(r => r.ToggleAsync(id), Times.Once);
    }

    [Fact]
    public async Task ToggleAsync_NotFound_ShouldReturnFailure()
    {
        // Arrange
        var id = Guid.NewGuid();
        _repositoryMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((TaskItem?)null);

        // Act
        var result = await _sut.ToggleAsync(id);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Contains("not found", result.Error, StringComparison.OrdinalIgnoreCase);
        _repositoryMock.Verify(r => r.ToggleAsync(It.IsAny<Guid>()), Times.Never);
    }

    [Fact]
    public async Task DeleteAsync_Existing_ShouldReturnSuccess()
    {
        // Arrange
        var id = Guid.NewGuid();
        _repositoryMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync(new TaskItem { Id = id, Title = "Test" });

        // Act
        var result = await _sut.DeleteAsync(id);

        // Assert
        Assert.True(result.IsSuccess);
        _repositoryMock.Verify(r => r.DeleteAsync(id), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_NotFound_ShouldReturnFailure()
    {
        // Arrange
        var id = Guid.NewGuid();
        _repositoryMock.Setup(r => r.GetByIdAsync(id)).ReturnsAsync((TaskItem?)null);

        // Act
        var result = await _sut.DeleteAsync(id);

        // Assert
        Assert.False(result.IsSuccess);
        _repositoryMock.Verify(r => r.DeleteAsync(It.IsAny<Guid>()), Times.Never);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnList()
    {
        // Arrange
        var items = new List<TaskItem> { new() { Title = "One" }, new() { Title = "Two" } };
        _repositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(items);

        // Act
        var result = await _sut.GetAllAsync();

        // Assert
        Assert.Equal(2, result.Count);
    }
}
