using System;
using System.Collections.Generic;

namespace Application.Model
{
    public partial class SalesOrderDetail
    {
        public int SalesOrderID { get; set; }
        public int SalesOrderDetailID { get; set; }
        public short OrderQty { get; set; }
        public int ProductID { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal UnitPriceDiscount { get; set; }
        public decimal LineTotal { get; set; }
        public System.Guid rowguid { get; set; }
        public System.DateTime ModifiedDate { get; set; }
    
        public virtual Product Product { get; set; }
        public virtual SalesOrderHeader SalesOrderHeader { get; set; }
    }
    
}
