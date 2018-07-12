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

    public partial class WorkOrder : Entity<WorkOrder>
    {
        public WorkOrder()
        {
           //  this.Reports = new HashSet<Report>();
          // this.Samples = new HashSet<Sample>();
        }

        public int CustID { get; set; }
        public System.DateTime? ReceiptDate { get; set; }
        public System.DateTime? CompDate { get; set; }
        public int StatusID { get; set; }
        public string WO_Num { get; set; }
        public int MatrixID { get; set; }
        public int TAT { get; set; }
        public System.DateTime? DueDate { get; set; }
        public bool? COC { get; set; }
        public int ReceiptMeth { get; set; }
        public int RepType { get; set; }
        public int RepNorm { get; set; }
        public bool? RepShowAvg { get; set; }
        public bool? Rep1PerPage { get; set; }
        public string PO_Num { get; set; }
      //  public string Notes { get; set; }
        //public string QualNotes { get; set; }
       // public string RepNotes { get; set; }
        public int? OldWO_ID { get; set; }
        [Key]
        public int WO_ID { get; set; }
        public byte[] SSMA_TimeStamp { get; set; }
        public virtual Matrix Matrix { get; set; }
        // public virtual Customer Customer { get; set; }
        //public virtual ICollection<Report> Reports { get; set; }
        //public virtual ICollection<Sample> Samples { get; set; }
    }
}