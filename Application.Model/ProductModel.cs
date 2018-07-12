using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Application.Model
{
    public partial class ProductModel
    {
        public ProductModel()
        {
            this.Products = new List<Product>();
            this.ProductModelProductDescriptions = new List<ProductModelProductDescription>();
        }
        [Key]
        public int ProductModelID { get; set; }
        public string Name { get; set; }
        public string CatalogDescription { get; set; }
        public System.Guid rowguid { get; set; }
        public System.DateTime ModifiedDate { get; set; }
    
        public virtual List<Product> Products { get; set; }
        public virtual List<ProductModelProductDescription> ProductModelProductDescriptions { get; set; }
    }
    
}
