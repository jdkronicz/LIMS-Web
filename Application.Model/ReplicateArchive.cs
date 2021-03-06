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

    public partial class ReplicateArchive
    {
        public ReplicateArchive()
        {
            this.RepResultArchives = new HashSet<RepResultArchive>();
        }
    
        public int SampID { get; set; }
        public int RepNum { get; set; }
        public int StatusID { get; set; }
        public int BatchID { get; set; }
        public string RepNumber { get; set; }
        public bool Base { get; set; }
        public int BatchSortOrder { get; set; }
        public int OldRepID { get; set; }
        [Key]
        public int RepID { get; set; }
        public bool Artificial { get; set; }
        public bool Archived { get; set; }
        public byte[] SSMA_TimeStamp { get; set; }
    
        public virtual SampleArchive SampleArchive { get; set; }
        public virtual ICollection<RepResultArchive> RepResultArchives { get; set; }
    }
}
