using Application.DAL.Contracts;
using Application.Model;
using Application.Model.DTO;
using Application.Repository;
using Application.Service.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Web.Security;

namespace Application.Service.Implementations
{
    public class CustomerService : ICustomerService
    {
        IUnitOfWork _unitOfWork;
        ICustomerRepository _customerRepository;
        IAddressRepository _addressRepository;
        ICustomerAddressRepository _customerAddressRepository;

        public CustomerService(
            IUnitOfWork unitOfWork,
            ICustomerRepository customerRepository,
            ICustomerAddressRepository customerAddressRepository,
            IAddressRepository addressRepository)
        {
            this._unitOfWork = unitOfWork;
            this._customerRepository = customerRepository;
            this._customerAddressRepository = customerAddressRepository;
            this._addressRepository = addressRepository;
        }

        //Below method will create any random strigs of given size. Basically this type of algorithm reads the memory at random locations to form
        //the complete random string each time
        private static string CreateSalt(int size)
        {
            // Generate a cryptographic random number using the cryptographic
            // service provider
            RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
            byte[] buff = new byte[size];
            rng.GetBytes(buff);
            // Return a Base64 string representation of the random number
            return Convert.ToBase64String(buff);
        }

        //The salt created in above function will be appended to the real password
        //and again SHA1 algorithm will be used to generate the hash which will eventually stored in database
        private static string CreatePasswordHash(string pwd, string salt)
        {
            string saltAndPwd = String.Concat(pwd, salt);
            string hashedPwd =saltAndPwd;
            hashedPwd = String.Concat(hashedPwd, salt);
            return hashedPwd;
        }

        public CustomerDTO ValidateCustomer(int id, string password)
        {
            Customer objCustomer = _customerRepository.GetById(id);
            if (objCustomer == null)
                return null;
            string strPasswordHash = objCustomer.PasswordHash;
            string strPasswordSalt = strPasswordHash.Substring(strPasswordHash.Length - 8);
            string strPasword = CreatePasswordHash(password, strPasswordSalt);

            if (strPasword.Equals(strPasswordHash))
                return CreateCustomerDTO(objCustomer);
            else
                return null;
        }

        public int SaveOrUpdateCustomer(CustomerDTO customer)
        {
            string passwordSalt = CreateSalt(5);
            string pasword = CreatePasswordHash(customer.Password, passwordSalt);
            Customer objCustomer;

            if (customer.CustomerID != 0)
                objCustomer = _customerRepository.GetById(customer.CustomerID);
            else
                objCustomer = new Customer();

            objCustomer.NameStyle = customer.NameStyle;
            objCustomer.Title = customer.Title;
            objCustomer.FirstName = customer.FirstName;
            objCustomer.MiddleName = customer.MiddleName;
            objCustomer.LastName = customer.LastName;
            objCustomer.Suffix = customer.Suffix;
            objCustomer.CompanyName = customer.CompanyName;
            objCustomer.SalesPerson = customer.SalesPerson;
            objCustomer.EmailAddress = customer.EmailAddress;
            objCustomer.Phone = customer.Phone;
            objCustomer.PasswordHash = pasword;
            objCustomer.PasswordSalt = passwordSalt;
            objCustomer.ModifiedDate = DateTime.Now;
            objCustomer.rowguid = Guid.NewGuid();

            if (customer.CustomerID != 0)
                _customerRepository.Update(objCustomer);
            else
                _customerRepository.Add(objCustomer);

            _unitOfWork.Commit();
            SaveOrUpdateAddress(customer, objCustomer.CustomerID);
            return objCustomer.CustomerID;
        }

