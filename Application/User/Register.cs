using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Threading;
using System.Threading.Tasks;
using Application.Error;
using Application.Interfaces;
using Application.Validators;
using Domain;
using FluentValidation;
using FluentValidation.AspNetCore;
using FluentValidation.Validators;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace Application.User
{
    public class Register
    {
        public class Command : IRequest<UserDto>
        {
            public string UserName { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }
            public string Avatar { get; set; }

        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.UserName).NotEmpty();
                RuleFor(x => x.Email).NotEmpty().EmailAddress();
                RuleFor(x => x.Password).Password();
            }
        }

        public class Handler : IRequestHandler<Command, UserDto>
        {
            private UserManager<AppUser> userManager;
            private IJwtGenerator jwtGenerator { get; set; }

            public Handler(UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
            {
                this.jwtGenerator = jwtGenerator;
                this.userManager = userManager;
            }
            public async Task<UserDto> Handle(Command request, CancellationToken cancellationToken)
            {
                if(await userManager.FindByEmailAsync(request.Email) != null)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already exists" });
                }
                if(await userManager.FindByEmailAsync(request.UserName) != null)
                {
                    throw new RestException(HttpStatusCode.BadRequest, new { Email = "Username already exists" });
                }
                var user = new AppUser{
                    Email = request.Email,
                    UserName = request.UserName,
                    Avatar = request.Avatar
                };

                var result = await userManager.CreateAsync(user, request.Password);
                if(!result.Succeeded) throw new Exception("Error registering user");

                return new UserDto{
                    UserName = user.UserName,
                    Email = user.Email,
                    Token = jwtGenerator.CreateToken(user),
                    Avatar = user.Avatar
                };
            }
        }
    }
}