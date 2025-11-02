using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Error;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Channels
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Guid Id {get; set; }
            public string Name {get; set; }
            public string Description {get; set; }
            public ChannelType ChannelType { get; set; } = ChannelType.Channel;

        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {   
                _context = context;
            }
            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var channel = await _context.Channels.FindAsync(request.Id);
                if (channel == null) throw new RestException(HttpStatusCode.NotFound, new { Channel = "Channel not found" });
                channel.Description = request.Description ?? channel.Description;
                channel.Name = request.Name ?? channel.Name;
                channel.ChannelType = request.ChannelType;

                var success = await _context.SaveChangesAsync() > 0;

                if(success) return Unit.Value;
                throw new Exception("Ocurrio un problema al modificar los datos del canal");             
            }
        }
  }
}