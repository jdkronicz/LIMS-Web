using Application.DAL.Contracts;
using Application.DAL.Implementations;
using Application.Model;

namespace Application.Repository
{
    public class SalesOrderDetailRepository : Repository<SalesOrderDetail>, ISalesOrderDetailRepository
    {
        private AdventureWorks dataContext;

        protected IDatabaseFactory DatabaseFactory
        {
            get;
            private set;
        }

        public SalesOrderDetailRepository(IDatabaseFactory databaseFactory)
            : base(databaseFactory)
        {
            DatabaseFactory = databaseFactory;
        }

        protected AdventureWorks DataContext
        {
            get { return dataContext ?? (dataContext = DatabaseFactory.Get()); }
        }

    }
    public interface ISalesOrderDetailRepository : IRepository<SalesOrderDetail>
    {
    }
}
