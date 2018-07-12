
//using Castle.Windsor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Dispatcher;

using System.Web.Routing;
using Microsoft.Owin;

using Microsoft.Owin.Security.OAuth;
//using Castle.Windsor.Installer;

namespace Application.WebUI
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class WebApiApplication : System.Web.HttpApplication
    {
       // private readonly IWindsorContainer container;

        public WebApiApplication()
        {
           // this.container =
            //    new WindsorContainer().Install(new DependencyInstaller());


           // container = new WindsorContainer();
          //  container.Install(FromAssembly.Containing<DependencyInstaller>());
            //container.Install(FromAssembly.This());
        }

        public override void Dispose()
        {
            //this.container.Dispose();
            //base.Dispose();
        }
      

        protected void Application_Start()
        {
            
            //GlobalConfiguration.Configuration.Services.Replace(
            //    typeof(IHttpControllerActivator),
             //   new WindsorActivator(this.container));

           
        }
    }
}