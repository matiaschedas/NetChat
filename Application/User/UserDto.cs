using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.User
{
    public class UserDto
    {
        public string Token { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Avatar { get; set; }
        public string Id { get; set; }
        public bool IsOnline { get; set; }
        public string PrimaryAppColor { get; set; }
        public string SecundaryAppColor { get; set; }

    }
}