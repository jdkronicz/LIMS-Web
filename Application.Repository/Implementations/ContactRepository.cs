using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Model;
using Application.Repository.Common;

namespace Application.Repository
{
    public class ContactRepository : Repository<Contact>, IContactRepository
    {
        public ContactRepository(DbContext context)
            : base(context)
        {

        }

        //public override IEnumerable<Contact> GetAll()
        //{
        //    //return _entities.Set<Contact>().Include(x => x.).AsEnumerable();
        //    return _entities.Set<Contact>().AsEnumerable();
        //}
        public Contact VerifyUser(string userName, string password)
        {
            return _dbset.Where(x => x.Email == userName && x.PW == password && x.PortalUser==true).FirstOrDefault();
        }
        public IList<Contact> GetByCompanyEmail(string email)
        {
            return _dbset.Include(x => x.Customer).Where(x => x.Email==email).ToList();
        }
        //public Contact GetById(long id)
        //{
        //    return _dbset.Where(x => x.ProdID == id).FirstOrDefault();
        //    //}
    }
    }
