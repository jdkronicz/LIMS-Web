using Application.DAL.Contracts;
using Application.Model;
using Application.Model.DTO;
using Application.Repository;
using Application.Service.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Application.Service.Implementations
{
    public class SalesService : ISalesService
    {
        IUnitOfWork _unitOfWork;
        IProductRepository _productsRepository;
        ISalesOrderHeaderRepository _salesOrderHeaderRepository;
        ISalesOrderDetailRepository _salesOrderDetailRepository;
        ICustomerAddressRepository _customerAddressRepository;
        IAddressRepository _addressRepository;
        ICustomerRepository _customerRepository;


        public SalesService(
            IUnitOfWork unitOfWork,
            IProductRepository productsRepository,
            ISalesOrderHeaderRepository salesOrderHeaderRepository,
            ISalesOrderDetailRepository salesOrderDetailRepository,
            ICustomerAddressRepository customerAddressRepository,
            IAddressRepository addressRepository,
            ICustomerRepository customerRepository)
        {
            this._unitOfWork = unitOfWork;
            this._productsRepository = productsRepository;
            this._salesOrderHeaderRepository = salesOrderHeaderRepository;
            this._salesOrderDetailRepository = salesOrderDetailRepository;
            this._customerAddressRepository = customerAddressRepository;
            this._addressRepository = addressRepository;
            this._customerRepository = customerRepository;
        }

        #region SalesHeader

        public InvoiceDTO GetInvoiceBySaleOrderID(int id)
        {
            SalesOrderHeader objSalesOrderHeader = _salesOrderHeaderRepository.GetById(id);
            Customer objCustomer = _customerRepository.GetById(objSalesOrderHeader.CustomerID);
            objSalesOrderHeader.Customer = objCustomer;
            return CreateInvoiceDTO(objSalesOrderHeader);
        }

        public int SaveSalesOrderHeader(SalesOrderDTO salesOrder)
        {
            ProductDetails productDetails = GetListOfProductsForThisOrder(salesOrder.ProductWithQuantity);
            List<CustomerAddress> lstCustomerAddress = _customerAddressRepository.GetMany(x => x.CustomerID == salesOrder.CustomerID).ToList();
            var objSalesOrder = new SalesOrderHeader();

            objSalesOrder.RevisionNumber = 2;
            objSalesOrder.OrderDate = DateTime.Now;
            objSalesOrder.DueDate = objSalesOrder.OrderDate.AddDays(12);
            objSalesOrder.ShipDate = objSalesOrder.OrderDate.AddDays(7);
            objSalesOrder.Status = 5;
            objSalesOrder.PurchaseOrderNumber = "PO" + salesOrder.CustomerID + DateTime.Now.Minute + DateTime.Now.Second + DateTime.Now.Hour;
            objSalesOrder.OnlineOrderFlag = true;
            objSalesOrder.CustomerID = salesOrder.CustomerID;
            foreach (CustomerAddress customerAddress in lstCustomerAddress)
            {
                if (customerAddress.AddressType.Equals("Shipping"))
                    objSalesOrder.ShipToAddressID = customerAddress.AddressID;
                else
                    objSalesOrder.BillToAddressID = customerAddress.AddressID;
            }
            objSalesOrder.ShipMethod = "CARGO TRANSPORT 5";
            objSalesOrder.SubTotal = productDetails.totalPrice;
            objSalesOrder.TaxAmt = decimal.Multiply(productDetails.totalPrice, 0.08M);
            objSalesOrder.Freight = decimal.Multiply(objSalesOrder.TaxAmt, 0.30M);
            objSalesOrder.Comment = "Online Order";
            objSalesOrder.rowguid = Guid.NewGuid();
            objSalesOrder.ModifiedDate = DateTime.Now;

            _salesOrderHeaderRepository.Add(objSalesOrder);
            _unitOfWork.Commit();

            SaveSalesOrderDetails(productDetails, objSalesOrder.SalesOrderID);
            return objSalesOrder.SalesOrderID;
        }

        private void SaveSalesOrderDetails(ProductDetails productDetails, int SalesOrderID)
        {
            foreach (KeyValuePair<Product, short> pair in productDetails.products)
            {
                var objSalesOrderDetail = new SalesOrderDetail();
                objSalesOrderDetail.SalesOrderID = SalesOrderID;
                objSalesOrderDetail.OrderQty = pair.Value;
                objSalesOrderDetail.ProductID = pair.Key.ProductID;
                objSalesOrderDetail.UnitPrice = pair.Key.ListPrice;
                objSalesOrderDetail.UnitPriceDiscount = 0.00M;
                objSalesOrderDetail.LineTotal = (objSalesOrderDetail.UnitPrice * pair.Value);
                objSalesOrderDetail.ModifiedDate = DateTime.Now;
                objSalesOrderDetail.rowguid = Guid.NewGuid();
                _salesOrderDetailRepository.Add(objSalesOrderDetail);
                _unitOfWork.Commit();
            }
        }

        private ProductDetails GetListOfProductsForThisOrder(string productWithQuantity)
        {
            ProductDetails returnData = new ProductDetails();
            var productswithQuantity = productWithQuantity.Split(',');

            Dictionary<Product, short> lstProducts = new Dictionary<Product, short>();
            decimal totalPrice = 0;

            foreach (var products in productswithQuantity)
            {
                var productID = Convert.ToInt32(products.Split('|')[0]);
                var Quantity = Convert.ToInt16(products.Split('|')[1]);
                Product objProduct = _productsRepository.GetById(productID);
                lstProducts.Add(objProduct, Quantity);
                totalPrice += objProduct.ListPrice * Quantity;
            }

            returnData.products = lstProducts;
            returnData.totalPrice = totalPrice;
            return returnData;
        }

        private InvoiceDTO CreateInvoiceDTO(SalesOrderHeader salesOrder)
        {
            InvoiceDTO objInvoiceDTO = new InvoiceDTO();
            List<SalesOrderDetail> salesOrderDetails = _salesOrderDetailRepository.GetMany(x => x.SalesOrderID == salesOrder.SalesOrderID).ToList();
            List<ProductDTO> lstProduct = new List<ProductDTO>();
            foreach (SalesOrderDetail objSalesOrderDetail in salesOrderDetails)
            {
                Product objProduct = _productsRepository.GetById(objSalesOrderDetail.ProductID);
                ProductDTO objProductDTO = new ProductDTO();
                objProductDTO.Name = objProduct.Name;
                objProductDTO.OrderQty = objSalesOrderDetail.OrderQty;
                objProductDTO.LineTotal = objSalesOrderDetail.LineTotal;
                objProductDTO.UnitPrice = objSalesOrderDetail.UnitPrice;
                lstProduct.Add(objProductDTO);
            }

            objInvoiceDTO.CustomerID = salesOrder.CustomerID;
            objInvoiceDTO.SalesOrderNumber = salesOrder.SalesOrderNumber;
            objInvoiceDTO.PurchaseOrderNumber = salesOrder.PurchaseOrderNumber;
            objInvoiceDTO.Title = salesOrder.Customer.Title;
            objInvoiceDTO.FirstName = salesOrder.Customer.FirstName;
            objInvoiceDTO.MiddleName = salesOrder.Customer.MiddleName;
            objInvoiceDTO.LastName = salesOrder.Customer.LastName;
            objInvoiceDTO.OrderDate = salesOrder.OrderDate;
            objInvoiceDTO.DueDate = salesOrder.DueDate;
            objInvoiceDTO.ShipDate = salesOrder.ShipDate;
            objInvoiceDTO.SubTotal = decimal.Round(salesOrder.SubTotal, 2, MidpointRounding.AwayFromZero);
            objInvoiceDTO.TaxAmt = decimal.Round(salesOrder.TaxAmt, 2, MidpointRounding.AwayFromZero);
            objInvoiceDTO.Freight = decimal.Round(salesOrder.Freight, 2, MidpointRounding.AwayFromZero);
            objInvoiceDTO.TotalDue = decimal.Round(salesOrder.TotalDue, 2, MidpointRounding.AwayFromZero);
            List<CustomerAddress> lstCustomerAddress = _customerAddressRepository.GetMany(x => x.CustomerID == salesOrder.CustomerID).ToList();

            foreach (CustomerAddress customerAddress in lstCustomerAddress)
            {
                Address objAddress = _addressRepository.GetById(customerAddress.AddressID);

                if (customerAddress.AddressType.Equals("Shipping"))
                {
                    objInvoiceDTO.ShippingAddressLine1 = objAddress.AddressLine1;
                    objInvoiceDTO.ShippingAddressLine2 = objAddress.AddressLine2;
                    objInvoiceDTO.ShippingCity = objAddress.City;
                    objInvoiceDTO.ShippingStateProvince = objAddress.StateProvince;
                    objInvoiceDTO.ShippingCountryRegion = objAddress.CountryRegion;
                    objInvoiceDTO.ShippingPostalCode = objAddress.PostalCode;
                }
                else
                {
                    objInvoiceDTO.BillingAddressLine1 = objAddress.AddressLine1;
                    objInvoiceDTO.BillingAddressLine2 = objAddress.AddressLine2;
                    objInvoiceDTO.BillingCity = objAddress.City;
                    objInvoiceDTO.BillingStateProvince = objAddress.StateProvince;
                    objInvoiceDTO.BillingCountryRegion = objAddress.CountryRegion;
                    objInvoiceDTO.BillingPostalCode = objAddress.PostalCode;
                }
            }
            objInvoiceDTO.products = lstProduct;
            return objInvoiceDTO;
        }

        #endregion SalesHeader

    }

    public class ProductDetails
    {
        public decimal totalPrice { get; set; }
        public Dictionary<Product, short> products { get; set; }
    }
}
