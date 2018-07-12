using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Model
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;

    public partial class SampleSearch
    {
        public int ReportNumber { get; set; }
        public string Product { get; set; }
        public string SubLotNumber { get; set; }
        public string ReceiptfromDT { get; set; }
        public string ReceipttoDT { get; set; }

        
            
            

    }
}
