using Application.WebUI;
using Application.Common.Contracts;
using Application.Common.Implementations;
using Application.DAL.Contracts;
using Application.DAL.Implementations;
using Application.Repository;
using Application.Service.Contracts;
using Application.Service.Implementations;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using System.Web.Http.Controllers;
using System.Web.Http;

namespace Application.WebUI
{
    public class DependencyInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
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
                            .Where(type => type.Name.EndsWith("Repository")).WithServiceAllInterfaces().LifestylePerWebRequest()
 
                             //All repoistories
                //Classes.FromAssembly(Assembly.GetAssembly(typeof(ReferenceDataRepository))).InSameNamespaceAs<ReferenceDataRepository>().WithService.DefaultInterfaces().LifestyleTransient(),

                //All services
                //Classes.FromAssembly(Assembly.GetAssembly(typeof(ReferenceDataService))).InSameNamespaceAs<ReferenceDataService>().WithService.DefaultInterfaces().LifestyleTransient()

                        );

            //container.Register(
            //    //All MVC controllers
            //    //Classes.FromThisAssembly().BasedOn<IController>().LifestyleTransient(),
            //    Classes.FromThisAssembly().BasedOn<ApiController>().LifestyleTransient()
            //    );
        }

    }
}
