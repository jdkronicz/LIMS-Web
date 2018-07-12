using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using Autofac;
using Application.DAL;
using Application.Repository.Common;
using Application.WebUI.Providers;
using Microsoft.Owin.Security.OAuth;
using Application.Service;

namespace Application.WebUI
{
    

    public class EFModule : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
          
            builder.RegisterModule(new RepositoryModule());
            // builder.Register(c => new SimpleAuthorizationServerProvider(c.Resolve<IContactService>())).AsImplementedInterfaces().SingleInstance();
            //builder.RegisterType<ContactService>().AsSelf().SingleInstance();
            // builder.RegisterType(typeof(SimpleAuthorizationServerProvider)).As(typeof(IOAuthAuthorizationServerProvider)).InstancePerRequest();
            builder.RegisterType(typeof(ApplicationContext)).As(typeof(DbContext)).InstancePerLifetimeScope();
            builder.RegisterType(typeof(UnitOfWork)).As(typeof(IUnitOfWork)).InstancePerRequest();         

        }

    }
}