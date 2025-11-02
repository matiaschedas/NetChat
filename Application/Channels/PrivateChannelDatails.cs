using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.Common;
using System.Linq;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Channel = Domain.Channel;

namespace Application.Channels
{
    public class PrivateChannelDatails
    {
        public class Query : IRequest<ChannelDto>
        {
            public string UserId {get; set; }
        }

        public class Handler : IRequestHandler<Query, ChannelDto>
        {
            private DataContext context;
            private IMapper mapper;
            private IUserAccessor userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                this.context = context; 
                this.mapper = mapper;
                this.userAccessor = userAccessor;
            }

            public async Task<ChannelDto> Handle(Query request, CancellationToken cancellationToken)
            {
                var currentUser = await context.Users.SingleOrDefaultAsync(x => x.UserName == userAccessor.GetCurrentUserName());
                var user = await context.Users.FindAsync(request.UserId);
                //aca validar que ambos usuarios existan
                var privateChannelIdForCurrentUser = GetPrivateChannelId(currentUser.Id.ToString(), user.Id.ToString());
                var privateChannelIdForRecipientUser = GetPrivateChannelId(user.Id.ToString(), currentUser.Id.ToString()); 
                var channel = await context.Channels
                                    .Include(x => x.Messages)
                                    .ThenInclude(x => x.Sender)
                                    .SingleOrDefaultAsync(x => x.PrivateChannelId == privateChannelIdForCurrentUser || x.PrivateChannelId == privateChannelIdForRecipientUser);
                if (channel == null)
                {
                    var newChannel = new Channel
                    {
                        Id = Guid.NewGuid(),
                        Name = currentUser.UserName,
                        Description = user.UserName,
                        ChannelType = ChannelType.Room,
                        PrivateChannelId = privateChannelIdForCurrentUser
                    };
                    context.Channels.Add(newChannel);
                    var success = await context.SaveChangesAsync() > 0;
                    if (success)
                    {
                        return mapper.Map<Channel, ChannelDto>(newChannel);
                    }
                }
                var channelToReturn = mapper.Map<Channel, ChannelDto>(channel);
                return channelToReturn;

            }

            private string GetPrivateChannelId(string currentUserId, string userId) => $"{currentUserId}/{userId}";
         }
    }
}