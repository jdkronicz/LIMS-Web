//using Application.Common.Contracts;
//using Application.Common.Implementations;
//using Application.DAL.Contracts;
//using Application.DAL.Implementations;
using Castle.MicroKernel.Registration;
using Castle.MicroKernel.SubSystems.Configuration;
using Castle.Windsor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Dependencies;
using Castle.MicroKernel.Lifestyle;
namespace Application.WebUI
{
    internal class WindsorDependencyScope : IDependencyScope
    {
        private readonly IWindsorContainer _container;
        private readonly IDisposable _scope;

        public WindsorDependencyScope(IWindsorContainer container)
        {
            if (container == null)
            {
                throw new ArgumentNullException("container");
            }

            _container = container;
            _scope = container.BeginScope();
        }

        public object GetService(Type t)
        {
            return _container.Kernel.HasComponent(t)
            ? _container.Resolve(t) : null;
        }

        public IEnumerable<object> GetServices(Type t)
        {
            return _container.ResolveAll(t)
            .Cast<object>().ToArray();
        }

        public void Dispose()
        {
            _scope.Dispose();
        }
    }
}