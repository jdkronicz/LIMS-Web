using Application.DAL.Contracts;
using Application.DAL.Implementations;
using Application.Model;

namespace Application.Repository
{
    public class CustomerRepository : Repository<Customer>, ICustomerRepository
    {
        private AdventureWorks dataContext;

        protected IDatabaseFactory DatabaseFactory
        {
            get;
            private set;
        }

        public CustomerRepository(IDatabaseFactory databaseFactory)
            : base(databaseFactory)
        {
            DatabaseFactory = databaseFactory;
        }

        protected AdventureWorks DataContext
        {
            get { return dataContext ?? (dataContext = DatabaseFactory.Get()); }
        }


    }
    public interface ICustomerRepository : IRepository<Customer>
    {
    }
}
