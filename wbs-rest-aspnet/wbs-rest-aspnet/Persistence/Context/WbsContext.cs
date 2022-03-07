using Microsoft.EntityFrameworkCore;
using wbs_rest_aspnet.Persistence.Models;

namespace wbs_rest_aspnet.Persistence.Context;

public class WbsContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Client> Clients { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<Document> Documents { get; set; }
     public virtual DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<UsersClients> UsersClients { get; set; }
    public DbSet<UsersProjects> UsersProjects { get; set; }

    public WbsContext(DbContextOptions<WbsContext> options)
            : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.UserId);
                entity.Property(e => e.Name).HasMaxLength(20).IsUnicode(false).IsRequired();
                entity.Property(e => e.Surname).HasMaxLength(20).IsUnicode(false).IsRequired();
                entity.Property(e => e.PasswordSalt).HasMaxLength(255).IsRequired();
                entity.Property(e => e.PasswordHash).HasMaxLength(255).IsRequired();
                entity.Property(e => e.Email).HasMaxLength(50).IsUnicode(false).IsRequired();
                entity.Property(e => e.CreateOn).HasDefaultValueSql("getdate()");
            });

        modelBuilder.Entity<Client>(entity =>
        {
            entity.HasKey("ClientId");
            entity.Property(e => e.Vat).HasMaxLength(12).IsRequired();
            entity.Property(e => e.CreateBy).IsRequired();
            entity.Property(e => e.CreateOn).HasDefaultValueSql("getdate()");
            // entity.Property(e => e.Industry).IsRequired();
        });

        modelBuilder.Entity<UsersClients>().HasKey(e => new { e.UserId, e.ClientId });

        modelBuilder.Entity<UsersClients>()
                    .HasOne<User>(sc => sc.User)
                    .WithMany(s => s.UsersClients)
                    .HasForeignKey(sc => sc.UserId);

        modelBuilder.Entity<UsersClients>()
                    .HasOne<Client>(sc => sc.Client)
                    .WithMany(s => s.UsersClients)
                    .HasForeignKey(sc => sc.ClientId);

        modelBuilder.Entity<Project>(entity =>
        {
            entity.HasKey("ProjectId");
            entity.Property(e => e.Name).HasMaxLength(50).IsRequired();
            entity.Property(e => e.CreateOn).HasDefaultValueSql("getdate()");
        });

        modelBuilder.Entity<Project>()
                    .HasOne<Client>(project => project.Client)
                    .WithMany(client => client.Projects);

        modelBuilder.Entity<Document>()
                    .HasOne<Project>(document => document.Project)
                    .WithMany(project => project.Documents)
                    .HasForeignKey(document => document.ProjectId);

        modelBuilder.Entity<UsersProjects>().HasKey(e => new { e.UserId, e.ProjectId });

        modelBuilder.Entity<UsersProjects>()
                    .HasOne<User>(sc => sc.User)
                    .WithMany(s => s.UsersProjects)
                    .HasForeignKey(sc => sc.UserId);

        modelBuilder.Entity<UsersProjects>()
                    .HasOne<Project>(sc => sc.Project)
                    .WithMany(s => s.UsersProjects)
                    .HasForeignKey(sc => sc.ProjectId);

        modelBuilder.Entity<RefreshToken>(entity =>
            {
               
                entity.Property(e => e.ExpiryDate).HasColumnType("smalldatetime");
                entity.Property(e => e.TokenHash)
                    .IsRequired()
                    .HasMaxLength(1000);
                entity.Property(e => e.TokenSalt)
                    .IsRequired()
                    .HasMaxLength(1000);
 
                entity.Property(e => e.Ts)
                    .HasColumnType("smalldatetime");
 
            });


        modelBuilder.Entity<RefreshToken>()
                    .HasOne<User>(refresh => refresh.User)
                    .WithMany(user => user.RefreshTokens)
                    .HasForeignKey(refresh => refresh.UserId);

        base.OnModelCreating(modelBuilder);
    }
}