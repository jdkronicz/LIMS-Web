using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Application.Model
{
    public partial class ProductCategory
    {
        public ProductCategory()
        {
            this.Products = new List<Product>();
            this.ProductCategory1 = new List<ProductCategory>();
        }
        [Key]
        public int ProductCategoryID { get; set; }
        public int ParentProductCategoryID { get; set; }
        public string Name { get; set; }
        public System.Guid rowguid { get; set; }
        public System.DateTime ModifiedDate { get; set; }
    
        public virtual List<Product> Products { get; set; }
        [JsonIgnore]
        public virtual List<ProductCategory> ProductCategory1 { get; private set; }
        [JsonIgnore]
        public virtual ProductCategory ProductCategory2 { get; private set; }
    }
    
}
