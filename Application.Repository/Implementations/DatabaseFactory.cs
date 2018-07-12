using Application.DAL.Contracts;
using Application.Model;

namespace Application.DAL.Implementations
{
    public class DatabaseFactory : Disposable, IDatabaseFactory
    {
        private AdventureWorks dataContext;
        public AdventureWorks Get()
        {
            return dataContext ?? (dataContext = new AdventureWorks());
        }
        protected override void DisposeCore()
        {
            if (dataContext != null)
                dataContext.Dispose();
        }
    }
}
