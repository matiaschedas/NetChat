using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Threading;
using System.Threading.Tasks;
using Application.Error;
using MediatR;
using Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure;
using Persistence;

namespace Application.User
{
    public class Logout
    {
        public class Query : IRequest {
            public string UserId { get; set; }
        }
        public class Handler : IRequestHandler<Query>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;     
            }
            public async Task<Unit> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.FindAsync(request.UserId);
                if(user == null) throw new RestException(HttpStatusCode.NotFound);
                if( !user.IsOnline ) return Unit.Value;
                user.IsOnline = false;
                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Unit.Value;
                throw new System.Exception("ERROR");
            }
        }
    }
}