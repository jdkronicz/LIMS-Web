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
    [RoutePrefix("api/Repots")]
    public class ReportsController : ApiController
    {


        IReportService _reportservice;

        public ReportsController(IReportService reportservice)
        {

            this._reportservice = reportservice;
        }
        [Authorize]
        [Route("")]
        public HttpResponseMessage Post(Report report)

        {
            
                byte[] reportFile = _reportservice.GetById(report);
            

            System.IO.MemoryStream m_stream = new System.IO.MemoryStream(reportFile);


            // Get the export stream 

           // m_stream = (System.IO.MemoryStream);

            m_stream.Position = 0;




            var response = Request.CreateResponse(HttpStatusCode.Accepted);

            response.Headers.Clear();

            response.Content = new StreamContent(m_stream);




            return response;

        }

    }


}
