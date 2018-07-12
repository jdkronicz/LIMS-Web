
using Application.Repository.Common;
using Application.Model;


using Application.Service.Common;
using System.Collections.Generic;
using System.Linq;
using Application.Repository;

namespace Application.Service
{
    public class ContactService : EntityService<Contact>, IContactService
    {
        IUnitOfWork _unitOfWork;
        IContactRepository _ContactRepository;

        public ContactService( IContactRepository ContactRepository)
            : base( ContactRepository)
        {
           // _unitOfWork = unitOfWork;
            _ContactRepository = ContactRepository;
        }


        public Contact GetById(long Id)
        {
            return _ContactRepository.FindBy(x => x.ContactID == Id).FirstOrDefault();
        }
        public IList<Contact> GetByCompanyEmail(string email)
        {
           
            return _ContactRepository.GetByCompanyEmail(email);
        }
        public Contact VerifyUser(string userName,string password)
        {
            return _ContactRepository.VerifyUser( userName,password);
        }
        
        public IList<Contact> GetAll()
        {
            return _ContactRepository.GetAll().ToList();// FindBy(x => x.ContactID == Id).FirstOrDefault();
        }
    }
}
