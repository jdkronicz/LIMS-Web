//------------------------------------------------------------------------------
// <auto-generated>
//    This code was generated from a template.
//
//    Manual changes to this file may cause unexpected behavior in your application.
//    Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace Application.Model
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public partial class BatchArchive
    {
        public BatchArchive()
        {
            this.BatchDetArchives = new HashSet<BatchDetArchive>();
        }
    
        public string BatchNum { get; set; }
        public int MethID { get; set; }
        public int AnalystID { get; set; }
        public System.DateTime Created { get; set; }
        public int StatusID { get; set; }
        public int InstrumentID { get; set; }
        public System.DateTime Start { get; set; }
        public System.DateTime End { get; set; }
        public int OldBatchID { get; set; }
        [Key]
        public int BatchID { get; set; }
        public bool Artificial { get; set; }
        public byte[] SSMA_TimeStamp { get; set; }
    
        public virtual ICollection<BatchDetArchive> BatchDetArchives { get; set; }
    }
}
