using Castle.MicroKernel;
using Castle.MicroKernel.Lifestyle.Scoped;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.WebUI
{
    public class DefaultInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            container.Register(Classes.FromThisAssembly()
                .Pick()
                .WithServiceDefaultInterfaces()
                .Configure(c => c.LifestyleTransient()));
        }
    }
}