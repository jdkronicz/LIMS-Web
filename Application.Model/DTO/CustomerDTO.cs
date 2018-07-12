
namespace Application.Model.DTO
{
    public class CustomerDTO
    {
        public int CustomerID { get; set; }
        public bool NameStyle { get; set; }
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Suffix { get; set; }
        public string CompanyName { get; set; }
        public string SalesPerson { get; set; }
        public string EmailAddress { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }

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
    }
}
