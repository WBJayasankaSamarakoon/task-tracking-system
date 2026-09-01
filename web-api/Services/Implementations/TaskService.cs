using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using web_api.Data;
using web_api.Models;
using web_api.Models.DTOs;
using web_api.Services.Interfaces;

namespace web_api.Services.Implementations;

public class TaskService : ITaskService
{
    private readonly AppDbContext _context;

    public TaskService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TaskDto>> GetAllTasksAsync()
    {
        var tasks = await _context.Tasks
            .AsNoTracking()
            .Include(t => t.Project)
            .Include(t => t.AssignedToUser)
            .OrderByDescending(t => t.Id)
            .ToListAsync();

        return tasks.Select(MapToDto);
    }

    public async Task<TaskDto?> GetTaskByIdAsync(int id)
    {
        var task = await _context.Tasks
            .Include(t => t.Project)
            .Include(t => t.AssignedToUser)
            .FirstOrDefaultAsync(t => t.Id == id);

        return task == null ? null : MapToDto(task);
    }

    public async Task<TaskDto> CreateTaskAsync(CreateTaskDto dto)
    {
        var entity = new TaskItem
        {
            Title = dto.Title.Trim(),
            Description = dto.Description?.Trim(),
            Status = dto.Status,
            Priority = dto.Priority,
            DueDate = dto.DueDate,
            ProjectId = dto.ProjectId,
            AssignedToUserId = dto.AssignedToUserId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Tasks.Add(entity);
        await _context.SaveChangesAsync();

        if (entity.ProjectId.HasValue)
        {
            await _context.Entry(entity).Reference(t => t.Project).LoadAsync();
        }
        if (entity.AssignedToUserId.HasValue)
        {
            await _context.Entry(entity).Reference(t => t.AssignedToUser).LoadAsync();
        }

        return MapToDto(entity);
    }

    public async Task<bool> UpdateTaskAsync(int id, UpdateTaskDto dto)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return false;

        task.Title = dto.Title.Trim();
        task.Description = dto.Description?.Trim();
        task.Status = dto.Status;
        task.Priority = dto.Priority;
        task.DueDate = dto.DueDate;
        task.ProjectId = dto.ProjectId;
        task.AssignedToUserId = dto.AssignedToUserId;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteTaskAsync(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return false;

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();
        return true;
    }

    private static TaskDto MapToDto(TaskItem item)
    {
        var isOverdue = item.DueDate.HasValue &&
                        item.DueDate.Value.Date < DateTime.UtcNow.Date &&
                        item.Status != "Completed";

        return new TaskDto
        {
            Id = item.Id,
            Title = item.Title,
            Description = item.Description,
            Status = item.Status,
            Priority = item.Priority,
            DueDate = item.DueDate,
            CreatedAt = item.CreatedAt,
            IsOverdue = isOverdue,
            ProjectId = item.ProjectId,
            ProjectName = item.Project?.Name,
            ProjectColor = item.Project?.ColorHex ?? "#5e6ad2",
            AssignedToUserId = item.AssignedToUserId,
            AssignedToName = item.AssignedToUser?.FullName,
            AssignedToRole = item.AssignedToUser?.Role
        };
    }
}
