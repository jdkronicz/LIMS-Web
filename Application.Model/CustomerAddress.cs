using System;
using System.Collections.Generic;

namespace Application.Model
{
    public partial class CustomerAddress
    {
        public int CustomerID { get; set; }
        public int AddressID { get; set; }
        public string AddressType { get; set; }
        public System.Guid rowguid { get; set; }
        public System.DateTime ModifiedDate { get; set; }
    
        public virtual Address Address { get; set; }
        public virtual Customer Customer { get; set; }
    }
    
}
