﻿using Castle.MicroKernel.Context;
using Castle.MicroKernel.Lifestyle.Scoped;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Application.WebUI
{
    public class ControllerInstaller : IWindsorInstaller
    {
        public void Install(IWindsorContainer container, IConfigurationStore store)
        {
            //container.Register(Classes.FromThisAssembly()
            //.Pick().If(t => t.Name.EndsWith("Controller"))
            //.Configure(configurer => configurer.Named(configurer.Implementation.Name))
            //.LifestylePerWebRequest());

            container.Register(Classes.FromAssemblyNamed("Application.Service")
                         .Where(type => type.Name.EndsWith("Service")).WithServiceAllInterfaces().LifestylePerWebRequest());

        }
    }
}