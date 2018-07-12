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

    public partial class RepResult : Entity<RepResult>
    {
        public RepResult()
        {
           // this.Report = new HashSet<Report>();
        }
    
        public int RepID { get; set; }
        public int MethParaID { get; set; }
        public float? Value { get; set; }
        public string ValueString { get; set; }
        public int StatusID { get; set; }
        public bool Reject { get; set; }
        public string Note { get; set; }
        public int QualID { get; set; }
        public int SampMethParaID { get; set; }
        public System.DateTime? CompDate { get; set; }
        public int? AnalystID { get; set; }
        public int UnitsID { get; set; }
        public short RoundMeth { get; set; }
        public short NumDigits { get; set; }
        public float PQL { get; set; }
        public string PQL_String { get; set; }
        public int? OldRR_ID { get; set; }
        [Key]
        public int RR_ID { get; set; }
        public byte[] SSMA_TimeStamp { get; set; }
    
        public virtual MethPara MethPara { get; set; }
       // public virtual ICollection<Report> Report { get; set; }
    }
}
