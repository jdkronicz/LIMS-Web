using Application.Model.DTO;

namespace Application.Service.Contracts
{
    public interface ICustomerService
    {
        CustomerDTO ValidateCustomer(int id, string password);
        int SaveOrUpdateCustomer(CustomerDTO customer);
    }
}
