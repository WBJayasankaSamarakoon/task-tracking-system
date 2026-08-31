using Microsoft.EntityFrameworkCore;
using web_api.Models;

namespace web_api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // Define a DbSet for the TaskItem model
    public DbSet<TaskItem> Tasks { get; set; }
}
