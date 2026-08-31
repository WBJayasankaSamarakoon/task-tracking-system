using System;

namespace web_api.Models.DTOs;

public class TaskDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = "Pending";
    public string Priority { get; set; } = "Medium";
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsOverdue { get; set; }
    public int? ProjectId { get; set; }
    public string? ProjectName { get; set; }
    public string? ProjectColor { get; set; }
}
