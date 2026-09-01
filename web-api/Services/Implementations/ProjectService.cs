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

public class ProjectService : IProjectService
{
    private readonly AppDbContext _context;

    public ProjectService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ProjectDto>> GetAllProjectsAsync()
    {
        return await _context.Projects
            .AsNoTracking()
            .OrderBy(p => p.Name)
            .Select(p => new ProjectDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                ColorHex = p.ColorHex,
                TaskCount = p.Tasks.Count,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<ProjectDto?> GetProjectByIdAsync(int id)
    {
        var project = await _context.Projects
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project == null) return null;

        return new ProjectDto
        {
            Id = project.Id,
            Name = project.Name,
            Description = project.Description,
            ColorHex = project.ColorHex,
            TaskCount = project.Tasks.Count,
            CreatedAt = project.CreatedAt
        };
    }

    public async Task<ProjectDto> CreateProjectAsync(CreateProjectDto dto)
    {
        var trimmedName = dto.Name.Trim();
        var exists = await _context.Projects.AnyAsync(p => p.Name.ToLower() == trimmedName.ToLower());
        if (exists)
        {
            throw new InvalidOperationException($"A project named '{trimmedName}' already exists.");
        }

        var entity = new Project
        {
            Name = trimmedName,
            Description = dto.Description?.Trim(),
            ColorHex = string.IsNullOrWhiteSpace(dto.ColorHex) ? "#5e6ad2" : dto.ColorHex.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _context.Projects.Add(entity);
        await _context.SaveChangesAsync();

        return new ProjectDto
        {
            Id = entity.Id,
            Name = entity.Name,
            Description = entity.Description,
            ColorHex = entity.ColorHex,
            TaskCount = 0,
            CreatedAt = entity.CreatedAt
        };
    }

    public async Task<bool> DeleteProjectAsync(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) return false;

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();
        return true;
    }
}
