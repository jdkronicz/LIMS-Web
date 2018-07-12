using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Application.Model
{
    public partial class ProductModelProductDescription
    {
        public int ProductModelID { get; set; }
        [Key]
        public int ProductDescriptionID { get; set; }
        public string Culture { get; set; }
        public System.Guid rowguid { get; set; }
        public System.DateTime ModifiedDate { get; set; }
    
        public virtual ProductDescription ProductDescription { get; set; }
        public virtual ProductModel ProductModel { get; set; }
    }
    
}
