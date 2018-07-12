using Application.WebUI.Providers;
using Autofac.Integration.Mvc;
using Autofac;
using Microsoft.Owin;

using Microsoft.Owin.Security.OAuth;
using Owin;
using System;
using System.Collections.Generic;

using System.Linq;
using System.Web;
using System.Web.Http;
using Autofac.Integration.WebApi;
using System.Reflection;
using Application.Service;

[assembly: OwinStartup(typeof(Application.WebUI.Startup))]

namespace Application.WebUI
{
    public class Startup
    {
        public static OAuthBearerAuthenticationOptions OAuthBearerOptions { get; private set; }
     

        public void Configuration(IAppBuilder app)
        {
            //Autofac Configuration
            var builder = new ContainerBuilder();

            // Get your HttpConfiguration.
            var config = GlobalConfiguration.Configuration;

            // Register your Web API controllers.
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());
            builder.RegisterModule(new RepositoryModule());
            builder.RegisterModule(new ServiceModule());
            builder.RegisterModule(new EFModule());
            // builder.RegisterType<ContactService>().InstancePerDependency();
            // builder.RegisterType<ContactService>().InstancePerLifetimeScope();

            //builder.RegisterType<ContactService>().As<IContactService>().SingleInstance();
            //b//uilder.RegisterType<SimpleAuthorizationServerProvider>().As<IOAuthAuthorizationServerProvider>().InstancePerRequest();
            //builder.Register(c => c.Resolve<IOAuthAuthorizationServerProvider>().SimpleAuthorizationServerProvider).As<IStorage>();
            //builder.RegisterGeneric(typeof(SimpleAuthorizationServerProvider)).As(typeof(IOAuthAuthorizationServerProvider)).InstancePerDependency();
            // OPTIONAL: Register the Autofac filter provider.
            builder.RegisterWebApiFilterProvider(config);

            // Set the dependency resolver to be Autofac.
            var container = builder.Build();
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);


            //builder.RegisterControllers(typeof(MvcApplication).Assembly).PropertiesAutowired();

            //builder.RegisterModule(new RepositoryModule());
            //builder.RegisterModule(new ServiceModule());
            //builder.RegisterModule(new EFModule());

            //var container = builder.Build();

            //DependencyResolver.SetResolver(new AutofacDependencyResolver(container));

            //var container = new WindsorContainer().Install(
            //new ControllerInstaller(),
            //new DefaultInstaller());
            //var httpDependencyResolver = new WindsorHttpDependencyResolver(container);

            //HttpConfiguration config = new HttpConfiguration();
            //config.MapHttpAttributeRoutes();
            //config.DependencyResolver = httpDependencyResolver;



            ConfigureOAuth(app, container);

            WebApiConfig.Register(config);
            app.UseCors(Microsoft.Owin.Cors.CorsOptions.AllowAll);
            app.UseWebApi(config);
           // Database.SetInitializer(new MigrateDatabaseToLatestVersion<AuthContext, Application.WebUI.Migrations.Configuration>());

        }

        public void ConfigureOAuth(IAppBuilder app, IContainer container)
        {
            //use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseExternalSignInCookie(Microsoft.AspNet.Identity.DefaultAuthenticationTypes.ExternalCookie);
            OAuthBearerOptions = new OAuthBearerAuthenticationOptions();

            OAuthAuthorizationServerOptions OAuthServerOptions = new OAuthAuthorizationServerOptions() {

                AllowInsecureHttp = true,
                TokenEndpointPath = new PathString("/token"),
                AccessTokenExpireTimeSpan = TimeSpan.FromMinutes(30),
                //  Provider = new SimpleAuthorizationServerProvider(),
                Provider = new SimpleAuthorizationServerProvider(container),
      RefreshTokenProvider = new SimpleRefreshTokenProvider()
            };

            // Token Generation
            app.UseOAuthAuthorizationServer(OAuthServerOptions);
            app.UseOAuthBearerAuthentication(OAuthBearerOptions);

            ////Configure Google External Login
            //googleAuthOptions = new GoogleOAuth2AuthenticationOptions()
            //{
            //    ClientId = "xxxxxx",
            //    ClientSecret = "xxxxxx",
            //    Provider = new GoogleAuthProvider()
            //};
            //app.UseGoogleAuthentication(googleAuthOptions);

            ////Configure Facebook External Login
            //facebookAuthOptions = new FacebookAuthenticationOptions()
            //{
            //    AppId = "xxxxxx",
            //    AppSecret = "xxxxxx",
            //    Provider = new FacebookAuthProvider()
            //};
            //app.UseFacebookAuthentication(facebookAuthOptions);

        }
    }

}