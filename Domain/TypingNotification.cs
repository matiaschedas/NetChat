using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class TypingNotification
    {
        public Guid ChannelId { get; set; }
        public AppUser Sender { get; set; }

    }
}