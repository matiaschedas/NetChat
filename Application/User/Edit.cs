using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Reflection.Metadata;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;
using Application.Error;
using Application.Interfaces;
using Castle.DynamicProxy.Generators.Emitters.SimpleAST;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.User
{
    public class Edit
    {
        public class Command : IRequest
        {
            public string PrimaryAppColor { get; set; }
            public string SecundaryAppColor { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this._context = context;
                this._userAccessor = userAccessor;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUserName());
                if (user == null) throw new RestException(HttpStatusCode.NotFound, new { Channel = "Not Found" });

                user.PrimaryAppColor = request.PrimaryAppColor;
                user.SecundaryAppColor = request.SecundaryAppColor;
                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new Exception("Error updating user");
            }
        }
    }
}