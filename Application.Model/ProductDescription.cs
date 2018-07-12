using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Application.Model
{
    public partial class ProductDescription
    {
        public ProductDescription()
        {
            this.ProductModelProductDescriptions = new List<ProductModelProductDescription>();
        }
        [Key]
        public int ProductDescriptionID { get; set; }
        public string Description { get; set; }
        public System.Guid rowguid { get; set; }
        public System.DateTime ModifiedDate { get; set; }
    
        public virtual List<ProductModelProductDescription> ProductModelProductDescriptions { get; set; }
    }
    
}
