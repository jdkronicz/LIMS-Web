using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Model;
using Application.Repository.Common;

namespace Application.Repository
{
    public interface IProductRepository : IRepository<Product>
    {
       // IEnumerable<Product> GetAll();
       // Product GetById(long id);
    }
}
