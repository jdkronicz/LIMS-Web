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

    public partial class CustMeth
    {
        public int CustID { get; set; }
        public int MethID { get; set; }
        public string MethDesc { get; set; }
        public int OldCustMethID { get; set; }
        [Key]
        public int CustMethID { get; set; }
    }
}
