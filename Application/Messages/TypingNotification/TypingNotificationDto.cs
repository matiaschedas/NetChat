using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Channels;
using Application.User;

namespace Application.Messages.TypingNotification
{
    public class TypingNotificationDto
    {
        public UserDto Sender { get; set; } 
        public ChannelDto Channel { get; set; }
    }
}