using Application.Model;
using System.Collections.Generic;

namespace Application.Service
{
    public interface IContactService
    {
        // List<ContactCategory> GetContactCategories();
        //List<Contact> GetContactByContactCategoryID(int id);

        Contact GetById(long Id);
        IList<Contact> GetAll();
        Contact VerifyUser(string userName, string password);
        IList<Contact> GetByCompanyEmail(string email);
    }
}
