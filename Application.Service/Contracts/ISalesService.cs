using Application.Model.DTO;

namespace Application.Service.Contracts
{
    public interface ISalesService
    {
        InvoiceDTO GetInvoiceBySaleOrderID(int id);
        int SaveSalesOrderHeader(SalesOrderDTO salesOrder);
    }
}
