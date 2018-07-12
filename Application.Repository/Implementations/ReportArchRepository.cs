using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Model;
using Application.Repository.Common;
using System.Linq.Expressions;

namespace Application.Repository
{
    public class ReportArchRepository : Repository<ReportArchive>, IReportArchRepository
    {
        public ReportArchRepository(DbContext context)
            : base(context)
        {

        }


    }
}
