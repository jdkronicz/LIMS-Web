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
    [RoutePrefix("api/Contacts")]
    public class ContactsController : ApiController
    {


        IContactService contactService;

        public ContactsController(IContactService contactService)
        {

            this.contactService = contactService;
        }
       // [Authorize]
        [Route("")]
        public Contact Get(string userName,string password)
        {
          
            var contacts = contactService.VerifyUser(userName,password);
            return contacts;
        }
      
        public IList<Contact> Get(string email)
        {

            var contacts = contactService.GetByCompanyEmail(email);
            return contacts;
        }
    }


   
}
