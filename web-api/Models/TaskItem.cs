using System;
using System.ComponentModel.DataAnnotations;

namespace web_api.Models
{
    public class TaskItem
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;
        [MaxLength(500)]
        public string? Description { get; set; }
        [Required]
        [MaxLength(50)]
        public string Status { get; set; } = "Pending";
        [Required]
        [MaxLength(20)]
        public string Priority { get; set; } = "Medium";
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
