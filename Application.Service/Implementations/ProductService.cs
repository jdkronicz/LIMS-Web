
using Application.Repository.Common;
using Application.Model;


using Application.Service.Common;
using System.Collections.Generic;
using System.Linq;
using Application.Repository;

namespace Application.Service
{
    public class ProductService : EntityService<Product>, IProductService
    {
        IUnitOfWork _unitOfWork;
        IProductRepository _productRepository;

        public ProductService( IProductRepository productRepository)
            : base( productRepository)
        {
           // _unitOfWork = unitOfWork;
            _productRepository = productRepository;
        }


        public Product GetById(long Id)
        {
            return _productRepository.FindBy(x=>x.ProdID==Id).FirstOrDefault();
        }
    }
}
