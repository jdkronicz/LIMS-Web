using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Application.Model;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace Application.DAL
{
    public class ApplicationContext : DbContext
    {

        public ApplicationContext()
            : base("Name=ApplicationContext")
        {
            Database.SetInitializer<ApplicationContext>(null);
            this.Configuration.LazyLoadingEnabled = false;
           // this.Configuration.ProxyCreationEnabled = false;
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Contact> Contact { get; set; }
        public DbSet<Sample> Sample { get; set; }
        public DbSet<WorkOrder> WorkOrder { get; set; }
        public DbSet<Report> Report { get; set; }
        public DbSet<RepResult> RepResult { get; set; }
        public DbSet<SampleArchive> SampleArchive { get; set; }
        public DbSet<WorkOrderArchive> WorkOrderArchive { get; set; }
        public DbSet<ReportArchive> ReportArchive { get; set; }
        public DbSet<RepResultArchive> RepResultArchive { get; set; }
        public DbSet<SampMethPara> SampMethPara { get; set; }
        public DbSet<Status> Status { get; set; }
        public DbSet<Matrix> Matrix { get; set; }
        
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();

            /****
            modelBuilder.Entity<Sample>()
           .HasMany(c => c.Reports)
           .WithMany()
           .Map(mc =>
           {
               mc.ToTable("RR_Report");
               mc.MapLeftKey("SampID");
               mc.MapRightKey("ReportID");
           });
           ***///
          //  modelBuilder.Entity<Report>()
           //.HasMany(c => c.RepResults)
           //.WithMany()
           //.Map(mc =>
           //{
           //    mc.ToTable("RR_Report");
           //    mc.MapLeftKey("ReportID");
           //    mc.MapRightKey("RR_ID");
           //});
            //  modelBuilder.Entity<Report>()
            //.HasMany(c => c.RepResults)
            //.WithMany()
            //.Map(mc =>
            //{
            //   // mc.ToTable("RR_Report");
            //    mc.MapLeftKey("ReportID");
            //    mc.MapRightKey("RR_ID");
            //});
            // modelBuilder
            //.Entity<Sample>()
            //.HasMany(product => product.Reports)
            //.WithMany(photo => photo.Sample)
            //.Map(mapping => mapping
            //    .ToTable("RR_Report", Sample)
            //    .MapLeftKey("ProductID")
            //    .MapRightKey("ProductPhotoID"));

            //      modelBuilder.Entity<Sample>().
            //HasMany(c => c.Reports).
            //WithMany();

            //// Configure many-to-many relationship 
            //modelBuilder.Entity<Sample>()

            //.HasMany(s => s.Reports)
            //.WithMany(s => s.Sample)

            //.Map(m =>
            //{
            //    m.ToTable("RR_Report");
            //    m.MapLeftKey("SampID");
            //    m.MapRightKey("ReportID");
            //});
            //modelBuilder.Entity<Report>().HasMany(x => x.RepResult).WithMany(x => x.Report)
            //.Map(m =>
            //{
            //    m.ToTable("RR_Report"); // Relationship table name
            //    m.MapLeftKey("ReportID"); // Name of column for student IDs
            //    m.MapRightKey("RR_ID"); // Name of column for course IDs
            //});

            //     builder.Entity<Sample>()
            //.HasMany(c => c.Reports)
            //.WithMany(c => c.Sample)
            //.Map(m =>
            //{
            //    m.MapLeftKey("ReportID");
            //    m.MapRightKey("SampID");
            //    m.ToTable("RR_Report");
            //});
            // Primary keys
            //builder.Entity<Sample>().HasKey(q => q.SampID);
            //builder.Entity<Report>().HasKey(q => q.ReportID);
            //builder.Entity<RR_Report>().HasKey(q =>
            //    new {
            //        q.SampID,
            //        q.ReportID
            //    });

            //// Relationships
            //builder.Entity<RR_Report>()
            //    .HasRequired(t => t.Sample)
            //    .WithMany(t => t.RR_Report)
            //    .HasForeignKey(t => t.SampID);

            //builder.Entity<RR_Report>()
            //    .HasRequired(t => t.Report)
            //    .WithMany(t => t.RR_Report)
            //    .HasForeignKey(t => t.ReportID);

            // modelBuilder.Entity<Sample>().HasMany(c => c.Reports).WithMany(i => i.Samples)
            //.Map(t => t.MapLeftKey("SampID")
            //.//MapRightKey("ReportID")
            //.ToTable("RR_Report"));
            // modelBuilder.Entity<Sample>().HasMany(x => x.Reports).WithMany(x => x.Samples)
            //.Map(m =>
            //{
            //    m.ToTable("RR_Report"); // Relationship table name
            //     m.MapLeftKey("SampID"); // Name of column for student IDs
            //     m.MapRightKey("ReportID"); // Name of column for course IDs
            // });

        }

        public override int SaveChanges()
        {
            var modifiedEntries = ChangeTracker.Entries()
                .Where(x => x.Entity is IAuditableEntity
                    && (x.State == System.Data.Entity.EntityState.Added || x.State == System.Data.Entity.EntityState.Modified));

            foreach (var entry in modifiedEntries)
            {
                IAuditableEntity entity = entry.Entity as IAuditableEntity;
                if (entity != null)
                {
                    string identityName = Thread.CurrentPrincipal.Identity.Name;
                    DateTime now = DateTime.UtcNow;

                    if (entry.State == System.Data.Entity.EntityState.Added)
                    {
                        entity.CreatedBy = identityName;
                        entity.CreatedDate = now;
                    }
                    else
                    {
                        base.Entry(entity).Property(x => x.CreatedBy).IsModified = false;
                        base.Entry(entity).Property(x => x.CreatedDate).IsModified = false;
                    }

                    entity.UpdatedBy = identityName;
                    entity.UpdatedDate = now;
                }
            }

            return base.SaveChanges();
        }
    }
}
