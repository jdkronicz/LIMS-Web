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
    public class WorkinProgressController : ApiController
    {


        ISampleService _sampleservice;

        public WorkinProgressController(ISampleService sampleservice)
        {

            this._sampleservice = sampleservice;
        }
        [Authorize]
        [Route("")]
        public IList<Sample> Get(int companyId, int currentPage, int pageCount, string sort, bool reverse)
        {
            return _sampleservice.GetWorkInProgress( companyId, currentPage, pageCount, sort, reverse);
        }
      
    }


}
