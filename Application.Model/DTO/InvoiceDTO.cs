using System;
using System.Collections.Generic;

namespace Application.Model.DTO
{
    public class InvoiceDTO
    {
        public int SalesOrderID { get; set; }
        public string SalesOrderNumber { get; set; }
        public string PurchaseOrderNumber { get; set; }
        public System.DateTime OrderDate { get; set; }
        public System.DateTime DueDate { get; set; }
        public Nullable<System.DateTime> ShipDate { get; set; }
        public decimal SubTotal { get; set; }
        public decimal TaxAmt { get; set; }
        public decimal Freight { get; set; }
        public decimal TotalDue { get; set; }
        public int CustomerID { get; set; }

        public string Title { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }

        public string BillingAddressLine1 { get; set; }
        public string BillingAddressLine2 { get; set; }
        public string BillingCity { get; set; }
        public string BillingStateProvince { get; set; }
        public string BillingCountryRegion { get; set; }
        public string BillingPostalCode { get; set; }

        public string ShippingAddressLine1 { get; set; }
        public string ShippingAddressLine2 { get; set; }
        public string ShippingCity { get; set; }
        public string ShippingStateProvince { get; set; }
        public string ShippingCountryRegion { get; set; }
        public string ShippingPostalCode { get; set; }

        public List<ProductDTO> products { get; set; }
    }
}
