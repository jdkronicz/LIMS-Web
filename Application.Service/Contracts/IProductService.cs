using Application.Model;
using System.Collections.Generic;

namespace Application.Service
{
    public interface IProductService
    {
        // List<ProductCategory> GetProductCategories();
        //List<Product> GetProductByProductCategoryID(int id);

        Product GetById(long Id);
    }
}
