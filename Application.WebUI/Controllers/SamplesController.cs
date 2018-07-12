//using Application.Common.Contracts;
using Application.Model;
using Application.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Web.Http;

namespace Application.WebUI.Controllers
{
    [RoutePrefix("api/Samples")]
    public class SamplesController : ApiController
    {


        ISampleService _sampleservice;

        public SamplesController(ISampleService sampleservice)
        {

            this._sampleservice = sampleservice;
        }

        [Authorize]
        [Route("")]
        public IList<Sample> Get(int companyId, int currentPage, int pageCount, string sort, bool reverse)
        {
            IList<Sample> ss= _sampleservice.GetWorkInProgress(companyId, currentPage, pageCount, sort, reverse);
            return ss;
        }
        [Authorize]
        [Route("")]
        public int Get(int companyId)
        {
            return _sampleservice.GetWorkInProgress(companyId);
            
        }
        [Authorize]
        [Route("")]
        public int Get(string reportNumber, string product, string subLotNumber, string receiptfromDT, string receipttoDT,int companyId)
        {
            return _sampleservice.GetCount(reportNumber, product, subLotNumber, receiptfromDT, receipttoDT, companyId);
        }
        [Authorize]
        [Route("")]
        public IList<Sample> Get(string reportNumber, string product, string subLotNumber, string receiptfromDT, string receipttoDT,int companyId,int currentPage,int pageCount,string sort,bool reverse)
        {
            //ClaimsPrincipal principal = Request.GetRequestContext().Principal as ClaimsPrincipal;

            //var Name = ClaimsPrincipal.Current.Identity.Name;
            //var Name1 = User.Identity.Name;
            //_productService.
            //var userName = principal.Claims.Where(c => c.Type == "sub").Single().Value;
            //var contacts = null;// _productservice.GetById(2);
          
            IList<Sample> sam = _sampleservice.GetAll( reportNumber,  product,  subLotNumber,  receiptfromDT, receipttoDT, companyId, currentPage,pageCount, sort, reverse);
            //sam = sam.Select(m => new Sample
            //{
            //    SampNum = m.SampNum,
            //    LotNum=m.LotNum,
            //    Product=m.Product,
            //    SubLotNum=m.SubLotNum,
            //    WorkOrder=m.WorkOrder,
            //    SampID=m.SampID,
            //    //RR_Reports=m.RR_Reports.GroupBy(x=>x.Report).Select(x=> new RR_Report
            //    //{
            //    //    ReportID=x.Key.ReportID,
            //    //    //RR_ID=x.RR_ID,
            //    //    //RR_ReportID=x.RR_ReportID,
            //    //    //SampID=x.SampID,
            //    //    Report=x.Key,
            //    //    RepResult=m.RR_Reports.Where(z => z.ReportID == x.Key.ReportID).Select(s=>s.RepResult).ToList()


            //    //}).ToList()
            //    // Reports = m.RR_Reports.Select(x=>x.Report).ToList()
            //    Reportnews = m != null ? (m.RR_Reports.GroupBy(x => x.Report).Select(g => new Report
            //    {
            //        ReportNum = g.Key.ReportNum != null ? g.Key.ReportNum : null,
            //       // ReportFile=g.Key.ReportFile,
            //        ReportID=g.Key.ReportID,
            //         RepResults = m.RR_Reports.Where(v => v.ReportID == g.Key.ReportID).Select(n => n.RepResult).ToList()

            //    }).ToList()) : null
            //}).ToList();

            return sam;
        }

    }

    
}
