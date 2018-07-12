//Copyright © PennDOT BPR 2016

using Application.Common.Contracts;
using Application.Common.Implementations;
using Application.DAL.Contracts;
using Application.DAL.Implementations;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using System.Web.Http;
using System.Web.Http.Controllers;
namespace Application.WebUI
{
    public class ControllerInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(
                //All MVC controllers
                //Classes.FromThisAssembly().BasedOn<IController>().LifestyleTransient(),
                Classes.FromThisAssembly().BasedOn<ApiController>().LifestyleTransient()
                );
            container.Register(
                       Component.For<ILogService>()
                           .ImplementedBy<LogService>()
                           .LifeStyle.PerWebRequest,

                       Component.For<IDatabaseFactory>()
                           .ImplementedBy<DatabaseFactory>()
                           .LifeStyle.PerWebRequest,

                       Component.For<IUnitOfWork>()
                           .ImplementedBy<UnitOfWork>()
                           .LifeStyle.PerWebRequest,

                    Classes.FromThisAssembly().BasedOn<IHttpController>().LifestyleTransient(),

                       Classes.FromAssemblyNamed("Application.Service")
                           .Where(type => type.Name.EndsWith("Service")).WithServiceAllInterfaces().LifestylePerWebRequest(),

                       Classes.FromAssemblyNamed("Application.Repository")
                           .Where(type => type.Name.EndsWith("Repository")).WithServiceAllInterfaces().LifestylePerWebRequest());

            //     container.Register(Classes.FromThisAssembly()
            //.Pick().If(t => t.Name.EndsWith("Controller"))
            //.Configure(configurer => configurer.Named(configurer.Implementation.Name))
            //.LifestylePerWebRequest());

        }
    }
}