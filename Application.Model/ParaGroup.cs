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

    public partial class ParaGroup
    {
        public string ParaGroupName { get; set; }
        public string ParaGroupDesc { get; set; }
        public int OldParaGroupID { get; set; }
        [Key]
        public int ParaGroupID { get; set; }
    }
}