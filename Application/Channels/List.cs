using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Error;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;
using System.Net;
using SQLitePCL;

namespace Application.Channels
{
    public class List
    {
        public class Query : IRequest<List<Channel>>
        {
            public ChannelType ChannelType { get; set; } = ChannelType.Channel;
        }

        public class Handler : IRequestHandler<Query, List<Channel>>
        {
            private DataContext _context;
            private ILogger<List> _logger;

            public Handler(DataContext context, ILogger<List> logger)
            {
                _context = context ?? throw new ArgumentNullException(nameof(context));
                _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            }
            public async Task<List<Channel>> Handle(Query request, CancellationToken cancellationToken)
            {
                /*probar el cancellationToken:
                try
                {
                    for (int i = 0; i < 10; i++)
                    {
                        cancellationToken.ThrowIfCancellationRequested();
                        await Task.Delay(1000, cancellationToken);
                        _logger.LogInformation($"Tarea {i} completada");
                    }
                }
                catch (System.Exception ex) when (ex is TaskCanceledException)
                {
                    _logger.LogInformation("La tarea fue cancelada");
                }*/
                //throw new RestException(HttpStatusCode.NotFound, new { channel = "Not Found" });
                //throw new Exception("Server ERROR");
                return await _context.Channels.Where(x => x.ChannelType == request.ChannelType).ToListAsync();
            }
        }
  }
}