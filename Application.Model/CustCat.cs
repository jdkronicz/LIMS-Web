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

    public partial class CustCat
    {
        [Key]
        public int CustCatID { get; set; }
        public string CustCatShort { get; set; }
        public string CustCatLong { get; set; }
        public short SortOrder { get; set; }
    }
}
