using Application.DAL.Contracts;
using Application.DAL.Implementations;
using Application.Model;

namespace Application.Repository
{
    public class AddressRepository : Repository<Address>, IAddressRepository
    {
        private AdventureWorks dataContext;

        protected IDatabaseFactory DatabaseFactory
        {
            get;
            private set;
        }

        public AddressRepository(IDatabaseFactory databaseFactory)
            : base(databaseFactory)
        {
            DatabaseFactory = databaseFactory;
        }

        protected AdventureWorks DataContext
        {
            get { return dataContext ?? (dataContext = DatabaseFactory.Get()); }
        }

    }
    public interface IAddressRepository : IRepository<Address>
    {
    }
}
