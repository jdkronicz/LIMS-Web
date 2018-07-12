//------------------------------------------------------------------------------
// <auto-generated
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated
//------------------------------------------------------------------------------

namespace Application.Model
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public partial class CustAddr
    {
        public string AddressType { get; set; }
        public int CustID { get; set; }
        public string Addr1 { get; set; }
        public string Addr2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Zip { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string Line1 { get; set; }
        public string Line2 { get; set; }
        public string Line3 { get; set; }
        public string Line4 { get; set; }
        public string Line5 { get; set; }
        public bool International { get; set; }
        public bool Review { get; set; }
        public bool Flag { get; set; }
        public int OldCustAddrID { get; set; }
        [Key]
        public int AddressID { get; set; }
        public byte[] SSMA_TimeStamp { get; set; }
    
        public virtual Customer Customer { get; set; }
    }
}
