using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Error;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Messages
{
    public class Create
    {
        public class Command : IRequest<MessageDto>
        {
            public string Content { get; set; }
            public Guid ChannelId {get; set; }
            public MessageType MessageType {get; set; } = MessageType.Text; 
            public IFormFile File {get; set; }
        }

    public class Handler : IRequestHandler<Command, MessageDto>
    {
        private readonly DataContext context;
        private readonly IUserAccessor userAccessor;
        private readonly IMapper mapper;
        private readonly IMediaUpload mediaUpload;

        public Handler(DataContext context, IUserAccessor userAccessor, IMapper mapper, IMediaUpload mediaUpload)
        {
            this.context = context;
            this.userAccessor = userAccessor;
            this.mapper = mapper;
            this.mediaUpload = mediaUpload;
        }
        public async Task<MessageDto> Handle(Command request, CancellationToken cancellationToken)
        {
           var user = await context.Users.SingleOrDefaultAsync(x => x.UserName == userAccessor.GetCurrentUserName());
           var channel = await context.Channels.SingleOrDefaultAsync(x => x.Id == request.ChannelId);

           if(channel == null) throw new RestException(HttpStatusCode.NotFound, new { channel = "Channel not found" });

           var message = new Message
           {
             Content = request.MessageType == MessageType.Text  ? request.Content : mediaUpload.UploadMedia(request.File).Url,
             Channel = channel,
             Sender =  user,
             CreatedAt = DateTime.Now,
             MessageType = request.MessageType
           };
           context.Messages.Add(message);
           if(await context.SaveChangesAsync() > 0)
           {
            return new MessageDto
            {
                Sender = new User.UserDto
                {
                    UserName = user.UserName,
                    Avatar = user.Avatar,
                    Email = user.Email,
                    Id = user.Id
                },
                Content = message.Content,
                CreatedAt = message.CreatedAt,
                Id = message.Id,
                MessageType = message.MessageType,
                ChannelId = channel.Id
                
            };
           }
           throw new Exception("There was a problem inserting the message");
        }
    }
  }
}