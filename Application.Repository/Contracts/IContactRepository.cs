using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Model;
using Application.Repository.Common;

namespace Application.Repository
{
    public interface IContactRepository : IRepository<Contact>
    {
        // IEnumerable<Contact> GetAll();
        // Contact GetById(long id);

        Contact VerifyUser(string userName, string password);
        IList<Contact> GetByCompanyEmail(string email);
    }
}
