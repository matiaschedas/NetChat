using System;
using System.Collections.Generic;
using System.IO.Compression;
using System.Linq;
using System.Threading.Tasks;
using Application.Channels;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Persistence;
using FluentValidation.AspNetCore;
using API.Middleware;
using Application.Interfaces;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using AutoMapper;
using Infrastructure.MediaUpload;
using Application.MediaUpload;
using API.SignalR;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services
            .AddControllers(opt => 
            {
                var policy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .Build();
                opt.Filters.Add(new AuthorizeFilter(policy));
            })
            .AddFluentValidation(cfg => {
                cfg.RegisterValidatorsFromAssemblyContaining<Create>();
            });

           /* services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
            });*/
            services.AddDbContext<DataContext>(x => {
                //x.UseLazyLoadingProxies();
                x.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
            });
            services.AddCors(opt => {
                opt.AddPolicy("CorsPolicy", policyBuilder =>
                {
                    var origins = (Configuration["AllowedOrigins"] ?? "")
                        .Split(',', StringSplitOptions.RemoveEmptyEntries)
                        .Select(o => o.Trim())
                        .ToArray();

                    if (origins.Length == 0)
                    {
                        // En producción, si no hay orígenes, simplemente no permite nada
                        policyBuilder
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .SetIsOriginAllowed(_ => false); // bloquea todos los orígenes
                    }
                    else
                    {
                        policyBuilder
                            .WithOrigins(origins)
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                    }
                });
            });
            services.AddMediatR(typeof(List.Handler).Assembly);
            var builder = services.AddIdentityCore<AppUser>();
            var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);
            identityBuilder.AddEntityFrameworkStores<DataContext>();
            identityBuilder.AddSignInManager<SignInManager<AppUser>>();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"]));
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(
                opt => {
                    opt.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateAudience = false,
                        ValidateIssuer = false
                    };
                    opt.Events = new JwtBearerEvents { 
                        OnMessageReceived = context => {
                            var accessToken = context.Request.Query["access_token"];
                            var path = context.HttpContext.Request.Path;
                            if(!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chat")){
                                context.Token = accessToken;
                            }
                            return Task.CompletedTask;
                        }
                    };
                }
            );
            services.AddScoped<IJwtGenerator, JwtGenerator>();
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
            services.Configure<CloudinarySettings>(Configuration.GetSection("Cloudinary"));
            services.AddScoped<IMediaUpload, MediaUpload>();
            services.AddSignalR();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ErrorHandlingMiddleware>();
            
            if (env.IsDevelopment())
            {
                //app.UseDeveloperExceptionPage();
                //app.UseSwagger();
                //app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
            }
            if (!env.IsDevelopment())
            {
                app.UseHttpsRedirection();
                app.UseHsts();
            }
            app.UseCors("CorsPolicy");
            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            using (var scope = app.ApplicationServices.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<DataContext>();
                    context.Database.Migrate(); // Aplica migraciones pendientes o crea la DB si no existe
                    context.Database.ExecuteSqlRaw("DELETE FROM Channels");
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Startup>>();
                    logger.LogError(ex, "Ocurri� un error al aplicar las migraciones autom�ticamente.");
                }
            }



            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<ChatHub>("/chat");
            });

        }
    }
}
