using System.Collections.Generic;
using System.Threading.Tasks;
using web_api.Models.DTOs;

namespace web_api.Services.Interfaces;

public interface IProjectService
{
    Task<IEnumerable<ProjectDto>> GetAllProjectsAsync();
    Task<ProjectDto?> GetProjectByIdAsync(int id);
    Task<ProjectDto> CreateProjectAsync(CreateProjectDto dto);
    Task<bool> DeleteProjectAsync(int id);
}
