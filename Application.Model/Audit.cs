
namespace Application.Model
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public partial class Audit
    {
        [Key]
        public int AuditRecordID { get; set; }
        public string TYPE { get; set; }
        public string TableName { get; set; }
        public string PK { get; set; }
        public string FieldName { get; set; }
        public string OldValue { get; set; }
        public string NewValue { get; set; }
        public System.DateTime UpdateDate { get; set; }
        public string UserName { get; set; }
    }
}
