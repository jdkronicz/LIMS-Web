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

    public partial class BatchDetArchive
    {
        public int BatchID { get; set; }
        public int MethParaID { get; set; }
        public int OldBatchDetID { get; set; }
        [Key]
        public int BatchDetID { get; set; }
    
        public virtual BatchArchive BatchArchive { get; set; }
    }
}
