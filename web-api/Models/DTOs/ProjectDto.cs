using System;
using System.ComponentModel.DataAnnotations;

namespace web_api.Models.DTOs;

public class ProjectDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string ColorHex { get; set; } = "#5e6ad2";
    public int TaskCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateProjectDto
{
    [Required(ErrorMessage = "Project Name is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Project Name must be between 2 and 100 characters.")]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
    public string? Description { get; set; }

    [MaxLength(20, ErrorMessage = "ColorHex cannot exceed 20 characters.")]
    public string ColorHex { get; set; } = "#5e6ad2";
}
