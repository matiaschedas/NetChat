using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Application.Messages
{
    public class MessageDto
    {
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public Application.User.UserDto Sender { get; set; }
        public MessageType MessageType {get; set; } 
        public Guid Id { get; set; }
        public Guid ChannelId { get; set; }
    }
}