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
    public class ProductRepository : Repository<Product>, IProductRepository
    {
        public ProductRepository(DbContext context)
            : base(context)
        {

        }

        //public override IEnumerable<Product> GetAll()
        //{
        //    //return _entities.Set<Product>().Include(x => x.).AsEnumerable();
        //    return _entities.Set<Product>().AsEnumerable();
        //}

        //public Product GetById(long id)
        //{
        //    return _dbset.Where(x => x.ProdID == id).FirstOrDefault();
        //}
    }
}