        private void SaveOrUpdateAddress(CustomerDTO customer, int customerID)
        {
            List<CustomerAddress> lstCustomerAddress = _customerAddressRepository.GetMany(x => x.CustomerID == customer.CustomerID).ToList();

            if (lstCustomerAddress.Count == 0)
            {
                Address objBillingAddress = new Address();
                objBillingAddress.AddressLine1 = customer.BillingAddressLine1;
                objBillingAddress.AddressLine2 = customer.BillingAddressLine2;
                objBillingAddress.City = customer.BillingCity;
                objBillingAddress.StateProvince = customer.BillingStateProvince;
                objBillingAddress.CountryRegion = customer.BillingCountryRegion;
                objBillingAddress.PostalCode = customer.BillingPostalCode;
                objBillingAddress.ModifiedDate = DateTime.Now;
                objBillingAddress.rowguid = Guid.NewGuid();
                _addressRepository.Add(objBillingAddress);
                _unitOfWork.Commit();

                CustomerAddress objCustomerBillingAddress = new CustomerAddress();
                objCustomerBillingAddress.CustomerID = customerID;
                objCustomerBillingAddress.AddressID = objBillingAddress.AddressID;
                objCustomerBillingAddress.AddressType = "Main Office";
                objCustomerBillingAddress.ModifiedDate = DateTime.Now;
                objCustomerBillingAddress.rowguid = Guid.NewGuid();
                _customerAddressRepository.Add(objCustomerBillingAddress);
                _unitOfWork.Commit();

                Address objShippingAddress = new Address();
                objShippingAddress.AddressLine1 = customer.ShippingAddressLine1;
                objShippingAddress.AddressLine2 = customer.ShippingAddressLine2;
                objShippingAddress.City = customer.ShippingCity;
                objShippingAddress.StateProvince = customer.ShippingStateProvince;
                objShippingAddress.CountryRegion = customer.ShippingCountryRegion;
                objShippingAddress.PostalCode = customer.ShippingPostalCode;
                objShippingAddress.ModifiedDate = DateTime.Now;
                objShippingAddress.rowguid = Guid.NewGuid();
                _addressRepository.Add(objShippingAddress);
                _unitOfWork.Commit();

                CustomerAddress objCustomerShippingAddress = new CustomerAddress();
                objCustomerShippingAddress.CustomerID = customerID;
                objCustomerShippingAddress.AddressID = objShippingAddress.AddressID;
                objCustomerShippingAddress.AddressType = "Shipping";
                objCustomerShippingAddress.ModifiedDate = DateTime.Now;
                objCustomerShippingAddress.rowguid = Guid.NewGuid();
                _customerAddressRepository.Add(objCustomerShippingAddress);
                _unitOfWork.Commit();
            }
            else
            {
                foreach (CustomerAddress objCustomerAddress in lstCustomerAddress)
                {
                    Address objAddress = _addressRepository.GetById(objCustomerAddress.AddressID);

                    if (objCustomerAddress.AddressType.Equals("Shipping"))
                    {
                        objAddress.AddressLine1 = customer.ShippingAddressLine1;
                        objAddress.AddressLine2 = customer.ShippingAddressLine2;
                        objAddress.City = customer.ShippingCity;
                        objAddress.StateProvince = customer.ShippingStateProvince;
                        objAddress.CountryRegion = customer.ShippingCountryRegion;
                        objAddress.PostalCode = customer.ShippingPostalCode;
                        objAddress.ModifiedDate = DateTime.Now;
                        objAddress.rowguid = Guid.NewGuid();
                        _addressRepository.Update(objAddress);
                        _unitOfWork.Commit();
                    }
                    else
                    {
                        objAddress.AddressLine1 = customer.BillingAddressLine1;
                        objAddress.AddressLine2 = customer.BillingAddressLine2;
                        objAddress.City = customer.BillingCity;
                        objAddress.StateProvince = customer.BillingStateProvince;
                        objAddress.CountryRegion = customer.BillingCountryRegion;
                        objAddress.PostalCode = customer.BillingPostalCode;
                        objAddress.ModifiedDate = DateTime.Now;
                        objAddress.rowguid = Guid.NewGuid();
                        _addressRepository.Update(objAddress);
                        _unitOfWork.Commit();
                    }
                }
            }
        }

        private CustomerDTO CreateCustomerDTO(Customer customer)
        {
            CustomerDTO objCustomerDTO = new CustomerDTO();
            objCustomerDTO.CustomerID = customer.CustomerID;
            objCustomerDTO.NameStyle = customer.NameStyle;
            objCustomerDTO.Title = customer.Title;
            objCustomerDTO.FirstName = customer.FirstName;
            objCustomerDTO.MiddleName = customer.MiddleName;
            objCustomerDTO.LastName = customer.LastName;
            objCustomerDTO.Suffix = customer.Suffix;
            objCustomerDTO.CompanyName = customer.CompanyName;
            objCustomerDTO.SalesPerson = customer.SalesPerson;
            objCustomerDTO.EmailAddress = customer.EmailAddress;
            objCustomerDTO.Phone = customer.Phone;
            objCustomerDTO.Password = customer.PasswordHash;

            List<CustomerAddress> lstCustomerAddress = _customerAddressRepository.GetMany(x => x.CustomerID == customer.CustomerID).ToList();

            foreach (CustomerAddress customerAddress in lstCustomerAddress)
            {
                Address objAddress = _addressRepository.GetById(customerAddress.AddressID);

                if (customerAddress.AddressType.Equals("Shipping"))
                {
                    objCustomerDTO.ShippingAddressLine1 = objAddress.AddressLine1;
                    objCustomerDTO.ShippingAddressLine2 = objAddress.AddressLine2;
                    objCustomerDTO.ShippingCity = objAddress.City;
                    objCustomerDTO.ShippingStateProvince = objAddress.StateProvince;
                    objCustomerDTO.ShippingCountryRegion = objAddress.CountryRegion;
                    objCustomerDTO.ShippingPostalCode = objAddress.PostalCode;
                }
                else
                {
                    objCustomerDTO.BillingAddressLine1 = objAddress.AddressLine1;
                    objCustomerDTO.BillingAddressLine2 = objAddress.AddressLine2;
                    objCustomerDTO.BillingCity = objAddress.City;
                    objCustomerDTO.BillingStateProvince = objAddress.StateProvince;
                    objCustomerDTO.BillingCountryRegion = objAddress.CountryRegion;
                    objCustomerDTO.BillingPostalCode = objAddress.PostalCode;
                }
            }
            return objCustomerDTO;
        }
    }
}
