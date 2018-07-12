using Application.DAL.Contracts;
using Application.DAL.Implementations;
using Application.Model;

namespace Application.Repository
{
    public class CustomerAddressRepository : Repository<CustomerAddress>, ICustomerAddressRepository
    {
        private AdventureWorks dataContext;

        protected IDatabaseFactory DatabaseFactory
        {
            get;
            private set;
        }

        public CustomerAddressRepository(IDatabaseFactory databaseFactory)
            : base(databaseFactory)
        {
            DatabaseFactory = databaseFactory;
        }

        protected AdventureWorks DataContext
        {
            get { return dataContext ?? (dataContext = DatabaseFactory.Get()); }
        }

    }
    public interface ICustomerAddressRepository : IRepository<CustomerAddress>
    {
    }
}
